import React from 'react';
import styled from 'styled-components';
import { BaseTheme } from './BaseTheme';

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Title = styled.h3`
  margin: 0;
  padding: 3px 0;
  font-weight: 600;
  font-size: 16px;
  color: ${BaseTheme.textDark};
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
`;

const _SubSection = (props: SubSectionProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      {children}
    </div>
  );
};

export const SubSection = styled(_SubSection)`
  display: block;
  margin-top: 15px;
`;
