import { useState, useEffect } from 'react';

const getStorageKey = (userId) => `technology-tracker-data-${userId}`;

const initialTechnologies = [
  // Frontend
  { id: 1, title: 'React', description: 'Библиотека JavaScript для создания пользовательских интерфейсов', category: 'Frontend', status: 'in-progress', notes: '' },
  { id: 2, title: 'Vue.js', description: 'Прогрессивный JavaScript-фреймворк для создания пользовательских интерфейсов', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 3, title: 'Angular', description: 'Платформа для разработки мобильных и настольных веб-приложений', category: 'Frontend', status: 'in-progress', notes: '' },
  { id: 4, title: 'Next.js', description: 'React-фреймворк для production с поддержкой SSR и SSG', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 5, title: 'Nuxt.js', description: 'Vue.js фреймворк для создания универсальных приложений', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 6, title: 'Svelte', description: 'Компилируемый компонентный фреймворк для создания веб-приложений', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 7, title: 'TypeScript', description: 'Типизированный надмножество JavaScript, разработанное Microsoft', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 8, title: 'Tailwind CSS', description: 'Utility-first CSS фреймворк для быстрой разработки интерфейсов', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 9, title: 'Redux', description: 'Библиотека для управления состоянием приложений', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 10, title: 'Webpack', description: 'Модульный сборщик для JavaScript приложений', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 11, title: 'Vite', description: 'Быстрый инструмент сборки для современной веб-разработки', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 12, title: 'Sass/SCSS', description: 'Препроцессор CSS для расширения возможностей стилизации', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 13, title: 'Styled Components', description: 'CSS-in-JS библиотека для стилизации React компонентов', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 14, title: 'Material-UI', description: 'React компоненты, реализующие Material Design', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 15, title: 'Bootstrap', description: 'Популярный CSS фреймворк для создания адаптивных интерфейсов', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 16, title: 'Gatsby', description: 'React-фреймворк для создания статических сайтов', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 17, title: 'Zustand', description: 'Легковесная библиотека для управления состоянием', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 18, title: 'React Query', description: 'Библиотека для управления серверным состоянием и кэшированием', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 19, title: 'Storybook', description: 'Инструмент для разработки и тестирования UI компонентов', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 20, title: 'Cypress', description: 'Инструмент для end-to-end тестирования веб-приложений', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 21, title: 'Jest', description: 'JavaScript фреймворк для тестирования', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 22, title: 'ESLint', description: 'Инструмент для статического анализа JavaScript кода', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 23, title: 'Prettier', description: 'Инструмент для форматирования кода', category: 'Frontend', status: 'not-started', notes: '' },
  { id: 24, title: 'PWA', description: 'Progressive Web Apps - веб-приложения с возможностями нативных', category: 'Frontend', status: 'not-started', notes: '' },
  
  // Backend
  { id: 25, title: 'Node.js', description: 'Среда выполнения JavaScript на стороне сервера', category: 'Backend', status: 'completed', notes: '' },
  { id: 26, title: 'Express.js', description: 'Минималистичный веб-фреймворк для Node.js', category: 'Backend', status: 'in-progress', notes: '' },
  { id: 27, title: 'NestJS', description: 'Прогрессивный Node.js фреймворк для эффективных серверных приложений', category: 'Backend', status: 'not-started', notes: '' },
  { id: 28, title: 'Python', description: 'Высокоуровневый язык программирования общего назначения', category: 'Backend', status: 'in-progress', notes: '' },
  { id: 29, title: 'Django', description: 'Высокоуровневый Python веб-фреймворк для быстрой разработки', category: 'Backend', status: 'not-started', notes: '' },
  { id: 30, title: 'Flask', description: 'Легковесный Python веб-фреймворк', category: 'Backend', status: 'not-started', notes: '' },
  { id: 31, title: 'FastAPI', description: 'Современный быстрый веб-фреймворк для создания API на Python', category: 'Backend', status: 'not-started', notes: '' },
  { id: 32, title: 'Go', description: 'Язык программирования от Google для создания эффективных приложений', category: 'Backend', status: 'not-started', notes: '' },
  { id: 33, title: 'Java', description: 'Объектно-ориентированный язык программирования', category: 'Backend', status: 'not-started', notes: '' },
  { id: 34, title: 'Spring Boot', description: 'Фреймворк для создания enterprise приложений на Java', category: 'Backend', status: 'not-started', notes: '' },
  { id: 35, title: 'C#', description: 'Язык программирования от Microsoft для .NET платформы', category: 'Backend', status: 'not-started', notes: '' },
  { id: 36, title: '.NET', description: 'Платформа для разработки приложений от Microsoft', category: 'Backend', status: 'not-started', notes: '' },
  { id: 37, title: 'Ruby on Rails', description: 'Веб-фреймворк на Ruby для быстрой разработки', category: 'Backend', status: 'not-started', notes: '' },
  { id: 38, title: 'PHP', description: 'Серверный язык программирования для веб-разработки', category: 'Backend', status: 'not-started', notes: '' },
  { id: 39, title: 'Laravel', description: 'PHP фреймворк с элегантным синтаксисом', category: 'Backend', status: 'not-started', notes: '' },
  { id: 40, title: 'PostgreSQL', description: 'Мощная объектно-реляционная система управления базами данных', category: 'Backend', status: 'not-started', notes: '' },
  { id: 41, title: 'MySQL', description: 'Популярная реляционная система управления базами данных', category: 'Backend', status: 'not-started', notes: '' },
  { id: 42, title: 'MongoDB', description: 'NoSQL база данных документов', category: 'Backend', status: 'not-started', notes: '' },
  { id: 43, title: 'Redis', description: 'Хранилище данных в памяти, используемое как база данных, кэш и брокер сообщений', category: 'Backend', status: 'not-started', notes: '' },
  { id: 44, title: 'SQLite', description: 'Встраиваемая реляционная база данных', category: 'Backend', status: 'not-started', notes: '' },
  { id: 45, title: 'GraphQL', description: 'Язык запросов для API и среда выполнения для выполнения этих запросов', category: 'Backend', status: 'not-started', notes: '' },
  { id: 46, title: 'REST API', description: 'Архитектурный стиль для проектирования веб-сервисов', category: 'Backend', status: 'in-progress', notes: '' },
  { id: 47, title: 'RabbitMQ', description: 'Брокер сообщений с открытым исходным кодом', category: 'Backend', status: 'not-started', notes: '' },
  { id: 48, title: 'Apache Kafka', description: 'Распределенная платформа потоковой обработки', category: 'Backend', status: 'not-started', notes: '' },
  { id: 49, title: 'gRPC', description: 'Высокопроизводительный RPC фреймворк', category: 'Backend', status: 'not-started', notes: '' },
  { id: 50, title: 'Socket.io', description: 'Библиотека для real-time двусторонней связи', category: 'Backend', status: 'not-started', notes: '' },
  { id: 51, title: 'Prisma', description: 'Современный ORM для Node.js и TypeScript', category: 'Backend', status: 'not-started', notes: '' },
  { id: 52, title: 'TypeORM', description: 'ORM для TypeScript и JavaScript', category: 'Backend', status: 'not-started', notes: '' },
  { id: 53, title: 'Sequelize', description: 'ORM для Node.js с поддержкой PostgreSQL, MySQL и других', category: 'Backend', status: 'not-started', notes: '' },
  { id: 54, title: 'Mongoose', description: 'ODM для MongoDB и Node.js', category: 'Backend', status: 'not-started', notes: '' },
  { id: 55, title: 'JWT', description: 'JSON Web Token для аутентификации и авторизации', category: 'Backend', status: 'not-started', notes: '' },
  { id: 56, title: 'OAuth 2.0', description: 'Стандарт авторизации для веб-приложений', category: 'Backend', status: 'not-started', notes: '' },
  { id: 57, title: 'Swagger/OpenAPI', description: 'Спецификация для описания REST API', category: 'Backend', status: 'not-started', notes: '' },
  { id: 58, title: 'Postman', description: 'Инструмент для тестирования и разработки API', category: 'Backend', status: 'not-started', notes: '' },
  { id: 59, title: 'Apollo Server', description: 'GraphQL сервер для Node.js', category: 'Backend', status: 'not-started', notes: '' },
  { id: 60, title: 'Microservices', description: 'Архитектурный подход к разработке приложений', category: 'Backend', status: 'not-started', notes: '' },
  { id: 61, title: 'Serverless', description: 'Архитектура без управления серверами', category: 'Backend', status: 'not-started', notes: '' },
  
  // DevOps
  { id: 62, title: 'Docker', description: 'Платформа для контейнеризации приложений', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 63, title: 'Kubernetes', description: 'Система оркестрации контейнеров', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 64, title: 'Git', description: 'Распределенная система контроля версий', category: 'DevOps', status: 'in-progress', notes: '' },
  { id: 65, title: 'GitHub Actions', description: 'CI/CD платформа для автоматизации рабочих процессов', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 66, title: 'GitLab CI', description: 'CI/CD платформа от GitLab', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 67, title: 'Jenkins', description: 'Сервер автоматизации с открытым исходным кодом', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 68, title: 'Terraform', description: 'Инструмент для управления инфраструктурой как код', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 69, title: 'Ansible', description: 'Платформа для автоматизации IT', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 70, title: 'AWS', description: 'Облачная платформа от Amazon', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 71, title: 'Azure', description: 'Облачная платформа от Microsoft', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 72, title: 'GCP', description: 'Облачная платформа от Google', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 73, title: 'Linux', description: 'Операционная система с открытым исходным кодом', category: 'DevOps', status: 'in-progress', notes: '' },
  { id: 74, title: 'Nginx', description: 'Веб-сервер и обратный прокси-сервер', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 75, title: 'Docker Compose', description: 'Инструмент для определения и запуска многоконтейнерных приложений', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 76, title: 'Helm', description: 'Менеджер пакетов для Kubernetes', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 77, title: 'Prometheus', description: 'Система мониторинга и алертинга', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 78, title: 'Grafana', description: 'Платформа для визуализации и мониторинга метрик', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 79, title: 'ELK Stack', description: 'Elasticsearch, Logstash, Kibana для логирования', category: 'DevOps', status: 'not-started', notes: '' },
  { id: 80, title: 'Sentry', description: 'Платформа для мониторинга ошибок и производительности', category: 'DevOps', status: 'not-started', notes: '' },
  
  // Data Science
  { id: 81, title: 'Python (Data Science)', description: 'Python для анализа данных и машинного обучения', category: 'Data Science', status: 'in-progress', notes: '' },
  { id: 82, title: 'Pandas', description: 'Библиотека Python для анализа и обработки данных', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 83, title: 'NumPy', description: 'Библиотека Python для научных вычислений', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 84, title: 'Matplotlib', description: 'Библиотека Python для визуализации данных', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 85, title: 'Seaborn', description: 'Библиотека Python для статистической визуализации', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 86, title: 'Jupyter', description: 'Интерактивная среда для работы с данными', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 87, title: 'SQL', description: 'Язык структурированных запросов для работы с базами данных', category: 'Data Science', status: 'in-progress', notes: '' },
  { id: 88, title: 'R', description: 'Язык программирования для статистических вычислений', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 89, title: 'Tableau', description: 'Инструмент для визуализации и анализа данных', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 90, title: 'Power BI', description: 'Платформа бизнес-аналитики от Microsoft', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 91, title: 'Apache Spark', description: 'Унифицированный движок для больших данных', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 92, title: 'Hadoop', description: 'Фреймворк для распределенной обработки больших данных', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 93, title: 'Scipy', description: 'Библиотека Python для научных вычислений', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 94, title: 'Plotly', description: 'Интерактивная библиотека визуализации данных', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 95, title: 'Apache Airflow', description: 'Платформа для оркестрации рабочих процессов данных', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 96, title: 'BigQuery', description: 'Облачная аналитическая платформа от Google', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 97, title: 'Redshift', description: 'Облачное хранилище данных от AWS', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 98, title: 'Databricks', description: 'Платформа для больших данных и машинного обучения', category: 'Data Science', status: 'not-started', notes: '' },
  { id: 99, title: 'dbt', description: 'Инструмент для трансформации данных в хранилищах', category: 'Data Science', status: 'not-started', notes: '' },
  
  // ML-dev
  { id: 100, title: 'TensorFlow', description: 'Открытая библиотека машинного обучения от Google', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 101, title: 'PyTorch', description: 'Библиотека машинного обучения от Facebook', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 102, title: 'Scikit-learn', description: 'Библиотека Python для машинного обучения', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 103, title: 'Keras', description: 'Высокоуровневый API для нейронных сетей', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 104, title: 'OpenCV', description: 'Библиотека для компьютерного зрения', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 105, title: 'NLTK', description: 'Библиотека Python для обработки естественного языка', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 106, title: 'spaCy', description: 'Библиотека для обработки естественного языка', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 107, title: 'XGBoost', description: 'Градиентный бустинг для машинного обучения', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 108, title: 'LightGBM', description: 'Быстрый и эффективный градиентный бустинг', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 109, title: 'MLflow', description: 'Платформа для управления жизненным циклом ML', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 110, title: 'Hugging Face', description: 'Платформа для моделей трансформеров', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 111, title: 'Neural Networks', description: 'Нейронные сети и глубокое обучение', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 112, title: 'TensorBoard', description: 'Инструмент визуализации для TensorFlow', category: 'ML-dev', status: 'not-started', notes: '' },
  { id: 113, title: 'PyTorch Lightning', description: 'Высокоуровневая обертка для PyTorch', category: 'ML-dev', status: 'not-started', notes: '' }
];

export const useTechnologies = (userId) => {
  const storageKey = userId ? getStorageKey(userId) : null;

  const [technologies, setTechnologies] = useState(() => {
    if (!storageKey) return initialTechnologies;
    
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Ошибка загрузки данных пользователя:', e);
    }
    return initialTechnologies;
  });

  // Перезагрузка данных при смене userId
  useEffect(() => {
    if (storageKey) {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed)) {
            setTechnologies(parsed.length > 0 ? parsed : initialTechnologies);
          }
        } else {
          setTechnologies(initialTechnologies);
        }
      } catch (e) {
        console.error('Ошибка загрузки данных пользователя:', e);
        setTechnologies(initialTechnologies);
      }
    }
  }, [userId, storageKey]);

  // Автосохранение в localStorage
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(technologies));
    }
  }, [technologies, storageKey]);

  const updateStatus = (id, newStatus) => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech =>
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const updateNotes = (id, notes) => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech =>
        tech.id === id ? { ...tech, notes } : tech
      )
    );
  };

  const calculateProgress = () => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const addTechnology = (technology) => {
    const newId = Math.max(...technologies.map(t => t.id), 0) + 1;
    setTechnologies(prevTechnologies => [
      ...prevTechnologies,
      { ...technology, id: newId }
    ]);
  };

  const removeTechnology = (id) => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.filter(tech => tech.id !== id)
    );
  };

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    calculateProgress,
    addTechnology,
    removeTechnology
  };
};
