import React from 'react';

export function Details() {
  return (
    <div>
      You are creating an e-commerce shop for a medical lab, where clients can
      buy various blood tests. Each test has a fixed price, and your task is to
      suggest a test pack so that client can save money.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>
          Display a list of blood tests (<code>bloodTests</code> variable) from
          the <code>data</code> file.
        </li>
        <li>
          Each blood test item should display the test name and the price.
          <br /> For example: <code>Complete blood count $5</code>.
        </li>
        <li>
          Add proper test attributes to <code>{'<label>'}</code> elements. If
          the test id is <code>4</code>, set <code>data-test="test-4"</code>.
          Refer to the provided html code.
        </li>
        <li>
          It should be possible to check and uncheck tests. By default, all
          checkboxes should be unchecked.
        </li>
        <li>Display the total price of all selected tests.</li>
        <li>
          Try to suggest a pack. A pack should be suggested if buying this pack
          would reduce the price. <br />
          For example: <br />
          User selected: LDL ($10), TSH ($15), FT3 ($15). <br />
          Total is $40. <br />
          If user buys LDL ($10) + Thyroid pack ($25), he will pay $35, and save
          $5.
        </li>
        <li>
          If multiple packs can be suggested, display the one with the biggest
          saving value.
        </li>
        <li>
          Packs are defined in the <code>bloodPacks</code> variable in the{' '}
          <code>data</code> file.
        </li>
        <li>
          If no pack can be suggested, display <code>-</code>&nbsp;(suggested
          pack) and <code>$0</code>&nbsp;(save).
        </li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
