import {
  AdditionalReq,
  HandlesTable,
  InjectingSection,
  IsolatedHtml,
  Section,
} from '@pvd/ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Your mom often travels between the USA and Europe, and she has problems
        with different temperature units. You have decided to help her by
        creating a very basic converter form.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a mom, I can convert °C temperature to °F temperature.</li>
          <li>As a mom, I can convert °F temperature to °C temperature.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <IsolatedHtml
          height={300}
          addToggle
          css={exampleCss}
          html={exampleHTML}
        />
        <HandlesTable
          entries={[
            {
              handle: 'celsius',
              type: 'form field',
              desc: (
                <>
                  Represents a °C field. It should include an <code>input</code>{' '}
                  element. When entering a value to the input, you should
                  calculate the °F temperature automatically.
                </>
              ),
            },
            {
              handle: 'fahrenheit',
              type: 'form field',
              desc: (
                <>
                  Represents a °F field. It should include an <code>input</code>{' '}
                  element. When entering a value to the input, you should
                  calculate the °C temperature automatically.
                </>
              ),
            },
          ]}
        />
        <AdditionalReq
          items={[
            <>
              Use the following formula for converting °C to °F:
              <br />
              <code>°F = °C * 9 / 5 + 32</code>
              <br />
              When converting °F to °C, you should reverse the above formula.
            </>,
            <>Round values to 1 decimal place.</>,
            <>Clearing the input should also clear the other input.</>,
            <>
              You can assume that all input numbers will be valid numbers from
              -10000 to 10000 range.
            </>,
            <>
              Don't display trailing zeros (display <code>13</code>, instead of{' '}
              <code>13.0</code>).
            </>,
          ]}
        />
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 400, outline: 'none' }}
          src={
            'https://practice.dev/assets/006-demo.3bd193ad7104ac18a73eac684cb9083f.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
