import React from 'react';

export function App() {
  const [ratio, setRatio] = React.useState('');
  return (
    <div>
      <h2>Image size ratio</h2>
      <input type="file" data-test="file-input" />
      <div
        data-test="result"
        style={{
          marginTop: 20,
          width: 80,
          height: 80,
          border: '1px dotted #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {ratio}
      </div>
    </div>
  );
}
