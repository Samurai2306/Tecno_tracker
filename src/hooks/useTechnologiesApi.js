import { useState, useEffect } from 'react';

// Имитация API - мок-данные
const MOCK_API_DELAY = 1000;

const mockTechnologies = [
  {
    id: 101,
    title: 'GraphQL',
    description: 'Язык запросов для API и среда выполнения для выполнения этих запросов',
    status: 'not-started',
    notes: ''
  },
  {
    id: 102,
    title: 'Docker',
    description: 'Платформа для контейнеризации приложений',
    status: 'not-started',
    notes: ''
  },
  {
    id: 103,
    title: 'Kubernetes',
    description: 'Система оркестрации контейнеров',
    status: 'not-started',
    notes: ''
  },
  {
    id: 104,
    title: 'MongoDB',
    description: 'NoSQL база данных документов',
    status: 'not-started',
    notes: ''
  },
  {
    id: 105,
    title: 'Redis',
    description: 'Хранилище данных в памяти, используемое как база данных, кэш и брокер сообщений',
    status: 'not-started',
    notes: ''
  }
];

// Имитация API функций
const api = {
  fetchTechnologies: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    return [...mockTechnologies];
  },

  addTechnology: async (technology) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    return {
      ...technology,
      id: Date.now()
    };
  },

  fetchTechnologyResources: async (id) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    return {
      id,
      resources: [
        { type: 'documentation', url: `https://example.com/docs/${id}`, title: 'Официальная документация' },
        { type: 'tutorial', url: `https://example.com/tutorial/${id}`, title: 'Руководство для начинающих' },
        { type: 'video', url: `https://example.com/video/${id}`, title: 'Видео курс' }
      ]
    };
  }
};

export const useTechnologiesApi = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTechnologies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTechnologies();
      setTechnologies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = async (technology) => {
    setLoading(true);
    setError(null);
    try {
      const newTech = await api.addTechnology(technology);
      setTechnologies(prev => [...prev, newTech]);
      return newTech;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTechnologyResources(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    technologies,
    loading,
    error,
    loadTechnologies,
    addTechnology,
    fetchResources
  };
};

