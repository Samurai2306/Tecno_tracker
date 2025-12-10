import React, { useState, useEffect } from 'react';
import { useTechnologies } from '../../hooks/useTechnologies';
import './Settings.css';

const Settings = ({ userId, onLogout }) => {
  const { technologies, setTechnologies } = useTechnologies(userId);
  const [exportData, setExportData] = useState('');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(`technology-tracker-settings-${userId}`);
    return saved ? JSON.parse(saved) : {
      showCompleted: true,
      showInProgress: true,
      showNotStarted: true,
      itemsPerPage: 20,
      enableNotifications: false,
      compactMode: false,
      autoSave: true
    };
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`technology-tracker-settings-${userId}`, JSON.stringify(settings));
    }
  }, [settings, userId]);

  // Валидация структуры данных технологии
  const validateTechnology = (tech) => {
    if (!tech || typeof tech !== 'object') {
      return { valid: false, error: 'Технология должна быть объектом' };
    }
    if (!tech.id || typeof tech.id !== 'number') {
      return { valid: false, error: 'Технология должна иметь числовой id' };
    }
    if (!tech.title || typeof tech.title !== 'string' || tech.title.trim() === '') {
      return { valid: false, error: 'Технология должна иметь непустое название' };
    }
    if (tech.status && !['not-started', 'in-progress', 'completed'].includes(tech.status)) {
      return { valid: false, error: `Неверный статус: ${tech.status}` };
    }
    return { valid: true };
  };

  // Валидация массива технологий
  const validateTechnologies = (data) => {
    if (!Array.isArray(data)) {
      return { valid: false, error: 'Данные должны быть массивом' };
    }
    if (data.length === 0) {
      return { valid: false, error: 'Массив не может быть пустым' };
    }
    
    const errors = [];
    data.forEach((tech, index) => {
      const validation = validateTechnology(tech);
      if (!validation.valid) {
        errors.push(`Элемент ${index + 1}: ${validation.error}`);
      }
    });
    
    if (errors.length > 0) {
      return { valid: false, error: errors.join('; ') };
    }
    
    return { valid: true };
  };

  const handleExport = () => {
    try {
      // Проверяем данные перед экспортом
      const validation = validateTechnologies(technologies);
      if (!validation.valid) {
        alert(`Ошибка валидации данных перед экспортом: ${validation.error}`);
        return;
      }

      const data = JSON.stringify(technologies, null, 2);
      
      // Проверяем, что JSON валиден
      try {
        JSON.parse(data);
      } catch (e) {
        alert('Ошибка: невозможно создать валидный JSON файл');
        return;
      }

      setExportData(data);
      navigator.clipboard.writeText(data).then(() => {
        alert('Данные успешно скопированы в буфер обмена!');
      }).catch((err) => {
        alert(`Ошибка при копировании в буфер обмена: ${err.message}`);
      });
    } catch (error) {
      alert(`Ошибка при экспорте данных: ${error.message}`);
    }
  };

  const handleExportFile = () => {
    try {
      // Проверяем данные перед экспортом
      const validation = validateTechnologies(technologies);
      if (!validation.valid) {
        alert(`Ошибка валидации данных перед экспортом: ${validation.error}`);
        return;
      }

      const data = JSON.stringify(technologies, null, 2);
      
      // Проверяем, что JSON валиден
      try {
        JSON.parse(data);
      } catch (e) {
        alert('Ошибка: невозможно создать валидный JSON файл');
        return;
      }

      const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `technology-tracker-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Файл успешно экспортирован!');
    } catch (error) {
      alert(`Ошибка при экспорте файла: ${error.message}`);
    }
  };

  const handleImport = () => {
    if (!exportData.trim()) {
      alert('Поле для импорта пусто. Вставьте JSON данные.');
      return;
    }

    try {
      // Парсим JSON
      let data;
      try {
        data = JSON.parse(exportData);
      } catch (parseError) {
        alert(`Ошибка парсинга JSON: ${parseError.message}\n\nУбедитесь, что данные в формате валидного JSON.`);
        return;
      }

      // Валидируем структуру
      const validation = validateTechnologies(data);
      if (!validation.valid) {
        alert(`Ошибка валидации данных:\n${validation.error}\n\nПроверьте формат данных и попробуйте снова.`);
        return;
      }

      // Подтверждение перед импортом
      if (!window.confirm(`Вы уверены, что хотите импортировать ${data.length} технологий? Это заменит текущие данные.`)) {
        return;
      }

      setTechnologies(data);
      alert(`Данные успешно импортированы! Импортировано ${data.length} технологий.`);
      setExportData('');
    } catch (error) {
      alert(`Ошибка при импорте данных: ${error.message}\n\nПроверьте формат данных и попробуйте снова.`);
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Проверяем тип файла
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      alert('Ошибка: выбранный файл не является JSON файлом. Пожалуйста, выберите файл с расширением .json');
      e.target.value = ''; // Сбрасываем значение input
      return;
    }

    // Проверяем размер файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Ошибка: файл слишком большой. Максимальный размер: 10MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    
    reader.onerror = () => {
      alert('Ошибка при чтении файла. Попробуйте выбрать другой файл.');
      e.target.value = '';
    };

    reader.onload = (event) => {
      try {
        let data;
        try {
          data = JSON.parse(event.target.result);
        } catch (parseError) {
          alert(`Ошибка парсинга JSON файла: ${parseError.message}\n\nУбедитесь, что файл содержит валидный JSON.`);
          e.target.value = '';
          return;
        }

        // Валидируем структуру
        const validation = validateTechnologies(data);
        if (!validation.valid) {
          alert(`Ошибка валидации данных в файле:\n${validation.error}\n\nПроверьте формат данных в файле и попробуйте снова.`);
          e.target.value = '';
          return;
        }

        // Подтверждение перед импортом
        if (!window.confirm(`Вы уверены, что хотите импортировать ${data.length} технологий из файла "${file.name}"? Это заменит текущие данные.`)) {
          e.target.value = '';
          return;
        }

        setTechnologies(data);
        alert(`Данные успешно импортированы из файла "${file.name}"! Импортировано ${data.length} технологий.`);
        e.target.value = ''; // Сбрасываем значение input для возможности повторного выбора того же файла
      } catch (error) {
        alert(`Ошибка при обработке файла: ${error.message}\n\nПроверьте содержимое файла и попробуйте снова.`);
        e.target.value = '';
      }
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleClear = () => {
    if (window.confirm('Вы уверены, что хотите очистить все данные текущего пользователя?')) {
      if (userId) {
        localStorage.removeItem(`technology-tracker-data-${userId}`);
        window.location.reload();
      }
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки?')) {
      if (userId) {
        localStorage.removeItem(`technology-tracker-settings-${userId}`);
        window.location.reload();
      }
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const stats = {
    total: technologies.length,
    completed: technologies.filter(t => t.status === 'completed').length,
    inProgress: technologies.filter(t => t.status === 'in-progress').length,
    notStarted: technologies.filter(t => t.status === 'not-started').length,
    byCategory: technologies.reduce((acc, tech) => {
      acc[tech.category] = (acc[tech.category] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="settings">
      <h2 className="settings__title">Настройки</h2>
      
      <div className="settings__section">
        <h3 className="settings__section-title">Отображение</h3>
        <div className="settings__option">
          <label className="settings__checkbox-label">
            <input
              type="checkbox"
              checked={settings.showCompleted}
              onChange={(e) => updateSetting('showCompleted', e.target.checked)}
              className="settings__checkbox"
              aria-label="Показывать завершенные технологии"
            />
            <span>Показывать завершенные технологии</span>
          </label>
        </div>
        <div className="settings__option">
          <label className="settings__checkbox-label">
            <input
              type="checkbox"
              checked={settings.showInProgress}
              onChange={(e) => updateSetting('showInProgress', e.target.checked)}
              className="settings__checkbox"
              aria-label="Показывать технологии в процессе"
            />
            <span>Показывать технологии в процессе</span>
          </label>
        </div>
        <div className="settings__option">
          <label className="settings__checkbox-label">
            <input
              type="checkbox"
              checked={settings.showNotStarted}
              onChange={(e) => updateSetting('showNotStarted', e.target.checked)}
              className="settings__checkbox"
              aria-label="Показывать не начатые технологии"
            />
            <span>Показывать не начатые технологии</span>
          </label>
        </div>
        <div className="settings__option">
          <label className="settings__checkbox-label">
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSetting('compactMode', e.target.checked)}
              className="settings__checkbox"
              aria-label="Компактный режим"
            />
            <span>Компактный режим</span>
          </label>
        </div>
        <div className="settings__option">
          <label className="settings__select-label">
            Элементов на странице:
            <select
              value={settings.itemsPerPage}
              onChange={(e) => updateSetting('itemsPerPage', parseInt(e.target.value))}
              className="settings__select"
              aria-label="Количество элементов на странице"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Уведомления</h3>
        <div className="settings__option">
          <label className="settings__checkbox-label">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
              className="settings__checkbox"
              aria-label="Включить уведомления"
            />
            <span>Включить уведомления о прогрессе</span>
          </label>
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Автосохранение</h3>
        <div className="settings__option">
          <label className="settings__checkbox-label">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => updateSetting('autoSave', e.target.checked)}
              className="settings__checkbox"
              aria-label="Автоматическое сохранение"
            />
            <span>Автоматическое сохранение изменений</span>
          </label>
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Статистика</h3>
        <div className="settings__stats">
          <div className="settings__stat-item">
            <span className="settings__stat-label">Всего технологий:</span>
            <span className="settings__stat-value">{stats.total}</span>
          </div>
          <div className="settings__stat-item">
            <span className="settings__stat-label">Завершено:</span>
            <span className="settings__stat-value">{stats.completed}</span>
          </div>
          <div className="settings__stat-item">
            <span className="settings__stat-label">В процессе:</span>
            <span className="settings__stat-value">{stats.inProgress}</span>
          </div>
          <div className="settings__stat-item">
            <span className="settings__stat-label">Не начато:</span>
            <span className="settings__stat-value">{stats.notStarted}</span>
          </div>
        </div>
        <div className="settings__category-stats">
          <h4 className="settings__category-stats-title">По категориям:</h4>
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} className="settings__category-stat">
              <span>{category}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Экспорт данных</h3>
        <p className="settings__section-description">
          Скопируйте данные для резервного копирования
        </p>
        <div className="settings__button-group">
          <button
            className="settings__button settings__button--export"
            onClick={handleExport}
            aria-label="Экспортировать данные в буфер обмена"
          >
            Экспортировать в буфер обмена
          </button>
          <button
            className="settings__button settings__button--export"
            onClick={handleExportFile}
            aria-label="Экспортировать данные в файл"
          >
            Экспортировать в файл
          </button>
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Импорт данных</h3>
        <p className="settings__section-description">
          Вставьте JSON данные или загрузите файл для восстановления
        </p>
        <textarea
          className="settings__textarea"
          value={exportData}
          onChange={(e) => setExportData(e.target.value)}
          placeholder="Вставьте JSON данные здесь..."
          rows={10}
          aria-label="Поле для вставки JSON данных"
        />
        <div className="settings__button-group">
          <button
            className="settings__button settings__button--import"
            onClick={handleImport}
            disabled={!exportData.trim()}
            aria-label="Импортировать данные из текстового поля"
          >
            Импортировать из текста
          </button>
          <label className="settings__button settings__button--import settings__file-label">
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="settings__file-input"
              aria-label="Импортировать данные из файла"
            />
            Импортировать из файла
          </label>
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Сброс настроек</h3>
        <p className="settings__section-description">
          Вернуть все настройки к значениям по умолчанию
        </p>
        <button
          className="settings__button settings__button--warning"
          onClick={handleResetSettings}
          aria-label="Сбросить настройки"
        >
          Сбросить настройки
        </button>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Опасная зона</h3>
        <p className="settings__section-description">
          Очистить все данные текущего пользователя
        </p>
        <button
          className="settings__button settings__button--danger"
          onClick={handleClear}
          aria-label="Очистить все данные"
        >
          Очистить все данные
        </button>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Управление аккаунтом</h3>
        <p className="settings__section-description">
          Выйти из текущего аккаунта
        </p>
        <button
          className="settings__button settings__button--warning"
          onClick={onLogout}
          aria-label="Выйти из аккаунта"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default Settings;
