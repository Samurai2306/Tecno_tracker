import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTechnologies } from '../../hooks/useTechnologies';
import './AddTechnology.css';

const AddTechnology = ({ userId }) => {
  const navigate = useNavigate();
  const { addTechnology } = useTechnologies(userId);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    status: 'not-started',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addTechnology(formData);
      navigate('/technologies');
    }
  };

  return (
    <div className="add-technology">
      <h2 className="add-technology__title">Добавить новую технологию</h2>
      <form className="add-technology__form" onSubmit={handleSubmit}>
        <div className="add-technology__field">
          <label htmlFor="title" className="add-technology__label">
            Название технологии *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="add-technology__input"
            required
            placeholder="Например: React"
          />
        </div>
        <div className="add-technology__field">
          <label htmlFor="description" className="add-technology__label">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="add-technology__textarea"
            rows={4}
            placeholder="Описание технологии..."
          />
        </div>
        <div className="add-technology__field">
          <label htmlFor="category" className="add-technology__label">
            Категория *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="add-technology__select"
            required
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="DevOps">DevOps</option>
            <option value="Data Science">Data Science</option>
            <option value="ML-dev">ML-dev</option>
          </select>
        </div>
        <div className="add-technology__field">
          <label htmlFor="status" className="add-technology__label">
            Статус
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="add-technology__select"
          >
            <option value="not-started">Не начато</option>
            <option value="in-progress">В процессе</option>
            <option value="completed">Завершено</option>
          </select>
        </div>
        <div className="add-technology__field">
          <label htmlFor="notes" className="add-technology__label">
            Заметки
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="add-technology__textarea"
            rows={3}
            placeholder="Добавьте заметки..."
          />
        </div>
        <div className="add-technology__actions">
          <button
            type="button"
            onClick={() => navigate('/technologies')}
            className="add-technology__button add-technology__button--cancel"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="add-technology__button add-technology__button--submit"
          >
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTechnology;

