import {
  Section,
  IsolatedHtml,
  InjectingSection,
  SubSection,
  HandlesTable,
  AdditionalReq,
} from '@pvd/ui';
import React from 'react';
import stylesCss from './assets/styles.css';
import nonAdminHomeHtml from './assets/nonAdminHome.html';
import adminHomeHtml from './assets/adminHome.html';
import usersHtml from './assets/users.html';
import deleteUserHtml from './assets/deleteUser.html';
import { UserFormSection } from './UserFormSection';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Buggi tracker is a new generation tool for bug tracking and project
        management. <br />
        In this iteration, you must implement user management pages.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As an admin user, I can create, edit or delete other users.</li>
        </ul>
      </Section>
      <Section title="Features">
        <SubSection title="Seed data">
          Modify the seed data from the previous iteration, add a new{' '}
          <code>role</code> field.
          <br />
          Generate the following users:
          <table>
            <thead>
              <tr>
                <th>username</th>
                <th>role</th>
                <th>password</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>admin</td>
                <td>admin</td>
                <td>passa1</td>
              </tr>
              <tr>
                <td>owner1</td>
                <td>owner</td>
                <td>passa1</td>
              </tr>
              <tr>
                <td>owner2</td>
                <td>owner</td>
                <td>passa1</td>
              </tr>
              <tr>
                <td>reporter1</td>
                <td>reporter</td>
                <td>passa1</td>
              </tr>
              <tr>
                <td>reporter2</td>
                <td>reporter</td>
                <td>passa1</td>
              </tr>
            </tbody>
          </table>
        </SubSection>

        <SubSection title="Home page (non-admin)">
          <IsolatedHtml
            height={320}
            addToggle
            css={stylesCss}
            html={nonAdminHomeHtml}
          />
          <HandlesTable
            entries={[
              {
                handle: 'placeholder',
                type: 'text',
                desc: <>Displays static "home page placeholder" text.</>,
              },
            ]}
          />
          Represents a home page for users with <code>owner</code> or{' '}
          <code>reporter</code> roles. In this iteration, you won't implement
          any functionality for these roles.
        </SubSection>
        <SubSection title="Home page (admin)">
          <IsolatedHtml
            height={320}
            addToggle
            css={stylesCss}
            html={adminHomeHtml}
          />
          <HandlesTable
            entries={[
              {
                handle: 'home-card-1',
                type: 'link',
                desc: (
                  <>
                    Redirects to the Users page.
                    <br />
                    Recommended url is <code>/users</code>, but it's not
                    required.
                  </>
                ),
              },
            ]}
          />
          Represents a home page for admin users. Only users with an admin role
          can manage users (create, edit or delete).
        </SubSection>
        <SubSection title="Users page">
          <IsolatedHtml
            height={430}
            addToggle
            css={stylesCss}
            html={usersHtml}
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
                type: 'text',
                desc: <>Displays static "Users" text.</>,
              },
              {
                handle: 'add-user-btn',
                type: 'link',
                desc: <>Redirects to the New User page.</>,
              },
              {
                handle: 'username-i',
                type: 'text',
                desc: <>Displays the username of the i-th user in the table.</>,
              },
              {
                handle: 'role-i',
                type: 'text',
                desc: <>Displays the role of the i-th user in the table.</>,
              },
              {
                handle: 'delete-btn-i',
                type: 'button',
                desc: <>Shows a delete confirmation modal.</>,
              },
              {
                handle: 'edit-btn-i',
                type: 'link',
                desc: <>Redirects to the Edit User page.</>,
              },
            ]}
          />
          Represents a users page that displays all applications users. Only the
          users with the <code>admin</code> role can access this page.
          <AdditionalReq
            items={[
              <>
                Display a list of all users sorted alphabetically by username.
              </>,
              <>
                Don't implement pagination. You can assume there will be less
                than 20 users during testing.
              </>,
              <>
                It should be a separate route. Refreshing the page should load
                this page again.
              </>,
              <>
                The <code>i</code> symbol in handles represents the row number
                in the table (starting from 1).
              </>,
              <>
                The current user cannot delete or edit himself. Hide action
                buttons for that row. <br />
                It should be possible to edit other admin users.
              </>,
            ]}
          />
        </SubSection>

        <SubSection title="Users page (delete user)">
          <IsolatedHtml
            height={430}
            addToggle
            css={stylesCss}
            html={deleteUserHtml}
          />
          <HandlesTable
            entries={[
              {
                handle: 'modal',
                type: 'container',
                desc: <>Represents the modal dialog.</>,
              },
              {
                handle: 'desc',
                type: 'text',
                desc: (
                  <>
                    Displays the warning message. <br />
                    If you delete the <code>reporter1</code> user, display:{' '}
                    <br />
                    <code>Are you sure to delete "reporter1"?</code>
                  </>
                ),
              },
              {
                handle: 'no-btn',
                type: 'button',
                desc: <>Hides the modal dialog.</>,
              },
              {
                handle: 'yes-btn',
                type: 'button',
                desc: <>Deletes the user, and removes it from the table.</>,
              },
            ]}
          />
          <AdditionalReq
            items={[
              <>Loading states and confirmation alerts are not required.</>,
            ]}
          />
        </SubSection>

        <UserFormSection />
        <UserFormSection edit />
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 340, outline: 'none' }}
          src={
            'https://practice.dev/assets/001-2-demo.43b5f60d36a4cbeb1707246ec1a17d7e.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
