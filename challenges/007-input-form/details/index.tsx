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
import formHTML from './assets/form.html';
import resultHTML from './assets/result.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Your company tries to improve user security and plans to implement
        2-factor authentication on the login page. Your task is to create a
        user-friendly form for entering the PIN code that the users receive in
        SMS. There is no API integration, only the frontend component.
      </Section>

      <Section title="Use Cases">
        <ul>
          <li>As a user, I can enter a 4 digit code.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <SubSection title="Form view">
          <IsolatedHtml
            height={300}
            addToggle
            css={stylesCss}
            html={formHTML}
          />
          <HandlesTable
            entries={[
              {
                handle: 'i-*',
                type: 'form field',
                desc: (
                  <>
                    Represents an input field for a single digit. It should
                    include an <code>input</code> element.
                  </>
                ),
              },
            ]}
          />
          Represents a form for the 4-digit pin. There should be exactly 4 input
          elements, each input for a single digit.
          <AdditionalReq
            items={[
              <>Autofocus the first input on page load.</>,
              <>When entering the digit, automatically focus the next input.</>,
              <>
                The user can focus inputs manually by using a mouse. Entering a
                digit to non-empty input should override the existing value, and
                focus the next input.
              </>,
              <>If all 4 digits are entered, show the Result view.</>,
              <>Ignore other characters than digits 0-9.</>,
              <>
                When pressing <code>Backspace</code>, clear the input. If the
                input is already empty, focus the previous input, and clear it
                instead.
              </>,
              <>
                If the user enters a digit to the last input and other inputs
                are empty, focus the first empty input.
              </>,
            ]}
          />
        </SubSection>
        <SubSection title="Result view">
          <IsolatedHtml
            height={300}
            addToggle
            css={stylesCss}
            html={resultHTML}
          />
          <HandlesTable
            entries={[
              {
                handle: 'pin',
                type: 'text',
                desc: (
                  <>
                    Represents a pin entered. It should contain exactly 4
                    characters.
                  </>
                ),
              },
            ]}
          />
          Represents a page with the entered pin. Refreshing the page should
          show an empty pin form again.
        </SubSection>
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 400, outline: 'none' }}
          src={
            'https://practice.dev/assets/007-demo.125c00286bb7f59d2ff631a5849bd97d.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
