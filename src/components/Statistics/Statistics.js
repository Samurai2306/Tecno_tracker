import React from 'react';
import './Statistics.css';

const Statistics = ({ technologies }) => {
  const total = technologies.length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Статистика по категориям
  const categories = ['Frontend', 'Backend', 'DevOps', 'Data Science', 'ML-dev'];
  const categoryStats = categories.map(cat => ({
    name: cat,
    count: technologies.filter(t => t.category === cat).length,
    completed: technologies.filter(t => t.category === cat && t.status === 'completed').length
  }));

  const mostPopularCategory = categoryStats.reduce((max, cat) => 
    cat.count > max.count ? cat : max, categoryStats[0] || { name: 'N/A', count: 0 });

  return (
    <div className="statistics">
      <h3 className="statistics__title">Статистика</h3>
      <div className="statistics__grid">
        <div className="statistics__item">
          <div className="statistics__item-label">Всего технологий</div>
          <div className="statistics__item-value">{total}</div>
        </div>
        <div className="statistics__item statistics__item--not-started">
          <div className="statistics__item-label">Не начато</div>
          <div className="statistics__item-value">{notStarted}</div>
        </div>
        <div className="statistics__item statistics__item--in-progress">
          <div className="statistics__item-label">В процессе</div>
          <div className="statistics__item-value">{inProgress}</div>
        </div>
        <div className="statistics__item statistics__item--completed">
          <div className="statistics__item-label">Завершено</div>
          <div className="statistics__item-value">{completed}</div>
        </div>
        <div className="statistics__item statistics__item--progress">
          <div className="statistics__item-label">Прогресс</div>
          <div className="statistics__item-value">{progress}%</div>
        </div>
        {mostPopularCategory.count > 0 && (
          <div className="statistics__item statistics__item--category">
            <div className="statistics__item-label">Популярная категория</div>
            <div className="statistics__item-value" style={{ fontSize: '1.5rem' }}>
              {mostPopularCategory.name}
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.8 }}>
              ({mostPopularCategory.count} технологий)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;

