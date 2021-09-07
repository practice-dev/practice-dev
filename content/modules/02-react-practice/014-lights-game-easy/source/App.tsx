import React from 'react';
import './styles.css';
const toggleMap: Record<number, string[]> = {
  1: ['B', 'E'],
  2: ['B', 'C', 'D'],
  3: ['A', 'F'],
  4: ['E'],
  5: ['A', 'B', 'F'],
};

export function App() {
  return (
    <div>
      <h2>Lights game - easy</h2>
      <ul className="lights">
        <li className="active" data-test="light">
          A
        </li>
        <li data-test="light">B</li>
        <li data-test="light">C</li>
        <li data-test="light">D</li>
        <li className="active" data-test="light">
          E
        </li>
        <li data-test="light">F</li>
      </ul>
      <div className="buttons">
        <button data-test="toggle-btn">1</button>
        <button data-test="toggle-btn">2</button>
        <button data-test="toggle-btn">3</button>
        <button data-test="toggle-btn">4</button>
        <button data-test="toggle-btn">5</button>
      </div>
    </div>
  );
}
