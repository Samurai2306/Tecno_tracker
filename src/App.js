import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UserLogin from './components/UserLogin/UserLogin';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import TechnologyList from './pages/TechnologyList/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail/TechnologyDetail';
import AddTechnology from './pages/AddTechnology/AddTechnology';
import StatisticsPage from './pages/StatisticsPage/StatisticsPage';
import Settings from './pages/Settings/Settings';
import { useUsers } from './hooks/useUsers';

function App() {
  const { currentUser, logout } = useUsers();
  const [user, setUser] = useState(currentUser);

  // Синхронизация с currentUser из useUsers
  React.useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (!user) {
    return <UserLogin onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app">
        <header className="app__header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h1 className="app__title">Трекер изучения технологий</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'rgba(233, 213, 255, 0.8)', fontSize: '0.9rem' }}>
                Пользователь: {user.username}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'rgba(233, 213, 255, 0.8)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(226, 197, 252, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Выйти
              </button>
            </div>
          </div>
        </header>
        <Navigation />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home userId={user.id} />} />
            <Route path="/technologies" element={<TechnologyList userId={user.id} />} />
            <Route path="/technologies/:id" element={<TechnologyDetail userId={user.id} />} />
            <Route path="/add" element={<AddTechnology userId={user.id} />} />
            <Route path="/statistics" element={<StatisticsPage userId={user.id} />} />
            <Route path="/settings" element={<Settings userId={user.id} onLogout={handleLogout} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

