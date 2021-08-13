import React from 'react';

export function App() {
  const [count, setCount] = React.useState<number>(0);
  return (
    <div>
      <h2>Unstable iframes</h2>
      <button
        data-test="add-btn"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        add
      </button>

      <div data-test="iframes">
        {Array.from({ length: count }).map((_, i) => (
          <iframe
            width="100"
            height="100"
            frameBorder="0"
            style={{ display: 'block' }}
            key={i}
            src="https://unstable-iframe.netlify.app"
          />
        ))}
      </div>
    </div>
  );
}
