import React from 'react';
import './ProgressHeader.css';
import ProgressBar from '../ProgressBar/ProgressBar';

const ProgressHeader = ({ technologies }) => {
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-header">
      <div className="progress-header__stats">
        <div className="progress-header__stat">
          <span className="progress-header__stat-label">Всего технологий</span>
          <span className="progress-header__stat-value">{total}</span>
        </div>
        <div className="progress-header__stat">
          <span className="progress-header__stat-label">Изучено</span>
          <span className="progress-header__stat-value progress-header__stat-value--completed">
            {completed}
          </span>
        </div>
        <div className="progress-header__stat">
          <span className="progress-header__stat-label">Прогресс</span>
          <span className="progress-header__stat-value">{progress}%</span>
        </div>
      </div>
      <div className="progress-header__bar-container">
        <ProgressBar progress={progress} showPercentage={false} />
      </div>
    </div>
  );
};

export default ProgressHeader;

