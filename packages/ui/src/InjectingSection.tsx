import React from 'react';
import styled from 'styled-components';
import { Section } from './Section';
import { Highlight } from './Highlight';

const toggleLayersBtnSource = `
<script src="https://practice.dev/assets/toggle-layer.js"></script>`.trim();

const ToggleLayersBtn = styled.button`
  display: inline-block;
  font-weight: 400;
  border: 1px solid transparent;
  padding: 3px 6px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 4px;
  background: #e83e8c;
  color: white;

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;

export function InjectingSection() {
  return (
    <Section title='Injecting "Toggle layers" button'>
      You can inject <ToggleLayersBtn>Toggle layers</ToggleLayersBtn> button by
      adding below script to your main HTML page in the <code>{'<head>'}</code>{' '}
      section. Injecting this button is not required, but it can help you
      debugging data-test attributes on HTML elements.
      <Highlight lang="html" code={toggleLayersBtnSource} />
    </Section>
  );
}
