import React from 'react';

export function Details() {
  return (
    <div>
      The given code displays a list of products and allows to delete them.
      There is a confirmation modal when deleting an item. If the item is
      locked, another confirmation modal should pop up.
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>By default, display items defined in the code.</li>
        <li>
          If the item is locked, display <code>(locked)</code> text next to the
          product name.
        </li>
        <li>
          Clicking the <code>X</code> button should open a confirm dialog.
          Display a proper product name in the modal description.
        </li>
        <li>
          Clicking <code>No</code> in any modal should close the modal
          immediately.
        </li>
        <li>
          Clicking <code>Yes</code> in the confirm modal should delete the item
          if the item is not locked or open a second confirm dialog if the item
          is locked.
        </li>
        <li>
          If the item is being deleted, both buttons should be disabled, and{' '}
          <code>Yes</code> text should be changed to <code>Deleting...</code>.
        </li>
        <li>
          The deleting/loading state should last for 1s. After that, the dialog
          should be closed, and the item should be deleted from the list.
        </li>
        <li>
          Pay attention to <code>data-test</code> attributes, and don't delete
          them accidentally.
        </li>
      </ul>
      <h4>Refactoring suggestions:</h4>
      <ul>
        <li>Remove code duplication.</li>
        <li>Simplify code.</li>
        <li>Refactor code to separate components.</li>
        <li>Don't manipulate DOM directly.</li>
      </ul>
      <br />
      <div>
        NOTE: This is a refactoring challenge. The provided code passes all
        tests.
      </div>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
