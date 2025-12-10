/**
 * Утилиты для работы с дедлайнами
 */

/**
 * Вычисляет время до дедлайна
 * @param {string} deadline - Дата дедлайна в формате ISO
 * @returns {Object} Объект с информацией о времени до дедлайна
 */
export const getTimeUntilDeadline = (deadline) => {
  if (!deadline) return null;

  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  // Устанавливаем время на конец дня для дедлайна
  deadlineDate.setHours(23, 59, 59, 999);
  
  const diff = deadlineDate - now;
  
  if (diff < 0) {
    return {
      isOverdue: true,
      days: 0,
      hours: 0,
      minutes: 0,
      totalDays: 0
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const totalDays = diff / (1000 * 60 * 60 * 24);

  return {
    isOverdue: false,
    days,
    hours,
    minutes,
    totalDays
  };
};

/**
 * Форматирует время до дедлайна в читаемый формат
 * @param {string} deadline - Дата дедлайна
 * @returns {string} Отформатированная строка
 */
export const formatTimeUntilDeadline = (deadline) => {
  const timeInfo = getTimeUntilDeadline(deadline);
  
  if (!timeInfo) {
    return null;
  }

  if (timeInfo.isOverdue) {
    return 'Просрочено';
  }

  if (timeInfo.days > 30) {
    const months = Math.floor(timeInfo.days / 30);
    const remainingDays = timeInfo.days % 30;
    if (remainingDays === 0) {
      return `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`;
    }
    return `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'} ${remainingDays} ${remainingDays === 1 ? 'день' : remainingDays < 5 ? 'дня' : 'дней'}`;
  }

  if (timeInfo.days > 0) {
    if (timeInfo.hours === 0) {
      return `${timeInfo.days} ${timeInfo.days === 1 ? 'день' : timeInfo.days < 5 ? 'дня' : 'дней'}`;
    }
    return `${timeInfo.days} ${timeInfo.days === 1 ? 'день' : timeInfo.days < 5 ? 'дня' : 'дней'} ${timeInfo.hours} ${timeInfo.hours === 1 ? 'час' : timeInfo.hours < 5 ? 'часа' : 'часов'}`;
  }

  if (timeInfo.hours > 0) {
    if (timeInfo.minutes === 0) {
      return `${timeInfo.hours} ${timeInfo.hours === 1 ? 'час' : timeInfo.hours < 5 ? 'часа' : 'часов'}`;
    }
    return `${timeInfo.hours} ${timeInfo.hours === 1 ? 'час' : timeInfo.hours < 5 ? 'часа' : 'часов'} ${timeInfo.minutes} ${timeInfo.minutes === 1 ? 'минута' : timeInfo.minutes < 5 ? 'минуты' : 'минут'}`;
  }

  if (timeInfo.minutes > 0) {
    return `${timeInfo.minutes} ${timeInfo.minutes === 1 ? 'минута' : timeInfo.minutes < 5 ? 'минуты' : 'минут'}`;
  }

  return 'Меньше минуты';
};

/**
 * Определяет уровень срочности дедлайна
 * @param {string} deadline - Дата дедлайна
 * @returns {string} 'urgent', 'soon', 'normal', 'overdue'
 */
export const getDeadlineUrgency = (deadline) => {
  const timeInfo = getTimeUntilDeadline(deadline);
  
  if (!timeInfo) {
    return 'normal';
  }

  if (timeInfo.isOverdue) {
    return 'overdue';
  }

  if (timeInfo.totalDays <= 1) {
    return 'urgent';
  }

  if (timeInfo.totalDays <= 7) {
    return 'soon';
  }

  return 'normal';
};

/**
 * Получает цвет для индикатора срочности
 * @param {string} urgency - Уровень срочности
 * @returns {string} CSS класс
 */
export const getUrgencyColorClass = (urgency) => {
  switch (urgency) {
    case 'overdue':
      return 'deadline--overdue';
    case 'urgent':
      return 'deadline--urgent';
    case 'soon':
      return 'deadline--soon';
    default:
      return 'deadline--normal';
  }
};

