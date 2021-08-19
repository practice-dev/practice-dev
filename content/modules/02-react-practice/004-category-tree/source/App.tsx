import React from 'react';
import { Category, categories } from './categories';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Category tree</h2>
      <ul className="root" data-test="root">
        <li data-test="category-1">
          <button data-test="toggle-btn" className="toggle">
            -
          </button>
          Electronics
          <ul>
            <li data-test="category-3">
              <button data-test="toggle-btn" className="toggle">
                -
              </button>
              Accessories
              <ul>
                <li data-test="category-8">Audio Accessories</li>
                <li data-test="category-9">Camera Accessories</li>
                <li data-test="category-10">Cell Phone Accessories</li>
              </ul>
            </li>
            <li data-test="category-4">
              <button data-test="toggle-btn" className="toggle">
                +
              </button>
              Computers
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
