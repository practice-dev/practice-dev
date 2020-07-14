import React from 'react';
import styled from 'styled-components';
import { BaseTheme } from './BaseTheme';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Wrapper = styled.div`
  margin-bottom: 10px;
  margin-top: 40px;
  &:first-child {
    margin-top: 0;
  }
  code {
    padding: 3px 7px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.05);
    font-weight: 600;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  }

  li + li {
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    margin: 10px 0;
    th,
    td {
      padding: 10px 15px;
      border: 1px solid ${BaseTheme.bgLightGray};
    }
  }
`;

const Title = styled.h2`
  margin: 0 0 10px;
  font-weight: 600;
  font-size: 20px;
  color: ${BaseTheme.textDark};
  padding-bottom: 5px;
  border-bottom: 1px solid ${BaseTheme.bgLightGray};
`;

export function Section(props: SectionProps) {
  const { title, children } = props;
  return (
    <Wrapper>
      <Title>{title}</Title>
      {children}
    </Wrapper>
  );
}
