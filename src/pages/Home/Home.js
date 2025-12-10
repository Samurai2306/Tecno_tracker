import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProgressHeader from '../../components/ProgressHeader/ProgressHeader';
import Statistics from '../../components/Statistics/Statistics';
import QuickActions from '../../components/QuickActions/QuickActions';
import RoadmapImporter from '../../components/RoadmapImporter/RoadmapImporter';
import TechnologyCard from '../../components/TechnologyCard/TechnologyCard';
import { useTechnologies } from '../../hooks/useTechnologies';
import { getTimeUntilDeadline, getDeadlineUrgency } from '../../utils/deadlineUtils';
import './Home.css';

const Home = ({ userId }) => {
  const { technologies, updateStatus, updateNotes } = useTechnologies(userId);

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

  // Технологии в процессе с приоритетом по дедлайнам
  const recentTechnologies = useMemo(() => {
    const inProgress = technologies.filter(t => t.status === 'in-progress');
    
    // Сортируем: сначала с дедлайнами (по срочности), затем без дедлайнов
    return inProgress.sort((a, b) => {
      const aDeadline = a.deadline ? getTimeUntilDeadline(a.deadline) : null;
      const bDeadline = b.deadline ? getTimeUntilDeadline(b.deadline) : null;
      
      // Если у обеих есть дедлайны, сортируем по срочности
      if (aDeadline && bDeadline) {
        const aUrgency = getDeadlineUrgency(a.deadline);
        const bUrgency = getDeadlineUrgency(b.deadline);
        
        const urgencyOrder = { 'overdue': 0, 'urgent': 1, 'soon': 2, 'normal': 3 };
        if (urgencyOrder[aUrgency] !== urgencyOrder[bUrgency]) {
          return urgencyOrder[aUrgency] - urgencyOrder[bUrgency];
        }
        
        // Если срочность одинаковая, сортируем по времени до дедлайна
        return (aDeadline.totalDays || Infinity) - (bDeadline.totalDays || Infinity);
      }
      
      // Технологии с дедлайнами идут первыми
      if (aDeadline && !bDeadline) return -1;
      if (!aDeadline && bDeadline) return 1;
      
      return 0;
    }).slice(0, 3);
  }, [technologies]);

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
          <div className="home__technologies-grid">
            {recentTechnologies.map(tech => (
              <TechnologyCard
                key={tech.id}
                technology={tech}
                onStatusChange={updateStatus}
                onNotesChange={updateNotes}
                showNotes={false}
                linkTo={`/technologies/${tech.id}`}
              />
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

