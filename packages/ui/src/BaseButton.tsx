import * as React from 'react';
import styled, { css } from 'styled-components';
import { BaseTheme } from './BaseTheme';
import { Spinner } from './Spinner';

interface BaseButtonProps {
  children?: React.ReactNode;
  className?: string;
  block?: boolean;
  loading?: boolean;
  type: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  testId?: string;
}

const Icon = styled.span`
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  svg {
    vertical-align: middle;
    border-style: none;
  }
`;

const _BaseButton = (props: BaseButtonProps, ref: any) => {
  const {
    className,
    onClick,
    children,
    icon,
    htmlType,
    loading,
    disabled,
    testId,
  } = props;
  return (
    <button
      data-test={testId}
      disabled={loading || disabled}
      onClick={onClick}
      className={className}
      type={htmlType || 'button'}
      ref={ref}
    >
      {loading && <Spinner />}
      {icon && <Icon>{icon}</Icon>}
      <span>{children}</span>
    </button>
  );
};

export const BaseButton = styled(React.forwardRef(_BaseButton))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 25px;
  height: 40px;
  user-select: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  text-align: center;
  vertical-align: middle;
  color: #8492a6;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: transparent;
  position: relative;
  white-space: nowrap;
  // transition: all 0.2s ease;
  width: ${(props) => (props.block ? '100%' : null)};
  font: inherit;
  outline: none;
  && {
    text-decoration: none;
  }

  ${Spinner} {
    margin-right: 10px;
  }

  &:not(:disabled),
  &:not(.disabled) {
    cursor: pointer;
  }

  &.disabled,
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  ${(props) => {
    switch (props.type) {
      case 'primary':
        return css`
          color: #fff;
          background: ${BaseTheme.primaryGradient};
          &:hover {
            background: ${BaseTheme.primaryGradientHover};
          }
          &:focus {
            background: ${BaseTheme.primaryGradientActive};
            box-shadow: 0 0 0 3px rgb(35, 122, 210, 0.5);
          }
          &.disabled,
          &:disabled {
            background: ${BaseTheme.primaryGradient};
            box-shadow: none;
          }
        `;
      case 'secondary':
        return css`
          color: ${BaseTheme.textDark};
          background: white;
          border-color: ${BaseTheme.border};
          &:hover {
            background: ${BaseTheme.bgLightGray};
          }
          &:focus {
            background: ${BaseTheme.bgLightGray};
            box-shadow: 0 0 0 3px rgba(216, 217, 219, 0.5);
          }
        `;
      case 'danger':
        return css`
          color: white;
          background: ${BaseTheme.dangerGradient};
          &:hover {
            background: ${BaseTheme.dangerGradientHover};
          }
          &:focus {
            background: ${BaseTheme.dangerGradientActive};
            box-shadow: 0 0 0 3px rgb(210, 35, 35, 0.5);
          }
          &.disabled,
          &:disabled {
            background: ${BaseTheme.dangerGradient};
            box-shadow: none;
          }
        `;
    }
    return null;
  }}
`;
