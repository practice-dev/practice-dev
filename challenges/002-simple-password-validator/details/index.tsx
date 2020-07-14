import { Section } from '@pvd/ui';
import React from 'react';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Welcome to practice.dev! <br />
        This is a simple warmup challenge where you must implement a simple REST
        API endpoint.
        <br />
        In every backend challenge, we always give you the API specification.
        Your task is to implement it.
        <br />
        After you solve the challenge, you can upload a solution and share it
        with other developers.
        <br />
        Good luck!
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can validate the password.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        Check the swagger specification in the "API Spec" tab for all
        requirements.
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 440, outline: 'none' }}
          src={
            'https://practice.dev/assets/002-demo.4047426c7935d7ad5048c93adcd0d44e.mp4'
          }
          loop
          controls
        ></video>
      </Section>
    </div>
  );
}
