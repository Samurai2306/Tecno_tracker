import React from 'react';
import './TechnologyNotes.css';

const TechnologyNotes = ({ technology, onNotesChange }) => {
  const handleChange = (e) => {
    if (onNotesChange) {
      onNotesChange(technology.id, e.target.value);
    }
  };

  return (
    <div className="technology-notes">
      <label className="technology-notes__label" htmlFor={`notes-${technology.id}`}>
        Заметки
      </label>
      <textarea
        id={`notes-${technology.id}`}
        className="technology-notes__textarea"
        value={technology.notes || ''}
        onChange={handleChange}
        placeholder="Добавьте заметки о технологии..."
        rows={4}
      />
    </div>
  );
};

export default TechnologyNotes;

