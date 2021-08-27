import React from 'react';

export function Details() {
  return (
    <div>
      Your task is to display a 6x6 grid and implement navigation using keyboard
      arrows.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>Display a fixed grid: 6 rows and 6 columns.</li>
        <li>
          Each cell has a number from 1 - 36. Display it in the cell.
        </li>{' '}
        <li>
          Add proper test attributes to cell elements. If the cell number is{' '}
          <code>4</code>, set <code>data-test="cell-4"</code>. Refer to the
          provided html code.
        </li>
        <li>
          Add an <code>active</code> class to the active cell. Only one cell
          should be active at the same time.
        </li>
        <li>Cell 1 should be active by default.</li>
        <li>
          Implement keyboard navigation. Listen to events on the body document.
        </li>
        <li>
          Pressing <code>ArrowUp</code> should go up.
          <br />
          Example: 10 {'->'} 4.
        </li>
        <li>
          Pressing <code>ArrowLeft</code> should go left.
          <br />
          Example: 10 {'->'} 9.
        </li>
        <li>
          Pressing <code>ArrowRight</code> should go right.
          <br />
          Example: 10 {'->'} 11.
        </li>
        <li>
          Pressing <code>ArrowDown</code> should go down.
          <br />
          Example: 10 {'->'} 16.
        </li>
        <li>
          If the navigation is not possible (e.g. moving up from cell 4), then
          nothing should happen.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
