import React from 'react';
import { Link } from 'react-router-dom';
import ProgressHeader from '../../components/ProgressHeader/ProgressHeader';
import Statistics from '../../components/Statistics/Statistics';
import QuickActions from '../../components/QuickActions/QuickActions';
import RoadmapImporter from '../../components/RoadmapImporter/RoadmapImporter';
import { useTechnologies } from '../../hooks/useTechnologies';
import './Home.css';

const Home = ({ userId }) => {
  const { technologies, updateStatus } = useTechnologies(userId);

  const handleMarkAllCompleted = () => {
    technologies.forEach(tech => {
      if (tech.status !== 'completed') {
        updateStatus(tech.id, 'completed');
      }
    });
  };

  const handleResetAll = () => {
    technologies.forEach(tech => {
      if (tech.status !== 'not-started') {
        updateStatus(tech.id, 'not-started');
      }
    });
  };

  const handleRandomSelect = () => {
    const notStarted = technologies.filter(t => t.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      updateStatus(randomTech.id, 'in-progress');
    }
  };

  const handleExport = () => {
    console.log('Экспорт данных:', JSON.stringify(technologies, null, 2));
    alert('Данные экспортированы в консоль!');
  };

  const recentTechnologies = technologies
    .filter(t => t.status === 'in-progress')
    .slice(0, 3);

  return (
    <div className="home">
      <h2 className="home__title">Добро пожаловать в трекер изучения технологий!</h2>
      <ProgressHeader technologies={technologies} />
      <Statistics technologies={technologies} />
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <RoadmapImporter userId={userId} />
      </div>
      <QuickActions
        onMarkAllCompleted={handleMarkAllCompleted}
        onResetAll={handleResetAll}
        onRandomSelect={handleRandomSelect}
        onExport={handleExport}
      />
      {recentTechnologies.length > 0 && (
        <div className="home__section">
          <h3 className="home__section-title">Технологии в процессе изучения</h3>
          <div className="home__technologies">
            {recentTechnologies.map(tech => (
              <Link
                key={tech.id}
                to={`/technologies/${tech.id}`}
                className="home__tech-link"
              >
                <div className="home__tech-card">
                  {tech.category && (
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#c084fc',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {tech.category}
                    </span>
                  )}
                  <h4>{tech.title}</h4>
                  <p>{tech.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/technologies" className="home__view-all">
            Посмотреть все технологии
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

