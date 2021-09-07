import React from 'react';

export function Details() {
  return (
    <div>
      Create a mini-game where pressing a button toggles lights.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>There are 6 lights from A - F and 5 buttons from 1 to 5.</li>
        <li>By default, the lights should be off.</li>
        <li>
          Pressing the following button should toggle the following lights:
          <table>
            <thead>
              <th>button</th>
              <th>lights</th>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>B, E</td>
              </tr>
              <tr>
                <td>2</td>
                <td>B, C, D</td>
              </tr>
              <tr>
                <td>3</td>
                <td>A, F</td>
              </tr>
              <tr>
                <td>4</td>
                <td>E</td>
              </tr>
              <tr>
                <td>5</td>
                <td>A, B, F</td>
              </tr>
            </tbody>
          </table>
          You can use a <code>toggleMap</code> variable provided in the code.
        </li>
        <li>
          If the light is on, add an <code>active</code> class.
        </li>
        <li>
          If the light is off, remove an <code>active</code> class.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
