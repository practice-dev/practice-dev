import { HandlesTable, InjectingSection, IsolatedHtml, Section } from '@pvd/ui';
import React from 'react';
import stylesCss from './assets/styles.css';
import pageHTML from './assets/page.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Create a very basic routing between static pages without any API
        integration.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can navigate between pages.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <IsolatedHtml height={220} addToggle css={stylesCss} html={pageHTML} />
        <HandlesTable
          entries={[
            {
              handle: 'link-a',
              type: 'link',
              desc: (
                <>
                  Navigates to <code>/page-a</code>.
                </>
              ),
            },
            {
              handle: 'link-b',
              type: 'link',
              desc: (
                <>
                  Navigates to <code>/page-b</code>.
                </>
              ),
            },
            {
              handle: 'link-c',
              type: 'link',
              desc: (
                <>
                  Navigates to <code>/page-c</code>.
                </>
              ),
            },
            {
              handle: 'text',
              type: 'text',
              desc: (
                <>
                  Displays route text. <br />
                  Display <code>A</code> for routes <code>/</code> and{' '}
                  <code>/page-a</code>. <br />
                  Display <code>B</code> for route <code>/page-b</code>.<br />
                  Display <code>C</code> for route <code>/page-c</code>.<br />
                </>
              ),
            },
          ]}
        />
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 400, outline: 'none' }}
          src={
            'https://practice.dev/assets/011-demo.8a492bed61d455d3f266937bf8c77305.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
