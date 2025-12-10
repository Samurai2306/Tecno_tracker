import React, { useState, useEffect } from 'react';
import './DeadlineForm.css';

const DeadlineForm = ({ technology, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    startDate: technology.startDate || '',
    deadline: technology.deadline || '',
    estimatedHours: technology.estimatedHours || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Валидация в реальном времени
  useEffect(() => {
    const newErrors = {};

    // Валидация даты начала
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(startDate.getTime())) {
        newErrors.startDate = 'Неверный формат даты';
      } else if (startDate < today) {
        newErrors.startDate = 'Дата начала не может быть в прошлом';
      }
    }

    // Валидация дедлайна
    if (formData.deadline) {
      const deadline = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(deadline.getTime())) {
        newErrors.deadline = 'Неверный формат даты';
      } else if (deadline < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом';
      } else if (formData.startDate) {
        const startDate = new Date(formData.startDate);
        if (deadline < startDate) {
          newErrors.deadline = 'Дедлайн не может быть раньше даты начала';
        }
      }
    }

    // Валидация часов
    if (formData.estimatedHours) {
      const hours = parseFloat(formData.estimatedHours);
      if (isNaN(hours) || hours <= 0) {
        newErrors.estimatedHours = 'Количество часов должно быть положительным числом';
      } else if (hours > 10000) {
        newErrors.estimatedHours = 'Количество часов слишком большое (максимум 10000)';
      }
    }

    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Отмечаем поле как "тронутое" при изменении
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверяем все поля перед отправкой
    const allTouched = {
      startDate: true,
      deadline: true,
      estimatedHours: true
    };
    setTouched(allTouched);

    // Если есть ошибки, не отправляем форму
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Сохраняем данные
    onSave(formData);
  };

  const isFieldInvalid = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form 
      className="deadline-form" 
      onSubmit={handleSubmit}
      aria-label={`Форма установки сроков изучения для ${technology.title}`}
      noValidate
    >
      <div className="deadline-form__header">
        <h3 className="deadline-form__title">
          Установить сроки изучения: {technology.title}
        </h3>
      </div>

      <div className="deadline-form__field">
        <label 
          htmlFor={`startDate-${technology.id}`} 
          className="deadline-form__label"
        >
          Дата начала изучения
        </label>
        <input
          type="date"
          id={`startDate-${technology.id}`}
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`deadline-form__input ${isFieldInvalid('startDate') ? 'deadline-form__input--error' : ''}`}
          min={today}
          aria-required="false"
          aria-invalid={isFieldInvalid('startDate')}
          aria-describedby={isFieldInvalid('startDate') ? `startDate-error-${technology.id}` : undefined}
        />
        {isFieldInvalid('startDate') && (
          <div 
            id={`startDate-error-${technology.id}`}
            className="deadline-form__error"
            role="alert"
            aria-live="polite"
          >
            {getFieldError('startDate')}
          </div>
        )}
      </div>

      <div className="deadline-form__field">
        <label 
          htmlFor={`deadline-${technology.id}`} 
          className="deadline-form__label"
        >
          Дедлайн (срок завершения) <span className="deadline-form__required">*</span>
        </label>
        <input
          type="date"
          id={`deadline-${technology.id}`}
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`deadline-form__input ${isFieldInvalid('deadline') ? 'deadline-form__input--error' : ''}`}
          min={formData.startDate || today}
          required
          aria-required="true"
          aria-invalid={isFieldInvalid('deadline')}
          aria-describedby={isFieldInvalid('deadline') ? `deadline-error-${technology.id}` : undefined}
        />
        {isFieldInvalid('deadline') && (
          <div 
            id={`deadline-error-${technology.id}`}
            className="deadline-form__error"
            role="alert"
            aria-live="polite"
          >
            {getFieldError('deadline')}
          </div>
        )}
      </div>

      <div className="deadline-form__field">
        <label 
          htmlFor={`estimatedHours-${technology.id}`} 
          className="deadline-form__label"
        >
          Оценочное количество часов
        </label>
        <input
          type="number"
          id={`estimatedHours-${technology.id}`}
          name="estimatedHours"
          value={formData.estimatedHours}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`deadline-form__input ${isFieldInvalid('estimatedHours') ? 'deadline-form__input--error' : ''}`}
          min="0.1"
          max="10000"
          step="0.1"
          placeholder="Например: 40"
          aria-required="false"
          aria-invalid={isFieldInvalid('estimatedHours')}
          aria-describedby={isFieldInvalid('estimatedHours') ? `estimatedHours-error-${technology.id}` : undefined}
        />
        {isFieldInvalid('estimatedHours') && (
          <div 
            id={`estimatedHours-error-${technology.id}`}
            className="deadline-form__error"
            role="alert"
            aria-live="polite"
          >
            {getFieldError('estimatedHours')}
          </div>
        )}
      </div>

      <div className="deadline-form__actions">
        <button
          type="button"
          onClick={onCancel}
          className="deadline-form__button deadline-form__button--cancel"
          aria-label="Отменить установку сроков"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="deadline-form__button deadline-form__button--submit"
          disabled={Object.keys(errors).length > 0}
          aria-label="Сохранить сроки изучения"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
};

export default DeadlineForm;

