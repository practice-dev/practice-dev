import {
  HandlesTable,
  InjectingSection,
  IsolatedHtml,
  Section,
  SubSection,
} from '@pvd/ui';
import stylesCss from './assets/styles.css';
import pageHTML from './assets/page.html';
import React from 'react';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Scattered API is an API for retrieving products and product tags.
        Unfortunately, it's required to make multiple requests to get all
        relationships.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can fetch product and tag names from the API.</li>
          <li>As a user, I can cancel the API request.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <SubSection title="Scattered API">
          The Scattered API is located at{' '}
          <code>https://scattered-api.pvd-api.dev</code>.
          <br />
          Check the "API Spec" tab for full api specification.
        </SubSection>
        <SubSection title="Main View">
          <IsolatedHtml
            height={220}
            addToggle
            css={stylesCss}
            html={pageHTML}
          />
          <HandlesTable
            entries={[
              {
                handle: 'fetch-btn',
                type: 'button',
                desc: <>Fetches the response from the Scattered API.</>,
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
              Clicking <code>fetch-btn</code> should change the button text to
              "Cancel", and perform the following API calls:
              <ul>
                <li>
                  Call <code>GET /products</code>.
                </li>
                <li>
                  Get the first element from the response and call{' '}
                  <code>GET /products/{'{id}'}</code>.
                  <br />
                  You can assume there will always be at least 1 element.
                </li>
                <li>
                  For every element in <code>product.tags</code>, call{' '}
                  <code>GET /products-tags/{'{id}'}</code>, and then using{' '}
                  <code>productTag.id</code> call{' '}
                  <code>GET /tags/{'{id}'}</code>.
                  <br />
                  NOTE:
                  <br />
                  You should fetch all tags in parallel.
                </li>
                <li>The result should be a list of tags.</li>
              </ul>
            </li>
            <li>
              Display "{'<product-name>: <tag1>, <tag2>, ..., <tagN>'}" in{' '}
              <code>result</code>.
              <br />
              For example: "car: popular, red, expensive" <br />
              If there are no tags display "-". <br />
              For example: "car: -" <br />
            </li>
            <li>
              The order of tags should match the order from{' '}
              <code>GET /products/{'{id}'}</code>.
            </li>
            <li>
              If <code>fetch-btn</code> text is "Cancel", clicking on it should
              cancel any HTTP requests, and display "Canceled" in{' '}
              <code>result</code>. If canceled, you should not make any more API
              calls.
            </li>
            <li>
              If the fetch was successful or canceled, set{' '}
              <code>fetch-btn</code> text back to "Fetch".
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
