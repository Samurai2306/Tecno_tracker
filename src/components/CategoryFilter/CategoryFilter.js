import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ currentCategory, onCategoryChange, technologies }) => {
  const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Data Science', 'ML-dev'];
  
  const getCategoryCount = (category) => {
    if (category === 'All') return technologies.length;
    return technologies.filter(t => t.category === category).length;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'All': 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
      'Frontend': 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)',
      'Backend': 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)',
      'DevOps': 'linear-gradient(135deg, rgba(192, 132, 252, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
      'Data Science': 'linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
      'ML-dev': 'linear-gradient(135deg, rgba(196, 181, 253, 0.3) 0%, rgba(167, 139, 250, 0.3) 100%)'
    };
    return colors[category] || colors['All'];
  };

  return (
    <div className="category-filter">
      <h3 className="category-filter__title">Категории</h3>
      <div className="category-filter__buttons">
        {categories.map(category => (
          <button
            key={category}
            className={`category-filter__button ${
              currentCategory === category ? 'category-filter__button--active' : ''
            }`}
            onClick={() => onCategoryChange(category === 'All' ? 'all' : category)}
            style={{
              background: currentCategory === category 
                ? getCategoryColor(category)
                : 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <span className="category-filter__name">{category}</span>
            <span className="category-filter__count">({getCategoryCount(category)})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

