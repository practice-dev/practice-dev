import React from 'react';

export function App() {
  const [items, setItems] = React.useState<string[]>(['pen', 'wheel']);
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <h2>My item list</h2>
      <ul>
        {items.map((item, i) => (
          <li key={i} data-test="item">
            {item}
          </li>
        ))}
      </ul>
      <input type="text" ref={ref} data-test="item-input" />{' '}
      <button
        data-test="add-btn"
        onClick={() => {
          if (ref.current && ref.current.value) {
            items.push(ref.current.value);
            setItems(items);
            ref.current.value = '';
          }
        }}
      >
        Add New
      </button>
    </div>
  );
}
