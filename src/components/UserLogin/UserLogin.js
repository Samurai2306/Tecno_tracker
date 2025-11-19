import React, { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import './UserLogin.css';

const UserLogin = ({ onLogin }) => {
  const { users, createUser, selectUser, checkUsernameExists } = useUsers();
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('select'); // 'select' или 'create'
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [displayUsers, setDisplayUsers] = useState([]);

  // Загружаем пользователей при монтировании
  useEffect(() => {
    const loadUsers = () => {
      try {
        const savedUsers = localStorage.getItem('technology-tracker-users');
        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers);
          if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
            setDisplayUsers(parsedUsers);
            return;
          }
        }
      } catch (e) {
        console.error('Ошибка загрузки пользователей:', e);
      }
      setDisplayUsers([]);
    };

    loadUsers();
  }, []);

  // Обновляем список при изменении users из хука
  useEffect(() => {
    if (users && Array.isArray(users) && users.length > 0) {
      setDisplayUsers(users);
    }
  }, [users]);

  const handleCreateUser = async () => {
    setError('');
    
    if (!username || username.trim().length === 0) {
      setError('Введите имя пользователя');
      return;
    }

    if (username.trim().length < 2) {
      setError('Имя пользователя должно содержать минимум 2 символа');
      return;
    }

    setIsChecking(true);
    
    // Проверка на уникальность
    if (checkUsernameExists(username)) {
      setError('Пользователь с таким именем уже существует');
      setIsChecking(false);
      return;
    }

    const result = createUser(username);
    setIsChecking(false);

    if (result.success) {
      // Обновляем список пользователей из localStorage и добавляем нового пользователя
      const savedUsers = localStorage.getItem('technology-tracker-users');
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);
          if (Array.isArray(parsedUsers)) {
            setDisplayUsers(parsedUsers);
          } else {
            // Если что-то пошло не так, добавляем нового пользователя вручную
            setDisplayUsers(prev => [...prev, result.user]);
          }
        } catch (e) {
          console.error('Ошибка обновления списка:', e);
          // Добавляем нового пользователя вручную
          setDisplayUsers(prev => [...prev, result.user]);
        }
      } else {
        // Если localStorage пуст, добавляем нового пользователя
        setDisplayUsers([result.user]);
      }
      onLogin(result.user);
    } else {
      setError(result.error || 'Ошибка при создании пользователя');
    }
  };

  const handleSelectUser = (userId) => {
    const result = selectUser(userId);
    if (result.success) {
      // Обновляем список пользователей сразу после выбора
      const savedUsers = localStorage.getItem('technology-tracker-users');
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);
          setDisplayUsers(Array.isArray(parsedUsers) ? parsedUsers : []);
        } catch (e) {
          console.error('Ошибка обновления списка:', e);
        }
      }
      onLogin(result.user);
    } else {
      setError(result.error || 'Ошибка при выборе пользователя');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      handleCreateUser();
    }
  };

  return (
    <div className="user-login">
      <div className="user-login__container">
        <h1 className="user-login__title">Трекер изучения технологий</h1>
        
        <div className="user-login__tabs">
          <button
            className={`user-login__tab ${mode === 'select' ? 'user-login__tab--active' : ''}`}
            onClick={() => {
              setMode('select');
              setError('');
              setUsername('');
              // Обновляем список пользователей при переключении на вкладку выбора
              const loadUsers = () => {
                try {
                  const savedUsers = localStorage.getItem('technology-tracker-users');
                  if (savedUsers) {
                    const parsedUsers = JSON.parse(savedUsers);
                    if (Array.isArray(parsedUsers)) {
                      setDisplayUsers(parsedUsers);
                      return;
                    }
                  }
                } catch (e) {
                  console.error('Ошибка загрузки пользователей:', e);
                }
                setDisplayUsers([]);
              };
              loadUsers();
            }}
          >
            Выбрать пользователя
          </button>
          <button
            className={`user-login__tab ${mode === 'create' ? 'user-login__tab--active' : ''}`}
            onClick={() => {
              setMode('create');
              setError('');
              setUsername('');
            }}
          >
            Создать нового
          </button>
        </div>

        {mode === 'create' ? (
          <form className="user-login__form" onSubmit={handleSubmit}>
            <div className="user-login__field">
              <label htmlFor="username" className="user-login__label">
                Имя пользователя
              </label>
              <input
                id="username"
                type="text"
                className="user-login__input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Введите имя пользователя"
                autoFocus
                disabled={isChecking}
                minLength={2}
                required
              />
              {error && <div className="user-login__error">{error}</div>}
            </div>
            <button
              type="submit"
              className="user-login__button user-login__button--primary"
              disabled={isChecking || !username.trim()}
            >
              {isChecking ? 'Проверка...' : 'Создать'}
            </button>
          </form>
        ) : (
          <div className="user-login__users">
            {displayUsers.length === 0 ? (
              <div className="user-login__empty">
                <p>Нет сохраненных пользователей</p>
                <p className="user-login__empty-hint">Создайте нового пользователя</p>
              </div>
            ) : (
              <>
                <h3 className="user-login__users-title">Выберите пользователя:</h3>
                <div className="user-login__users-list">
                  {displayUsers
                    .sort((a, b) => {
                      const dateA = a.lastAccess ? new Date(a.lastAccess) : new Date(a.createdAt || 0);
                      const dateB = b.lastAccess ? new Date(b.lastAccess) : new Date(b.createdAt || 0);
                      return dateB - dateA;
                    })
                    .map(user => (
                      <button
                        key={user.id}
                        className="user-login__user-item"
                        onClick={() => handleSelectUser(user.id)}
                      >
                        <div className="user-login__user-name">{user.username}</div>
                        <div className="user-login__user-meta">
                          Последний вход: {user.lastAccess 
                            ? new Date(user.lastAccess).toLocaleDateString('ru-RU')
                            : user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString('ru-RU')
                            : 'Недавно'}
                        </div>
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogin;

