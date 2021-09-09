import React from 'react';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>
        Count:
        <span data-test="count">0</span>
      </h2>
      <button data-test="increase-btn">increase</button>
      <button data-test="decrease-btn">decrease</button>
      <button data-test="reset-btn">reset</button>
    </div>
  );
}
