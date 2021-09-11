import React from 'react';

export function Details() {
  return (
    <div>
      Your task is to create an input that allows entering a numeric value, and
      on blur shows a user-friendly formatted text.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>By default, the input should be empty.</li>
        <li>
          When the input is focused, change the <code>type</code> attribute to{' '}
          <code>number</code>, so that the user can enter only a valid number.
        </li>
        <li>
          When the input is blurred, change the <code>type</code> attribute to{' '}
          <code>string</code>, and format the number according to the below
          rules.
          <ul>
            <li>
              Prefix it with a $ character.
              <br />
              Example: <code>123</code> {'->'} <code>$123</code>
            </li>
            <li>
              Separate thousands by a comma.
              <br />
              Example: <code>1000</code> {'->'} <code>$1,000</code>
            </li>
            <li>
              If the value is less than 0, wrap it in parentheses.
              <br />
              Example: <code>-1000</code> {'->'} <code>($1,000)</code>
            </li>
            <li>
              Support the fraction part properly (max 4 characters) and separate
              it always with a dot character.
              <br />
              Example: <code>1000.54</code> {'->'} <code>$1,000.54</code>
            </li>
          </ul>
        </li>
        <li>
          It should be possible to clear the input. Format it as an empty string
          as well.
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
