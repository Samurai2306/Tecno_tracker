import React from 'react';
import './ProgressHeader.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import { getTimeUntilDeadline, getDeadlineUrgency } from '../../utils/deadlineUtils';

const ProgressHeader = ({ technologies }) => {
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Статистика по дедлайнам
  const technologiesWithDeadlines = technologies.filter(t => t.deadline);
  const overdueCount = technologiesWithDeadlines.filter(t => {
    const timeInfo = getTimeUntilDeadline(t.deadline);
    return timeInfo && timeInfo.isOverdue && t.status !== 'completed';
  }).length;
  
  const urgentCount = technologiesWithDeadlines.filter(t => {
    const urgency = getDeadlineUrgency(t.deadline);
    return urgency === 'urgent' && t.status !== 'completed';
  }).length;

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
          <span className="progress-header__stat-label">В процессе</span>
          <span className="progress-header__stat-value progress-header__stat-value--in-progress">
            {inProgress}
          </span>
        </div>
        <div className="progress-header__stat">
          <span className="progress-header__stat-label">Прогресс</span>
          <span className="progress-header__stat-value">{progress}%</span>
        </div>
        {urgentCount > 0 && (
          <div className="progress-header__stat progress-header__stat--warning">
            <span className="progress-header__stat-label">Срочные дедлайны</span>
            <span className="progress-header__stat-value progress-header__stat-value--urgent">
              {urgentCount}
            </span>
          </div>
        )}
        {overdueCount > 0 && (
          <div className="progress-header__stat progress-header__stat--danger">
            <span className="progress-header__stat-label">Просрочено</span>
            <span className="progress-header__stat-value progress-header__stat-value--overdue">
              {overdueCount}
            </span>
          </div>
        )}
      </div>
      <div className="progress-header__bar-container">
        <ProgressBar progress={progress} showPercentage={false} />
      </div>
    </div>
  );
};

export default ProgressHeader;

