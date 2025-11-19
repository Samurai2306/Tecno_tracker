import React from 'react';
import { useTechnologies } from '../../hooks/useTechnologies';
import Statistics from '../../components/Statistics/Statistics';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './StatisticsPage.css';

const StatisticsPage = ({ userId }) => {
  const { technologies, calculateProgress } = useTechnologies(userId);

  const total = technologies.length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const progress = calculateProgress();

  // Статистика по категориям
  const categories = ['Frontend', 'Backend', 'DevOps', 'Data Science', 'ML-dev'];
  const categoryStats = categories.map(cat => ({
    name: cat,
    count: technologies.filter(t => t.category === cat).length,
    completed: technologies.filter(t => t.category === cat && t.status === 'completed').length,
    inProgress: technologies.filter(t => t.category === cat && t.status === 'in-progress').length,
    notStarted: technologies.filter(t => t.category === cat && t.status === 'not-started').length
  }));

  return (
    <div className="statistics-page">
      <h2 className="statistics-page__title">Статистика</h2>
      <Statistics technologies={technologies} />
      <div className="statistics-page__section">
        <h3 className="statistics-page__section-title">Общий прогресс</h3>
        <ProgressBar progress={progress} label="Прогресс изучения" />
      </div>
      <div className="statistics-page__section">
        <h3 className="statistics-page__section-title">Распределение по статусам</h3>
        <div className="statistics-page__chart">
          <div className="statistics-page__chart-item">
            <div className="statistics-page__chart-bar statistics-page__chart-bar--not-started"
                 style={{ height: `${total > 0 ? (notStarted / total) * 200 : 0}px` }}>
              <span className="statistics-page__chart-value">{notStarted}</span>
            </div>
            <span className="statistics-page__chart-label">Не начато</span>
          </div>
          <div className="statistics-page__chart-item">
            <div className="statistics-page__chart-bar statistics-page__chart-bar--in-progress"
                 style={{ height: `${total > 0 ? (inProgress / total) * 200 : 0}px` }}>
              <span className="statistics-page__chart-value">{inProgress}</span>
            </div>
            <span className="statistics-page__chart-label">В процессе</span>
          </div>
          <div className="statistics-page__chart-item">
            <div className="statistics-page__chart-bar statistics-page__chart-bar--completed"
                 style={{ height: `${total > 0 ? (completed / total) * 200 : 0}px` }}>
              <span className="statistics-page__chart-value">{completed}</span>
            </div>
            <span className="statistics-page__chart-label">Завершено</span>
          </div>
        </div>
      </div>
      <div className="statistics-page__section">
        <h3 className="statistics-page__section-title">Статистика по категориям</h3>
        <div className="statistics-page__categories">
          {categoryStats.map(cat => (
            <div key={cat.name} className="statistics-page__category-item">
              <div className="statistics-page__category-header">
                <h4 className="statistics-page__category-name">{cat.name}</h4>
                <span className="statistics-page__category-count">{cat.count} технологий</span>
              </div>
              <div className="statistics-page__category-stats">
                <div className="statistics-page__category-stat">
                  <span>Завершено: {cat.completed}</span>
                </div>
                <div className="statistics-page__category-stat">
                  <span>В процессе: {cat.inProgress}</span>
                </div>
                <div className="statistics-page__category-stat">
                  <span>Не начато: {cat.notStarted}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

