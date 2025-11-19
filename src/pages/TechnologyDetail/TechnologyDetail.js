import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TechnologyCard from '../../components/TechnologyCard/TechnologyCard';
import TechnologyResources from '../../components/TechnologyResources/TechnologyResources';
import { useTechnologies } from '../../hooks/useTechnologies';
import './TechnologyDetail.css';

const TechnologyDetail = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { technologies, updateStatus, updateNotes } = useTechnologies(userId);
  
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

  return (
    <div className="technology-detail">
      <button
        className="technology-detail__back"
        onClick={() => navigate('/technologies')}
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
        <TechnologyResources technologyId={technology.id} />
      </div>
    </div>
  );
};

export default TechnologyDetail;

