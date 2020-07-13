import {
  Section,
  IsolatedHtml,
  InjectingSection,
  Highlight,
  SubSection,
  HandlesTable,
  AdditionalReq,
} from '@pvd/ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';
import { inputData } from './assets/input-data';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        You are working in the e-commerce company, and the UX designer requested
        a new filter functionality, that will be more friendly for the users. In
        this task, you have to implement only the filter mechanism without
        displaying the list of items.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can select filter options.</li>
          <li>
            As a user, I can see the count of the potential results for the
            given filter option before selecting that option.
          </li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <SubSection title="Sample data">
          Hard-code the following JSON data in your application, and use it as
          an input.
          <br />
          Data represents example RAM devices.
          <Highlight
            maxHeight={200}
            code={JSON.stringify(inputData, null, 2)}
            lang="js"
          />
        </SubSection>
        <SubSection title="Main UI">
          <IsolatedHtml
            height={500}
            addToggle
            css={exampleCss}
            html={exampleHTML}
          />
        </SubSection>
        <HandlesTable
          entries={[
            {
              handle: '*-group',
              type: 'container',
              desc: (
                <>
                  Represents a filter group. <br />
                  Each group represents a property from the JSON data:
                  <br />
                  <code>vendor</code>,<code>capacity</code>,<code>speed</code>,
                  <code>color</code>,<code>cycleLatency</code>.
                </>
              ),
            },
            {
              handle: '*-item',
              type: 'container',
              desc: (
                <>
                  Represents a filter element. <br />
                  Each element represents a value from the JSON data for the
                  given group. <br />
                  Properties <code>capacity</code> and <code>speed</code> are
                  numeric properties but are displayed with an additional unit
                  (GB, MHz).
                </>
              ),
            },
          ]}
        />
        <AdditionalReq
          items={[
            <>
              The number in parentheses represents the count of items that match
              that option if this option is selected.
              <br />
              For example:
              <br />
              "BESTRAM (64)" means that there are 64 items that have{' '}
              <code>vendor</code> property equal to <code>BESTRAM</code>.
            </>,
            <>
              Selecting multiple options within the same section should act as{' '}
              <code>OR</code>. <br />
              Selecting multiple options between sections should act as{' '}
              <code>AND</code>.
              <br />
              For example:
              <br />
              Select from Vendor: BESTRAM, Rocket
              <br />
              Select from Capacity: 4 GB, 8 GB
              <br />
              is equivalent to: <br />
              <code>
                (vendor = BESTRAM OR vendor = Rocket) AND (capacity = 4 OR
                capacity = 8)
              </code>
            </>,
            <>
              After selecting or deselecting the option, the counts from other
              sections should update immediately.
              <br />
              NOTE: the other options from the same section should always remain
              the same.
            </>,
            <>
              Disable the option if the count is <code>0</code>. Add{' '}
              <code>disable</code> attribute to{' '}
              <code>{'<input type="checkbox"/>'}</code>
              <br />
              Don't disable the checkbox if it's already selected.
            </>,
            <>
              Options should be displayed in descending order based on the count
              when no options are selected. <br />
              Don't re-sort options when selected. <br />
              The provided HTML shows the correct order.
            </>,
          ]}
        />
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 600, outline: 'none' }}
          src={
            'https://practice.dev/assets/demo.e2b221b8add80d529df9a50c993a7d0e.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
