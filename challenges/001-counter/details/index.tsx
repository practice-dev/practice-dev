import { Section, IsolatedHtml, InjectingSection, HandlesTable } from '@pvd/ui';
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
              handle: 'increase-btn',
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
      <InjectingSection />
    </div>
  );
}
