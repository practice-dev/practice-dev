import React from 'react';
import './styles.css';

export function App() {
  return (
    <div>
      <h2>Calculation Sheet</h2>
      <div className="grid">
        <div className="cell"></div>
        <div className="cell header">A</div>
        <div className="cell header">B</div>
        <div className="cell header">C</div>
        <div className="cell header">1</div>
        <div className="cell" data-test="A1">
          15
        </div>
        <div className="cell" data-test="B1">
          <input type="text" defaultValue="=A1*2" />
        </div>
        <div className="cell" data-test="C1"></div>
        <div className="cell header">2</div>
        <div className="cell" data-test="A2"></div>
        <div className="cell" data-test="B2"></div>
        <div className="cell" data-test="C2"></div>
        <div className="cell header">3</div>
        <div className="cell" data-test="A3"></div>
        <div className="cell" data-test="B3"></div>
        <div className="cell" data-test="C3"></div>
        <div className="cell header">4</div>
        <div className="cell" data-test="A4"></div>
        <div className="cell" data-test="B4"></div>
        <div className="cell" data-test="C4"></div>
        <div className="cell header">5</div>
        <div className="cell" data-test="A5"></div>
        <div className="cell" data-test="B5"></div>
        <div className="cell" data-test="C5"></div>
        <div className="cell header">6</div>
        <div className="cell" data-test="A6"></div>
        <div className="cell" data-test="B6"></div>
        <div className="cell" data-test="C6"></div>
        <div className="cell header">7</div>
        <div className="cell" data-test="A7"></div>
        <div className="cell" data-test="B7"></div>
        <div className="cell" data-test="C7"></div>
      </div>
    </div>
  );
}
