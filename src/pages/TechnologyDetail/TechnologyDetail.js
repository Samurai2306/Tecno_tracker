import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TechnologyCard from '../../components/TechnologyCard/TechnologyCard';
import TechnologyResources from '../../components/TechnologyResources/TechnologyResources';
import DeadlineForm from '../../components/DeadlineForm/DeadlineForm';
import Modal from '../../components/Modal/Modal';
import { useTechnologies } from '../../hooks/useTechnologies';
import './TechnologyDetail.css';

const TechnologyDetail = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { technologies, updateStatus, updateNotes, updateDeadline } = useTechnologies(userId);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  
  const technology = technologies.find(t => t.id === parseInt(id));

  if (!technology) {
    return (
      <div className="technology-detail">
        <div className="technology-detail__not-found">
          <h2>Технология не найдена</h2>
          <button onClick={() => navigate('/technologies')}>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const handleDeadlineSave = (deadlineData) => {
    updateDeadline(technology.id, deadlineData);
    setShowDeadlineForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="technology-detail">
      <button
        className="technology-detail__back"
        onClick={() => navigate('/technologies')}
        aria-label="Вернуться к списку технологий"
      >
        ← Назад к списку
      </button>
      <div className="technology-detail__card">
        <TechnologyCard
          technology={technology}
          onStatusChange={updateStatus}
          onNotesChange={updateNotes}
          showNotes={true}
        />
        
        <div className="technology-detail__deadline-section">
          <div className="technology-detail__deadline-info">
            <h3 className="technology-detail__deadline-title">Сроки изучения</h3>
            {technology.deadline ? (
              <div className="technology-detail__deadline-details">
                {technology.startDate && (
                  <div className="technology-detail__deadline-item">
                    <span className="technology-detail__deadline-label">Дата начала:</span>
                    <span className="technology-detail__deadline-value">{formatDate(technology.startDate)}</span>
                  </div>
                )}
                <div className="technology-detail__deadline-item">
                  <span className="technology-detail__deadline-label">Дедлайн:</span>
                  <span className="technology-detail__deadline-value">{formatDate(technology.deadline)}</span>
                </div>
                {technology.estimatedHours && (
                  <div className="technology-detail__deadline-item">
                    <span className="technology-detail__deadline-label">Оценочные часы:</span>
                    <span className="technology-detail__deadline-value">{technology.estimatedHours} ч.</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="technology-detail__deadline-empty">Сроки не установлены</p>
            )}
            <button
              className="technology-detail__deadline-button"
              onClick={() => setShowDeadlineForm(true)}
              aria-label="Установить или изменить сроки изучения"
            >
              {technology.deadline ? 'Изменить сроки' : 'Установить сроки'}
            </button>
          </div>
        </div>

        <TechnologyResources technologyId={technology.id} />
      </div>

      <Modal isOpen={showDeadlineForm} onClose={() => setShowDeadlineForm(false)}>
        <DeadlineForm
          technology={technology}
          onSave={handleDeadlineSave}
          onCancel={() => setShowDeadlineForm(false)}
        />
      </Modal>
    </div>
  );
};

export default TechnologyDetail;

