import React from 'react';
import {} from 'react-router';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Sync filters</h2>
      <section data-test="color">
        <h3>Color</h3>
        <ul>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Red
            </label>
          </li>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Green
            </label>
          </li>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Blue
            </label>
          </li>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Orange
            </label>
          </li>
        </ul>
      </section>
      <section data-test="size">
        <h3>Size</h3>
        <ul>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Large
            </label>
          </li>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Medium
            </label>
          </li>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Small
            </label>
          </li>
        </ul>
      </section>
      <section data-test="shape">
        <h3>Shape</h3>
        <ul>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Square
            </label>
          </li>
          <li data-test="item">
            <label>
              <input type="checkbox" />
              Circle
            </label>
          </li>
        </ul>
      </section>
    </div>
  );
}
