import React from 'react';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Password strength</h2>
      <ul>
        <li data-test="rule-1">
          At least 1 letter: <span data-test="result">NO</span>
        </li>
        <li data-test="rule-2">
          At least 1 number: <span data-test="result">NO</span>
        </li>
        <li data-test="rule-3">
          At least 1 special character: <span data-test="result">NO</span>
        </li>
        <li data-test="rule-4">
          Min. 8 characters: <span data-test="result">NO</span>
        </li>
      </ul>
      <div>
        Strength: <span data-test="strength">WEAK</span>
      </div>
      <input type="password" data-test="pass" />
    </div>
  );
}
