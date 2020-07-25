import {
  AdditionalReq,
  HandlesTable,
  Highlight,
  InjectingSection,
  IsolatedHtml,
  Section,
  SubSection,
} from '@pvd/ui';
import React from 'react';
import stylesCss from './assets/styles.css';
import pageHTML from './assets/page.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Flaky API is an API that returns various responses. Sometimes it returns
        a success response, and sometimes an error response. Your task will be
        to call the API and try on retry errors.
      </Section>

      <Section title="Use Cases">
        <ul>
          <li>As a user, I can fetch the API response.</li>
        </ul>
      </Section>

      <Section title="Acceptance Criteria">
        <SubSection title="Flaky API">
          The Flaky API is located at <code>https://flaky-api.pvd-api.dev</code>
          . <br />
          You can call the API using the <code>GET</code> method.
          <br />
          Example successful response (status code <code>200</code>):
          <Highlight
            code={JSON.stringify({ color: 'Red' }, null, 2)}
            lang="js"
          />
          Example error response (status code <code>400</code> or{' '}
          <code>500</code>):
          <Highlight
            code={JSON.stringify({ error: 'Oops error' }, null, 2)}
            lang="js"
          />
        </SubSection>
        <SubSection title="Main View">
          <IsolatedHtml
            height={300}
            addToggle
            css={stylesCss}
            html={pageHTML}
          />
          <HandlesTable
            entries={[
              {
                handle: 'fetch-btn',
                type: 'button',
                desc: <>Fetches the response from the Flaky API.</>,
              },
              {
                handle: 'result',
                type: 'text',
                desc: <>Displays the result based on the below algorithm.</>,
              },
            ]}
          />
        </SubSection>
        <SubSection title="Fetching algorithm">
          <ol>
            <li>
              By default, display "No Result" in <code>result</code>.
            </li>
            <li>
              Clicking the <code>fetch-btn</code>, should disable the button
              (add <code>disabled</code> attribute), and call the API.
            </li>
            <li>
              If the response status is <code>200</code>, display the color in{' '}
              <code>result</code>, and enable the button.
            </li>
            <li>
              If the response status is <code>500</code>, display the "Error"
              text in <code>result</code> (don't display text from the response
              body, always display static "Error" text).
            </li>
            <li>
              If the response status is <code>400</code>, retry the request.
            </li>
            <li>
              If the request is retried, and the response is <code>200</code>,
              display the color, and the count of total requests.
              <br />
              For example:
              <br />
              Display <code>Blue (2)</code> if the 1st request was{' '}
              <code>400</code>, and 2nd was <code>200</code>. <br />
              Display <code>Blue (3)</code> if the 1st request was{' '}
              <code>400</code>, 2nd was <code>400</code>, and 3rd was{' '}
              <code>200</code>. <br />
              Where <code>Blue</code> is the color from the response body.
            </li>
          </ol>
        </SubSection>
      </Section>

      <Section title="Demo">
        <video
          style={{ width: '100%', height: 400, outline: 'none' }}
          src={
            'https://practice.dev/assets/009-demo.b62926e7c48c0f44b2b6c722ef42591f.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
