import React from 'react';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Magic password</h2>
      <div data-test="result" className="result">
        locked
      </div>
    </div>
  );
}
