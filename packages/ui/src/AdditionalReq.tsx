import * as React from 'react';
import styled from 'styled-components';

interface AdditionalReqProps {
  className?: string;
  items: React.ReactChild[];
}

const _AdditionalReq = (props: AdditionalReqProps) => {
  const { className, items } = props;
  return (
    <div className={className}>
      <strong>Additional requirements/notes:</strong>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export const AdditionalReq = styled(_AdditionalReq)`
  display: block;
  margin-top: 15px;
  ul {
    margin: 5px 0 0;
  }
`;
