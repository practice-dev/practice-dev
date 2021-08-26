import React from 'react';

export function Details() {
  return (
    <div>
      Implement a cookie alert that asks the user to accept using cookies.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>
          Display an overlay with two buttons. The provided code shows it by
          default.
        </li>
        <li>
          If the user clicks Accept, the overlay should close, and{' '}
          <code>data-test="consent"</code> should display <code>Yes</code>.
        </li>
        <li>
          If the user clicks Reject, the overlay should close, and{' '}
          <code>data-test="consent"</code> should display <code>No</code>.
        </li>
        <li>
          By default <code>data-test="consent"</code> should display{' '}
          <code>-</code>.
        </li>
        <li>
          Remember the decision in localStorage or cookies. After refreshing the
          page, don't ask for permission again.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
