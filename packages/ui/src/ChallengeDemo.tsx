import React from 'react';
import styled from 'styled-components';

const Outer = styled.div`
  padding: 30px;
  width: 100%;
`;

const Wrapper = styled.div`
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid #d4d6db;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 40px 50px;
  position: relative;
  margin: 0 auto;
  max-width: 810px;
`;

interface ChallengeDemoProps {
  children: React.ReactNode;
}

export function ChallengeDemo(props: ChallengeDemoProps) {
  const { children } = props;
  return (
    <>
      <Outer>
        <Wrapper>{children}</Wrapper>
      </Outer>
    </>
  );
}
