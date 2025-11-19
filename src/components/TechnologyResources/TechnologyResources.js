import React, { useState, useEffect } from 'react';
import { useTechnologiesApi } from '../../hooks/useTechnologiesApi';
import './TechnologyResources.css';

const TechnologyResources = ({ technologyId }) => {
  const { fetchResources, loading, error } = useTechnologiesApi();
  const [resources, setResources] = useState(null);

  useEffect(() => {
    if (technologyId) {
      fetchResources(technologyId)
        .then(data => setResources(data))
        .catch(err => console.error('Ошибка загрузки ресурсов:', err));
    }
  }, [technologyId, fetchResources]);

  if (!technologyId) return null;

  if (loading) {
    return <div className="technology-resources__loading">Загрузка ресурсов...</div>;
  }

  if (error) {
    return <div className="technology-resources__error">Ошибка: {error}</div>;
  }

  if (!resources || !resources.resources || resources.resources.length === 0) {
    return null;
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'documentation':
        return '[DOC]';
      case 'tutorial':
        return '[TUT]';
      case 'video':
        return '[VID]';
      default:
        return '[LINK]';
    }
  };

  return (
    <div className="technology-resources">
      <h4 className="technology-resources__title">Дополнительные ресурсы</h4>
      <div className="technology-resources__list">
        {resources.resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="technology-resources__item"
          >
            <span className="technology-resources__icon">
              {getResourceIcon(resource.type)}
            </span>
            <span className="technology-resources__text">{resource.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TechnologyResources;

