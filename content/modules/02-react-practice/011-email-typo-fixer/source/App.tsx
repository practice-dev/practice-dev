import React from 'react';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Email typo fixer</h2>
      <input defaultValue="user@gmai.com" type="text" data-test="email-input" />
      <div data-test="suggestion">
        Did you mean <a data-test="email">user@gmail.com</a>?
      </div>
    </div>
  );
}
