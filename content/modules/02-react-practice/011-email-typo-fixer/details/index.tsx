import React from 'react';

export function Details() {
  return (
    <div>
      Your task is to check if there are possible typos in the entered email and
      try to suggest a correct email address.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>By default, the input should be empty.</li>
        <li>
          Support only the following domains: gmail.com, outlook.com, yahoo.com.
        </li>
        <li>
          Assume the following vocabulary:
          <ul>
            <li>"Main domain" is the part "gmail", "outlook" or "yahoo".</li>
            <li>"Extension domain" is "com".</li>
          </ul>
        </li>
        <li>
          Show a suggestion if the "main domain" has a single typo.
          <br />
          Example:
          <ul>
            <li>
              For <code>user1@gmaxl.com</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
            <li>
              For <code>user1@yatoo.com</code>, the suggestion is{' '}
              <code>user1@yahoo.com</code>.
            </li>
            <li>
              For <code>user1@outloox.com</code>, the suggestion is{' '}
              <code>user1@outlook.com</code>.
            </li>
          </ul>
          Don't suggest if there 2 or more typos.
        </li>
        <li>
          Show a suggestion if the "main domain" has 1 missing character.
          <br />
          Example:
          <ul>
            <li>
              For <code>user1@gmai.com</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
            <li>
              For <code>user1@yaho.com</code>, the suggestion is{' '}
              <code>user1@yahoo.com</code>.
            </li>
            <li>
              For <code>user1@oulook.com</code>, the suggestion is{' '}
              <code>user1@outlook.com</code>.
            </li>
          </ul>
          Don't suggest if 2 or more characters are missing.
        </li>
        <li>
          Show a suggestion if the "main domain" has one extra character.
          <br />
          Example:
          <ul>
            <li>
              For <code>user1@gmaill.com</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
            <li>
              For <code>user1@yahooo.com</code>, the suggestion is{' '}
              <code>user1@yahoo.com</code>.
            </li>
            <li>
              For <code>user1@ooutlook.com</code>, the suggestion is{' '}
              <code>user1@oulook.com</code>.
            </li>
          </ul>
          Don't suggest if there 2 or more extra characters.
        </li>
        <li>
          Show a suggestion if "Extension domain" is different.
          <br />
          Example:
          <ul>
            <li>
              For <code>user1@gmail.abc</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
            <li>
              For <code>user1@gmail.co</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
            <li>
              For <code>user1@gmail.yyyyy</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
          </ul>
        </li>
        <li>
          Show a suggestion if the "Extension domain" is different and the "Main
          domain" can be fixed using the rules above.
          <br />
          Example:
          <ul>
            <li>
              For <code>user1@gmai.abc</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
            <li>
              For <code>user1@gmaail.co</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
            <li>
              For <code>user1@xmail.yyyyy</code>, the suggestion is{' '}
              <code>user1@gmail.com</code>.
            </li>
          </ul>
        </li>
        <li>
          Don't show a suggestion if the email is invalid (e.g. missing "@"
          character) or if there are multiple domain levels (e.g.
          "user1@gmail.abc.com").
        </li>
        <li>
          Clicking on the suggestion should replace the input value and hide the
          suggestion.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
