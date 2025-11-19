import React, { useState } from 'react';
import { useTechnologiesApi } from '../../hooks/useTechnologiesApi';
import { useTechnologies } from '../../hooks/useTechnologies';
import Modal from '../Modal/Modal';
import './RoadmapImporter.css';

const RoadmapImporter = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { technologies: apiTechnologies, loading, error, loadTechnologies } = useTechnologiesApi();
  const { technologies: localTechnologies, addTechnology } = useTechnologies(userId);
  const [importedIds, setImportedIds] = useState([]);

  const handleOpen = async () => {
    setIsOpen(true);
    if (apiTechnologies.length === 0) {
      await loadTechnologies();
    }
  };

  const handleImport = (technology) => {
    // Проверяем, не импортирована ли уже эта технология
    const exists = localTechnologies.some(t => t.title === technology.title);
    if (exists) {
      alert('Эта технология уже добавлена!');
      return;
    }

    addTechnology(technology);
    setImportedIds(prev => [...prev, technology.id]);
    alert(`Технология "${technology.title}" успешно импортирована!`);
  };

  const handleImportAll = () => {
    const toImport = apiTechnologies.filter(
      tech => !localTechnologies.some(t => t.title === tech.title)
    );

    if (toImport.length === 0) {
      alert('Все технологии уже импортированы!');
      return;
    }

    toImport.forEach(tech => {
      addTechnology(tech);
      setImportedIds(prev => [...prev, tech.id]);
    });

    alert(`Импортировано ${toImport.length} технологий!`);
  };

  return (
    <>
      <button
        className="roadmap-importer__button"
        onClick={handleOpen}
      >
        Импорт дорожной карты
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Импорт дорожной карты"
      >
        <div className="roadmap-importer">
          {loading && <div className="roadmap-importer__loading">Загрузка...</div>}
          {error && <div className="roadmap-importer__error">Ошибка: {error}</div>}
          {!loading && !error && (
            <>
              <div className="roadmap-importer__header">
                <p className="roadmap-importer__description">
                  Выберите технологии для импорта из внешнего источника
                </p>
                <button
                  className="roadmap-importer__import-all"
                  onClick={handleImportAll}
                >
                  Импортировать все
                </button>
              </div>
              <div className="roadmap-importer__list">
                {apiTechnologies.map(tech => {
                  const isImported = importedIds.includes(tech.id) ||
                    localTechnologies.some(t => t.title === tech.title);
                  return (
                    <div
                      key={tech.id}
                      className={`roadmap-importer__item ${
                        isImported ? 'roadmap-importer__item--imported' : ''
                      }`}
                    >
                      <div className="roadmap-importer__item-content">
                        <h4 className="roadmap-importer__item-title">{tech.title}</h4>
                        <p className="roadmap-importer__item-description">
                          {tech.description}
                        </p>
                      </div>
                      <button
                        className="roadmap-importer__item-button"
                        onClick={() => handleImport(tech)}
                        disabled={isImported}
                      >
                        {isImported ? '[V] Импортировано' : 'Импортировать'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default RoadmapImporter;

