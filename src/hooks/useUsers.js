import { useState, useEffect } from 'react';

const USERS_STORAGE_KEY = 'technology-tracker-users';
const CURRENT_USER_KEY = 'technology-tracker-current-user';

export const useUsers = () => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedCurrentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedCurrentUser) {
      try {
        return JSON.parse(savedCurrentUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Сохранение пользователей в localStorage
  useEffect(() => {
    if (users && Array.isArray(users)) {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } catch (e) {
        console.error('Ошибка сохранения пользователей:', e);
      }
    }
  }, [users]);

  // Сохранение текущего пользователя
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const createUser = (username) => {
    // Проверка на уникальность имени
    const usernameLower = username.toLowerCase().trim();
    const existingUser = users.find(
      u => u.username.toLowerCase().trim() === usernameLower
    );

    if (existingUser) {
      return { success: false, error: 'Пользователь с таким именем уже существует' };
    }

    if (!username || username.trim().length === 0) {
      return { success: false, error: 'Имя пользователя не может быть пустым' };
    }

    if (username.trim().length < 2) {
      return { success: false, error: 'Имя пользователя должно содержать минимум 2 символа' };
    }

    const newUser = {
      id: Date.now().toString(),
      username: username.trim(),
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString()
    };

    // Обновляем состояние и сразу сохраняем в localStorage
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Сохраняем сразу в localStorage для надежности
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    } catch (e) {
      console.error('Ошибка сохранения пользователя:', e);
    }
    
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const selectUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updatedUser = {
        ...user,
        lastAccess: new Date().toISOString()
      };
      setUsers(prevUsers =>
        prevUsers.map(u => u.id === userId ? updatedUser : u)
      );
      setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    }
    return { success: false, error: 'Пользователь не найден' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const deleteUser = (userId) => {
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    // Удаляем данные пользователя из localStorage
    localStorage.removeItem(`technology-tracker-data-${userId}`);
  };

  const checkUsernameExists = (username) => {
    const usernameLower = username.toLowerCase().trim();
    return users.some(u => u.username.toLowerCase().trim() === usernameLower);
  };

  return {
    users,
    currentUser,
    createUser,
    selectUser,
    logout,
    deleteUser,
    checkUsernameExists
  };
};

