import React from 'react';
import { bloodTests, bloodPacks, BloodTest, BloodPack } from './data';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Blood test packs</h2>
      <ul>
        <li>
          <label data-test="test-1">
            <input type="checkbox" />
            Complete blood count $5
          </label>
        </li>
        <li>
          <label data-test="test-2">
            <input type="checkbox" />
            ESR $5
          </label>
        </li>
        <li>
          <label data-test="test-3">
            <input type="checkbox" />
            Glucose $8
          </label>
        </li>
      </ul>
      <div>
        Total: <span data-test="total">$123</span>
      </div>
      <div>
        Suggested pack: <span data-test="pack">Active minimum</span>
      </div>
      <div>
        Save: <span data-test="save">${40}</span>
      </div>
    </div>
  );
}
