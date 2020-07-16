import {
  Section,
  IsolatedHtml,
  InjectingSection,
  HandlesTable,
  SubSection,
} from '@pvd/ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Welcome to practice.dev! <br />
        This is a simple warmup challenge where you must implement minimal
        interactions.
        <br />
        In every frontend challenge, we always give you a complete set of HTML
        and CSS files. Your task is to implement business logic without focusing
        on visual aspects.
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
          <li>As a user, I can increase or decrease the counter value.</li>
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
              handle: 'count-value',
              type: 'text',
              desc: 'Displays the counter value. Display 0 by default.',
            },
            {
              handle: 'increase-btn',
              type: 'button',
              desc: (
                <>
                  Increases <code>count-value</code> by 1.
                </>
              ),
            },
            {
              handle: 'decrease-btn',
              type: 'button',
              desc: (
                <>
                  Decreases <code>count-value</code> by 1.
                </>
              ),
            },
          ]}
        />
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 340, outline: 'none' }}
          src={
            'https://practice.dev/assets/001-demo.2cd7a6fff8d7170218a4741fa046746a.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <Section title="Tutorials">
        <SubSection title="CodeSandbox.io">
          (Recommended) The below video demonstrates how to solve the challenge
          on{' '}
          <a href="https://codesandbox.io/" target="_blank">
            https://codesandbox.io/
          </a>
          .
          <video
            style={{ width: '100%', height: 400, outline: 'none' }}
            src={
              'https://practice.dev/assets/cs-demo.712d7df0d4e7d529a98cb7538622f07a.mp4'
            }
            controls
          ></video>
        </SubSection>
        <SubSection title="localhost">
          The below video demonstrates how to solve this challenge on localhost
          using{' '}
          <a href="https://ngrok.com/" target="_blank">
            https://ngrok.com/
          </a>
          . <br />
          The template is based on{' '}
          <a
            href="https://github.com/facebook/create-react-app"
            target="_blank"
          >
            https://github.com/facebook/create-react-app
          </a>
          .
          <video
            style={{ width: '100%', height: 400, outline: 'none' }}
            src={
              'https://practice.dev/assets/localhost-demo.181a756821fd1eb717ee3cfd2fbbb0d8.mp4'
            }
            controls
          ></video>
        </SubSection>
      </Section>
      <InjectingSection />
    </div>
  );
}
