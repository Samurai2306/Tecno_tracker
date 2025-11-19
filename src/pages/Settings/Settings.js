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

  const handleExport = () => {
    const data = JSON.stringify(technologies, null, 2);
    setExportData(data);
    navigator.clipboard.writeText(data).then(() => {
      alert('Данные скопированы в буфер обмена!');
    });
  };

  const handleExportFile = () => {
    const data = JSON.stringify(technologies, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `technology-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(exportData);
      if (Array.isArray(data)) {
        setTechnologies(data);
        alert('Данные успешно импортированы!');
        setExportData('');
      } else {
        alert('Неверный формат данных!');
      }
    } catch (e) {
      alert('Ошибка при импорте данных: ' + e.message);
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (Array.isArray(data)) {
            setTechnologies(data);
            alert('Данные успешно импортированы из файла!');
          } else {
            alert('Неверный формат данных!');
          }
        } catch (error) {
          alert('Ошибка при чтении файла: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
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
