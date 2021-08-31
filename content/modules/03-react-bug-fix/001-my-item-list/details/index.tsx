import React from 'react';

export function Details() {
  return (
    <div>
      The given code should display a list of items and allow adding new items,
      but it's not working properly.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>
          By default, display items <code>pen</code>, and <code>wheel</code>.
        </li>
        <li>
          Clicking <code>Add New</code> should add a new item at the end of the
          list and clear the input.
        </li>
        <li>If the input is empty, do nothing.</li>
      </ul>
      <h4>Current bug:</h4>
      <ul>
        <li>
          Clicking on the button clears the input, but the item is not added to
          the list.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
