import React from 'react';
import './styles.css';

export function App() {
  const [ratio, setRatio] = React.useState('');
  return (
    <div>
      <h2>Image size ratio</h2>
      <input type="file" data-test="file-input" />
      <div className="result" data-test="result">
        {ratio}
      </div>
    </div>
  );
}
