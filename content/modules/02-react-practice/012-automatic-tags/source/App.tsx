import React from 'react';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Automatic tags</h2>
      <div className="tags">
        <div data-test="tag" className="tag">
          foo
        </div>
        <div data-test="tag" className="tag">
          bar
        </div>
        <input type="text" data-test="tag-input" />
      </div>
    </div>
  );
}
