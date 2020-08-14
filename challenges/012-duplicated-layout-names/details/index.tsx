import {
  AdditionalReq,
  HandlesTable,
  InjectingSection,
  IsolatedHtml,
  Section,
  SubSection,
} from '@pvd/ui';
import React from 'react';
import stylesCss from './assets/styles.css';
import pageHTML from './assets/page.html';
import addLayout from './assets/addLayout.html';
import editLayout from './assets/editLayout.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Create a CRUD page for layouts, and implement the logic for handling
        duplicated names.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can view, create, edit, delete layouts.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <SubSection title="Main View">
          <IsolatedHtml
            height={430}
            addToggle
            css={stylesCss}
            html={pageHTML}
          />
          <HandlesTable
            entries={[
              {
                handle: 'add-btn',
                type: 'button',
                desc: <>Shows an Add Layout modal.</>,
              },
              {
                handle: 'name-i',
                type: 'text',
                desc: <>Displays the name of the i-th layout in the table.</>,
              },
              {
                handle: 'delete-btn-i',
                type: 'button',
                desc: <>Deletes the layout.</>,
              },
              {
                handle: 'edit-btn-i',
                type: 'button',
                desc: <>Shows an Edit Layout modal.</>,
              },
            ]}
          />
          Represents a table with all layouts.
          <AdditionalReq
            items={[
              <>The table should be empty by default.</>,
              <>Refreshing the page should empty the table.</>,
              <>Display layouts from oldest to newest.</>,
              <>
                The <code>i</code> symbol in handles represents the row number
                in the table (starting from 1).
              </>,
            ]}
          />
        </SubSection>
        <SubSection title="Add Layout modal">
          <IsolatedHtml
            height={300}
            addToggle
            css={stylesCss}
            html={addLayout}
          />
          <HandlesTable
            entries={[
              {
                handle: 'modal',
                type: 'container',
                desc: <>Represents the modal dialog.</>,
              },
              {
                handle: 'title',
                type: 'text',
                desc: <>Displays "Add Layout" text</>,
              },
              {
                handle: 'name',
                type: 'form field',
                desc: (
                  <>
                    Represents a name field. It should include a{' '}
                    <code>input</code> element.
                  </>
                ),
              },
              {
                handle: 'save-btn',
                type: 'button',
                desc: (
                  <>
                    Adds the new layout. <br />
                    Validation is not required. You can assume name will not be
                    empty.
                  </>
                ),
              },
              {
                handle: 'cancel-btn',
                type: 'button',
                desc: <>Closes the dialog.</>,
              },
            ]}
          />
          Represents a modal for creating a new layout. <br />
          If the name is duplicated (you can assume names will always be in
          lowercase), implement the following logic:
          <ul>
            <li>
              Append <code>-2</code> to the name.
            </li>
            <li>If the new name is unique, use the name.</li>
            <li>
              If the new name is duplicated, increase the appended number by 1,
              and repeat steps.
            </li>
          </ul>
          For example: <br />
          If the layout names are: <code>abc</code>, <code>foo</code>. <br />
          And the new name is: <code>abc</code>. <br />
          Then the new name should be changed to <code>abc-2</code>.
          <br />
          <br />
          Another example: <br />
          If the layout names are: <code>abc</code>, <code>abc-2</code>,{' '}
          <code>abc-4</code>.<br />
          And the new name is: <code>abc</code>. <br />
          Then the new name should be changed to <code>abc-3</code>.
          <br />
          <br />
          Another example: <br />
          If the layout names are: <code>abc</code>, <code>abc-2</code>.<br />
          And the new name is: <code>abc-2</code>. <br />
          Then the new name should be changed to <code>abc-2-2</code>.
        </SubSection>
        <SubSection title="Edit Layout modal">
          <IsolatedHtml
            height={300}
            addToggle
            css={stylesCss}
            html={editLayout}
          />
          <HandlesTable
            entries={[
              {
                handle: 'modal',
                type: 'container',
                desc: <>Represents the modal dialog.</>,
              },
              {
                handle: 'title',
                type: 'text',
                desc: <>Displays "Edit Layout" text</>,
              },
              {
                handle: 'name',
                type: 'form field',
                desc: (
                  <>
                    Represents a name field. It should include a{' '}
                    <code>input</code> element.
                  </>
                ),
              },
              {
                handle: 'save-btn',
                type: 'button',
                desc: (
                  <>
                    Saves the layout. <br />
                    Validation is not required. You can assume name will not be
                    empty.
                  </>
                ),
              },
              {
                handle: 'cancel-btn',
                type: 'button',
                desc: <>Closes the dialog.</>,
              },
            ]}
          />
          Changing name logic should be similar to logic from create new layout.
          <br />
          For example: <br />
          If the layout names are: <code>abc</code>, <code>foo</code>. <br />
          And you change <code>abc</code> to <code>foo</code>. <br />
          Then the name should be changed to <code>foo-2</code>.
          <br />
          <br />
          Another example: <br />
          If the layout names are: <code>abc</code>, <code>abc-2</code>,{' '}
          <code>abc-4</code>.<br />
          And you change <code>abc-2</code> to <code>abc</code>. <br />
          Then the name should be changed to <code>abc-2</code>.
        </SubSection>
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 400, outline: 'none' }}
          src={
            'https://practice.dev/assets/012-demo.5a99f2247fd120362cced344338f7798.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
