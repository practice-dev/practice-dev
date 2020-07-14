import {
  Section,
  IsolatedHtml,
  InjectingSection,
  SubSection,
  HandlesTable,
  AdditionalReq,
  FormFields,
} from '@pvd/ui';
import React from 'react';
import stylesCss from './assets/styles.css';
import loginHtml from './assets/login.html';
import homepageHtml from './assets/homepage.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Buggi tracker is a new generation tool for bug tracking and project
        management. <br />
        In this iteration, you must initiate the project and implement
        functionality related to authorization.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As an unauthorized user, I can log in to the application.</li>
          <li>As a user, I can log out.</li>
        </ul>
      </Section>
      <Section title="Features">
        <SubSection title="Seed data">
          It won't be possible to register to the application.
          <br />
          Generate the following users:
          <table>
            <thead>
              <tr>
                <th>username</th>
                <th>password</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>admin</td>
                <td>passa1</td>
              </tr>
              <tr>
                <td>owner1</td>
                <td>passa1</td>
              </tr>
              <tr>
                <td>owner2</td>
                <td>passa1</td>
              </tr>
              <tr>
                <td>reporter1</td>
                <td>passa1</td>
              </tr>
              <tr>
                <td>reporter2</td>
                <td>passa1</td>
              </tr>
            </tbody>
          </table>
        </SubSection>
        <SubSection title="Login page">
          <IsolatedHtml
            height={420}
            addToggle
            css={stylesCss}
            html={loginHtml}
          />
          <HandlesTable
            entries={[
              {
                handle: 'login-error',
                type: 'text',
                desc: (
                  <>
                    Displays an error if the authorization was not successful.
                    <br />
                    Display "Authentication failed" if username or password is
                    invalid.
                    <br />
                  </>
                ),
              },
              {
                handle: 'username',
                type: 'form field',
                desc: (
                  <>
                    Represents a username field. It should include an{' '}
                    <code>input</code> element and an <code>error</code> handle
                    for the validation message.
                  </>
                ),
              },
              {
                handle: 'password',
                type: 'form field',
                desc: (
                  <>
                    Represents a password field. It should include an{' '}
                    <code>input</code> element and an <code>error</code> handle
                    for the validation message.
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
                desc: 'Represents the username.',
                defaultValue: 'An empty value.',
                rules: [
                  {
                    rule: 'Required',
                    error: 'Username is required',
                    condition: 'The input is empty.',
                  },
                ],
              },
              {
                field: 'password',
                type: 'password',
                desc: 'Represents the password.',
                defaultValue: 'An empty value.',
                rules: [
                  {
                    rule: 'Required',
                    error: 'Password is required',
                    condition: 'The input is empty.',
                  },
                ],
              },
            ]}
          />
          Represents the login page. Show this page if the user is not
          authenticated. It should be possible to log in as users generated in
          the "Seed data" section.
          <AdditionalReq
            items={[
              <>
                The username is not case sensitive. <br />
                Example:
                <br />
                Logging as <code>aDmin</code> and <code>AdmiN</code> should log
                in successful as <code>admin</code>.
              </>,
              <>Don't show validation messages by default.</>,
              <>Loading states are not required.</>,
              <>
                Trigger synchronous validation errors immediately when typing a
                value to inputs.
              </>,
              <>
                Trigger asynchronous validation errors after clicking the login
                button.
              </>,
            ]}
          />
        </SubSection>

        <SubSection title="Home page">
          <IsolatedHtml
            height={320}
            addToggle
            css={stylesCss}
            html={homepageHtml}
          />
          <HandlesTable
            entries={[
              {
                handle: 'header-username',
                type: 'text',
                desc: (
                  <>
                    Displays a welcome message in form{' '}
                    <code>Hello {'{username}'}</code>, where{' '}
                    <code>{'{username}'}</code> is the username of the logged in
                    user.
                  </>
                ),
              },
              {
                handle: 'placeholder',
                type: 'text',
                desc: <>Displays static "home page placeholder" text.</>,
              },
              {
                handle: 'logout-btn',
                type: 'button',
                desc: <>Logs out the user and navigates to the login page.</>,
              },
            ]}
          />
          Represents the home page. In this iteration, it contains only a
          placeholder.
          <AdditionalReq
            items={[
              <>User should still be logged in after refreshing the page.</>,
              <>Session expiration is not required to implement.</>,
            ]}
          />
        </SubSection>
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 340, outline: 'none' }}
          src={
            'https://practice.dev/assets/001-1-demo.fba1cb338236eef9f3933ffeed78a1ad.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
