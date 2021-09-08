import React from 'react';

export function Details() {
  return (
    <div>
      Your task is to persist the state of all selected filters in the URL (we
      recommend using a query string).
      <h4>Requirements:</h4>
      <ul>
        <li>
          Toggling a checkbox should change the URL using{' '}
          <code>history.push</code>.
        </li>
        <li>
          There is no strict URL format to use. It's up to you how to serialize
          it.
        </li>
        <li>On page load, deserialize the state from the URL.</li>
        <li>
          The back and forward buttons should work correctly. Checkboxes should
          always reflect the state from the URL.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
