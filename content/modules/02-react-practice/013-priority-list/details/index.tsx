import React from 'react';

export function Details() {
  return (
    <div>
      Your task is to implement a form and display added items in the given
      order.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>By default, the list should be empty.</li>
        <li>
          Display items in the following order. First promo items, then sort by
          priority descending, then sort by name ascending. The provided example
          shows the correct order of items.
        </li>
        <li>
          If the <code>promo</code> checkbox was checked, display{' '}
          <code>* </code> (separated by space).
        </li>
        <li>Display the priority in parentheses.</li>
        <li>
          Clicking on the <code>add</code> button should add a new item and
          clear the form. If the name or priority is empty or contains only
          whitespaces, do nothing.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
