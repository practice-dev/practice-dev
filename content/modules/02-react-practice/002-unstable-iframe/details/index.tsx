import React from 'react';

export function Details() {
  return (
    <div>
      <p>
        Your task is to display a list of iframes without reloading them. The
        iframe randoms a number on page load. If the iframe reloads, it will
        show a different number.
      </p>
      <p>
        Clicking on the "add" button should add a new iframe at the beginning of
        the list. The provided code is not working as expected because it
        appends the iframe at the end.
      </p>
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>Display an empty list by default.</li>
        <li>
          Clicking on the "add" button should add a new iframe at the beginning.
        </li>
        <li>
          Once the iframe is loaded, it should never reload. It should always
          display the same number.
        </li>
        <li>
          The iframe URL is <code>https://unstable-iframe.netlify.app</code>. Do
          not change it.
        </li>
        <li>Do not use CSS to change the order.</li>
        <li>Try to create a clean React solution without hacks.</li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
