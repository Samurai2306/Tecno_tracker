import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link to="/" className="navigation__logo">
          Трекер
        </Link>
        <div className="navigation__links">
          <Link
            to="/"
            className={`navigation__link ${isActive('/') ? 'navigation__link--active' : ''}`}
          >
            Главная
          </Link>
          <Link
            to="/technologies"
            className={`navigation__link ${isActive('/technologies') ? 'navigation__link--active' : ''}`}
          >
            Все технологии
          </Link>
          <Link
            to="/add"
            className={`navigation__link ${isActive('/add') ? 'navigation__link--active' : ''}`}
          >
            Добавить
          </Link>
          <Link
            to="/statistics"
            className={`navigation__link ${isActive('/statistics') ? 'navigation__link--active' : ''}`}
          >
            Статистика
          </Link>
          <Link
            to="/settings"
            className={`navigation__link ${isActive('/settings') ? 'navigation__link--active' : ''}`}
          >
            Настройки
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

