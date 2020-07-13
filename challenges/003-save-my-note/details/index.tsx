import {
  Section,
  IsolatedHtml,
  InjectingSection,
  HandlesTable,
  AdditionalReq,
} from '@pvd/ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Welcome to practice.dev! <br />
        This is a simple warmup fullstack challenge where you must implement
        frontend and API interactions.
        <br />
        In every fullstack challenge, we always give you a complete set of HTML
        and CSS files. Your task is to implement business logic without focusing
        on visual aspects. Additionally, you must create your API that interacts
        with the frontend.
        <br />
        Testing is based on <code>data-test</code> attributes on HTML elements.
        Pay attention to them, and do not remove them from the provided HTML
        files.
        <br />
        After you solve the challenge, you can upload a solution and share it
        with other developers.
        <br />
        Good luck!
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can save the note and load it later.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <IsolatedHtml
          height={200}
          addToggle
          css={exampleCss}
          html={exampleHTML}
        />

        <HandlesTable
          entries={[
            {
              handle: 'note',
              type: 'form field',
              desc: (
                <>
                  Represents a note field. It should include an{' '}
                  <code>input</code> element.
                </>
              ),
            },
            {
              handle: 'save-btn',
              type: 'button',
              desc: <>Saves the note to the API.</>,
            },
            {
              handle: 'load-btn',
              type: 'button',
              desc: <>Loads the note to the API.</>,
            },
          ]}
        />

        <AdditionalReq
          items={[
            <>
              Refreshing the page should display an empty note. Don't load it
              from the API automatically.
            </>,
            <>It should be possible to save an empty note.</>,
            <>
              You can assume that the note will have less than 100 characters.
            </>,
            <>
              Disable <code>save-btn</code> and <code>load-btn</code> buttons
              while loading or saving the note (add a <code>disable</code>{' '}
              attribute to the <code>{'<button>'}</code> element).
              <br />
              You can always disable both buttons, but it's not required.
            </>,
          ]}
        />
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 340, outline: 'none' }}
          src={
            'https://practice.dev/assets/003-demo.07abb3ac2098e8f9de12130a8aa5302a.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
