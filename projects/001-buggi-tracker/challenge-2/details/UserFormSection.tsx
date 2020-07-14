import {
  FormFields,
  SubSection,
  IsolatedHtml,
  HandlesTable,
  AdditionalReq,
} from '@pvd/ui';
import addUserHtml from './assets/addUser.html';
import editUserHtml from './assets/editUser.html';
import stylesCss from './assets/styles.css';
import React from 'react';

interface UserFormSectionProps {
  edit?: boolean;
}

export function UserFormSection(props: UserFormSectionProps) {
  const { edit } = props;

  return (
    <SubSection title={edit ? 'Edit User page' : 'Add User page'}>
      <IsolatedHtml
        height={430}
        addToggle
        css={stylesCss}
        html={edit ? editUserHtml : addUserHtml}
      />
      <HandlesTable
        entries={[
          {
            handle: 'breadcrumb',
            type: 'container',
            desc: (
              <>
                Contains breadcrumb items (<code>bc-i</code>).
              </>
            ),
          },
          {
            handle: 'bc-1',
            type: 'link',
            desc: <>Redirects to the Home page.</>,
          },
          {
            handle: 'bc-2',
            type: 'link',
            desc: <>Redirects to the Users page.</>,
          },
          {
            handle: 'bc-3',
            type: 'text',
            desc: <>Displays static {edit ? 'Edit User' : 'Add User'} text.</>,
          },
          {
            handle: 'username',
            type: 'form field',
            desc: (
              <>
                Represents a username field. It should include an{' '}
                <code>input</code> element and an <code>error</code> handle for
                the validation message.
              </>
            ),
          },
          {
            handle: 'role',
            type: 'form field',
            desc: (
              <>
                Represents a role field. It should include a <code>select</code>{' '}
                element and an <code>error</code> handle for the validation
                message.
              </>
            ),
          },
          {
            handle: 'save-btn',
            type: 'button',
            desc: (
              <>
                Validates and saves the user. If the user was successfully{' '}
                {edit ? 'edited' : 'created'}, redirect to the Users page.
              </>
            ),
          },
        ]}
      />
      <FormFields
        entries={[
          {
            field: 'username',
            type: 'text',
            desc: "Represents the user's username used for logging in.",
            defaultValue: edit
              ? 'The username of the edited user.'
              : 'An empty value.',
            rules: [
              {
                rule: 'Required',
                error: 'Username is required',
                condition: 'The input is empty.',
              },
              {
                rule: 'Max length',
                error: 'Username can have max 10 characters',
                condition: 'The input contains more than 10 characters.',
              },
              {
                rule: 'Allowed characters',
                error: 'Username can contain only letters and numbers',
                condition:
                  'The input contains characters that are not letters (a-z), or not numbers (0-9).',
              },
              {
                rule: 'Unique',
                error: 'Username is already taken',
                condition: (
                  <>
                    The username is already taken by another user. Usernames are
                    not case sensitive. <br />
                    Example: <br />
                    If there is already a user <code>admin</code>, then it
                    should not be possible to create a new user{' '}
                    <code>AdMiN</code>.
                  </>
                ),
                async: true,
              },
            ],
          },
          {
            field: 'role',
            type: 'select',
            desc: 'Represents the user role.',
            options: (
              <>
                Options should have the following text content:
                <code>admin</code>, <code>owner</code>, <code>reporter</code>.
              </>
            ),
            defaultValue: edit
              ? 'The role of the edited user.'
              : 'The select should be not selected by default.',
            rules: [
              {
                rule: 'Required',
                error: 'Role is required',
                condition: 'The select is not selected.',
              },
            ],
          },
        ]}
      />
      {edit ? (
        <>Represents a form page for editing a user.</>
      ) : (
        <>Represents a form page for creating a new user.</>
      )}
      <AdditionalReq
        items={[
          <>Don't show validation messages by default.</>,
          <>
            Trigger synchronous validation errors immediately when typing a
            value to inputs.
          </>,
          <>
            Trigger asynchronous validation errors after clicking the save
            button.
          </>,
          <>
            It should be a separate route. Refreshing the page should load this
            page again.
          </>,
          <>Loading states and confirmation alerts are not required.</>,
        ]}
      />
    </SubSection>
  );
}
