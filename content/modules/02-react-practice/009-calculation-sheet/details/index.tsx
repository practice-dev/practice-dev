import React from 'react';

export function Details() {
  return (
    <div>
      Your task is to implement a minimal calculation sheet that supports basic
      math operations and allows you to create formulas that reference other
      cells.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>Display a fixed grid: 3 columns (A, B, C) and 7 rows (1-7).</li>
        <li>
          Clicking on the cell should show an input in that cell. The input
          should be focused automatically.
        </li>
        <li>
          It should be possible to enter any text in the input or enter a
          formula.
        </li>
        <li>
          Pressing the 'Enter' key or blurring the input (e.g., focusing on
          other cells or clicking anywhere on the page), should display the
          entered value or calculate the formula.
        </li>
        <li>
          A formula starts with a <code>=</code> character.
        </li>
        <li>
          A formula should support basic operations <code>+, -, *, /</code>, and
          parenthesis <code>(, )</code>.
          <br />
          Example formulas:
          <ul>
            <li>
              <code>=1</code>
            </li>
            <li>
              <code>=1+2</code>
            </li>
            <li>
              <code>=-1+2</code>
            </li>
            <li>
              <code>=2*3/3+1</code>
            </li>
            <li>
              <code>=((1+1) * 2)</code>
            </li>
          </ul>
        </li>
        <li>There can be spaces in the formula.</li>
        <li>
          It should be possible to reference other cells in the formula by
          entering cell coordinates.
          <br />
          Example formulas:
          <ul>
            <li>
              <code>=A1+A2</code>
            </li>
            <li>
              <code>=B1*2</code>
            </li>
            <li>
              <code>=(1+3)*B1 + C2</code>
            </li>
          </ul>
        </li>
        <li>
          Display <code>#ERR</code> if the formula can't be evaluated.
          <br />A formula can't be evaluated if:
          <ul>
            <li>
              There is a division by 0: <code>=10/0</code>.
            </li>
            <li>
              The referenced cell is empty or contains an invalid value:{' '}
              <code>=A1+3</code>, where <code>A1</code> is not a number.
            </li>
            <li>
              There is an infinite cycle between cells: <code>A1</code>{' '}
              references <code>B1</code>, <code>B1</code>
              references <code>C1</code>, <code>C1</code> references{' '}
              <code>A1</code>.
            </li>
          </ul>
        </li>
        <li>No need to support fractions.</li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
