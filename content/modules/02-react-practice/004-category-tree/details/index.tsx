import React from 'react';

export function Details() {
  return (
    <div>
      Create a category tree where each category may have multiple nested
      categories.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>
          Generate the category tree using the provided <code>categories</code>{' '}
          data. The provided code shows the expected HTML structure.
        </li>
        <li>All categories should be expanded by default.</li>
        <li>The toggle button should collapse or expand the category.</li>
        <li>
          If the category is expanded, change the button text from{' '}
          <code>-</code> to <code>+</code>.
        </li>
        <li>
          If expanding the category, always expand its children.
          <br />
          For example:
          <ul>
            <li>collapse "Computers"</li>
            <li>collapse "Electronics"</li>
            <li>expand "Electronics"</li>
          </ul>
          In this case "Computers" should also be expanded.
        </li>
        <li>
          Add proper test attributes to category <code>{'<li>'}</code> elements.
          If the category id is <code>4</code>, set{' '}
          <code>data-test="category-4"</code>. Refer to the provided html code.
        </li>
        <li>Try to keep the same HTML structure.</li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
