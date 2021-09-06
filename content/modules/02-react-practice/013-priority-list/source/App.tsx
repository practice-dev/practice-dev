import React from 'react';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Priority list</h2>
      <div className="form">
        <input type="text" data-test="name-input" placeholder="name" />
        <input
          type="number"
          data-test="priority-input"
          placeholder="priority"
        />
        <label>
          <input type="checkbox" data-test="promo-checkbox" />
          promo
        </label>
        <button data-test="add-btn">add</button>
      </div>
      <ul>
        <li data-test="item">* cat (100)</li>
        <li data-test="item">* dog (80)</li>
        <li data-test="item">bird (80)</li>
        <li data-test="item">elephant (70)</li>
        <li data-test="item">snake (70)</li>
      </ul>
    </div>
  );
}
