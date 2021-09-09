import React from 'react';

export function Details() {
  return (
    <div>
      Implement a simple counter.
      <h4>Requirements:</h4>
      <ul>
        <li>
          Clicking on the increase button should increase the counter by 1.
        </li>
        <li>
          Clicking on the decrease button should decrease the counter by 1.
        </li>
        <li>Clicking on the reset button should reset the counter to 0.</li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
      <br />
      Note: due to a small limitation, please import data from{' '}
      <code>reduxjs/toolkit</code>, not from <code>@reduxjs/toolkit</code>.
    </div>
  );
}
