import React from 'react';

export function Details() {
  return (
    <div>
      Your task is to implement an input for adding tags.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>
          By default, the input should be empty, and there should be no tags.
        </li>
        <li>
          Pressing <code>Enter</code> should add a new tag and clear the input.
          The input should remain focused.
        </li>
        <li>If the input is empty or contains only spaces, do nothing.</li>
        <li>
          Pressing <code>Backspace</code> should remove the latest tag, but only
          if the cursor is at the beginning of the input. If the cursor is not
          at the beginning, it should simply remove the previous character (it's
          the default behavior).
        </li>
        <li>
          Display tags in proper order. The most right tag is the most recent.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
