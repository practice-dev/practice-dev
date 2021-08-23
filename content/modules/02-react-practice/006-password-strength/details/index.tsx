import React from 'react';

export function Details() {
  return (
    <div>
      Your task is to create a password form where the user can see the strength
      of his password.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>
          If the password matches the given rule, display <code>YES</code>,
          otherwise display <code>NO</code>.
        </li>
        <li>
          If 0 or 1 rules are met, display: <code>WEAK</code>.
        </li>
        <li>
          If 2 or 3 rules are met, display: <code>MEDIUM</code>.
        </li>
        <li>
          If all rules are met, display <code>STRONG</code>.
        </li>
        <li>
          You can assume that a special character is a character that it's not a
          number or letter.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
