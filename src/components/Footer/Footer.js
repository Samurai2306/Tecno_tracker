import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3 className="footer__title">Глеб Чернов</h3>
          <p className="footer__developer-role">
            Fullstack разработчик & Студент РТУ МИРЭА
          </p>
          <p className="footer__description">
            Создаю современные веб-решения с фокусом на качество и производительность
          </p>
          <a 
            href="https://samurai2306.github.io/portfolio_project" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__portfolio-link"
          >
            <img 
              src="https://lh3.googleusercontent.com/d/1e-zV7dZKgUXv96QRAvwxcUrQ7ADRSGei" 
              alt="Портфолио разработчика" 
              className="footer__portfolio-avatar"
            />
            <span>Портфолио разработчика</span>
          </a>
        </div>
        <div className="footer__section">
          <h4 className="footer__section-title">Навигация</h4>
          <nav className="footer__nav">
            <Link to="/" className="footer__link">Главная</Link>
            <Link to="/technologies" className="footer__link">Технологии</Link>
            <Link to="/statistics" className="footer__link">Статистика</Link>
            <Link to="/add" className="footer__link">Добавить</Link>
            <Link to="/settings" className="footer__link">Настройки</Link>
          </nav>
        </div>
        <div className="footer__section">
          <h4 className="footer__section-title">Контакты</h4>
          <div className="footer__contacts">
            <a 
              href="https://t.me/mm0l0d0y" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__contact-link"
            >
              <img 
                src="/assets/icons/icons8-tg-1.svg" 
                alt="Telegram" 
                className="footer__contact-icon"
              />
              <span>Telegram @mm0l0d0y</span>
            </a>
            <a 
              href="https://github.com/Samurai2306" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__contact-link"
            >
              <img 
                src="/assets/icons/icons8-github-1.svg" 
                alt="GitHub" 
                className="footer__contact-icon"
              />
              <span>GitHub Samurai2306</span>
            </a>
            <a 
              href="mailto:undertale2006rus@gmail.com" 
              className="footer__contact-link"
            >
              <img 
                src="/assets/icons/icons8-gmail-1.svg" 
                alt="Gmail" 
                className="footer__contact-icon"
              />
              <span>undertale2006rus@gmail.com</span>
            </a>
            <a 
              href="https://vk.com/glebnigger" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__contact-link"
            >
              <img 
                src="/assets/icons/icons8-vk-2.svg" 
                alt="VK" 
                className="footer__contact-icon"
              />
              <span>VK glebnigger</span>
            </a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copyright">
          © 2024 Глеб Чернов. Создано с ❤️ и большим количеством кода.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

