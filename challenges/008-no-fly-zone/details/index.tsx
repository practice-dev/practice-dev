import { Highlight, Section, SubSection } from '@pvd/ui';
import React from 'react';
import styled from 'styled-components';

const FullWidthImg = styled.div`
  img {
    width: 100%;
  }
`;

export function Details() {
  return (
    <div>
      <Section title="Overview">
        You are working for a new startup that delivers packages using drones.
        Unfortunately, there are restricted areas in the air that are not
        permitted to fly. Your task is to create an API, that will detect an
        intersection between any no-fly zone, and the drone position.
      </Section>

      <Section title="Use Cases">
        <ul>
          <li>As a user, I add a new no-fly zone.</li>
          <li>As a user, I check if a point intersects with no-fly zones.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        Check the swagger specification in the "API Spec" tab for all
        requirements.
      </Section>
      <Section title="Example coordinates">
        <SubSection title="Example 1">
          <FullWidthImg>
            <img src="https://practice.dev/assets/008-map-1.2ed1740e237ee36432ae898718a71ffe.png" />
          </FullWidthImg>
          The black polygon has the following coordinates:
          <Highlight
            lang="js"
            code={JSON.stringify(
              [
                { lat: 7.052439701946759, lng: 87.36683061553796 },
                { lat: -41.21539222952027, lng: 87.36683061553796 },
                { lat: -40.55090799255064, lng: 155.74573686553796 },
                { lat: 7.401208803829017, lng: 155.74573686553796 },
              ],
              null,
              2
            )}
          />
          The point outside polygon has the following coordinates:
          <Highlight
            lang="js"
            code={JSON.stringify(
              { lat: -16.767139914291164, lng: 76.46839311553796 },
              null,
              2
            )}
          />
          The point inside polygon has the following coordinates:
          <Highlight
            lang="js"
            code={JSON.stringify(
              { lat: -16.43022789888758, lng: 118.30433061553795 },
              null,
              2
            )}
          />
        </SubSection>
        <SubSection title="Example 2">
          <FullWidthImg>
            <img src="https://practice.dev/assets/008-map-2.fad1c278748981eb16cd76c67672f6d4.png" />
          </FullWidthImg>
          The black polygon has the following coordinates:
          <Highlight
            lang="js"
            code={JSON.stringify(
              [
                { lat: -22.994388272771587, lng: 118.95373423575634 },
                { lat: -23.075271119549754, lng: 126.68810923575634 },
                { lat: -15.364274581898703, lng: 129.06115611075634 },
                { lat: -22.832477264545666, lng: 130.37951548575634 },
                { lat: -23.236890838215388, lng: 139.43224986075634 },
                { lat: -26.3481529941868, lng: 130.73107798575634 },
                { lat: -31.72404301853507, lng: 134.77404673575634 },
                { lat: -28.68633420707484, lng: 128.97326548575634 },
                { lat: -31.424525717806457, lng: 124.75451548575634 },
                { lat: -26.50556559638007, lng: 127.21545298575634 },
              ],
              null,
              2
            )}
          />
        </SubSection>
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 340, outline: 'none' }}
          src={
            'https://practice.dev/assets/008-demo.553134a51f9efb47cbae4e97f847bffe.mp4'
          }
          loop
          controls
        ></video>
      </Section>
    </div>
  );
}
