import React from 'react';

export function Details() {
  return (
    <div>
      Create a secret phrase mechanism that will unlock the website. Unlock it
      if the user types <code>unlockplease</code>.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>
          There are no inputs. Listen to <code>keypress</code> events on the
          body document.
        </li>
        <li>
          The delay between letters should be less than 1s. <br />
          If the user types <code>unlock</code>, waits for 1s, and types{' '}
          <code>please</code>, it should not unlock.
        </li>
        <li>
          A full phrase must be typed exactly (no typos, missing letters, or
          duplicated). <br />
          For example, <code>unlocklease</code>, and <code>unlockpplease</code>{' '}
          should not be accepted.
        </li>
        <li>
          Invalid prefixes can be ignored. <br />
          For example: <code>abcdunlockplease</code>, should be accepted. The
          phase is correct if you remove the <code>abcd</code> prefix.
        </li>
        <li>
          You can assume that only a-z letters will be typed without special
          modifiers (ctrl, alt, shift).
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
