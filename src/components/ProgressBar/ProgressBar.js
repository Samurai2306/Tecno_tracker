import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, label, showPercentage = true }) => {
  return (
    <div className="progress-bar">
      {label && <div className="progress-bar__label">{label}</div>}
      <div className="progress-bar__container">
        <div
          className="progress-bar__fill"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="progress-bar__percentage">{progress}%</div>
      )}
    </div>
  );
};

export default ProgressBar;

