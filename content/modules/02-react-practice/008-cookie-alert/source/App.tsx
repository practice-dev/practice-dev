import React from 'react';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Cookie alert</h2>
      Cookie consent: <span data-test="consent">-</span>
      <div data-test="alert" className="alert">
        <h3>Do you accept cookies?</h3>
        <div>
          <button className="success-btn" data-test="accept-btn">
            Accept
          </button>
          <button className="danger-btn" data-test="reject-btn">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
