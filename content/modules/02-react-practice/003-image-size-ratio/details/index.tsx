import React from 'react';

export function Details() {
  return (
    <div>
      Calculate the size ratio of the selected image. The image ratio is the
      proportion of the width and height.
      <br />
      <h4>Examples:</h4>
      <table>
        <thead>
          <th>width</th>
          <th>height</th>
          <th>ratio</th>
        </thead>
        <tbody>
          <tr>
            <td>300px</td>
            <td>400px</td>
            <td>
              <code>3x4</code>
            </td>
          </tr>
          <tr>
            <td>300px</td>
            <td>300px</td>
            <td>
              <code>1x1</code>
            </td>
          </tr>
          <tr>
            <td>101px</td>
            <td>345px</td>
            <td>
              <code>101x345</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        In the last example, the ratio can't be reduced, and it's the same as
        the image size.
      </p>
      <br />
      <h4>Requirements:</h4>
      <ul>
        <li>Display an empty ratio by default.</li>
        <li>
          Display ratio without spaces around <code>x</code>.
        </li>
        <li>Calculate the ratio immediately after selecting the file.</li>
        <li>
          The ratio values should be reduced to as smallest values as possible.
        </li>
        <li>You can assume the selected file is always a valid image.</li>
        <li>Width and height are between 1 and 1000.</li>
      </ul>
      <br />
      You are free to add classes, styles, ids, but don't edit or remove{' '}
      <code>data-test</code> attributes.
    </div>
  );
}
