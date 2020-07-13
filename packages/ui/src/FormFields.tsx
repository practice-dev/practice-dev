import * as React from 'react';
import styled, { css } from 'styled-components';

interface ValidationRule {
  rule: string;
  error: string;
  condition: React.ReactChild;
  async?: boolean;
}

export interface FormEntry {
  field: string;
  type: 'text' | 'select' | 'password';
  desc: React.ReactChild;
  options?: React.ReactChild;
  defaultValue?: React.ReactChild;
  rules: ValidationRule[];
}

interface FormFieldsProps {
  className?: string;
  entries: FormEntry[];
}

const Tr = styled.tr<{ bottomSep?: boolean }>`
  ${(props) =>
    props.bottomSep &&
    css`
      && {
        th,
        td {
          border-bottom-width: 4px;
        }
      }
    `}
`;

const Th = styled.th<{ center?: boolean }>`
  ${(props) =>
    props.center &&
    css`
      text-align: center;
    `}
`;
const Td = styled.td<{ center?: boolean }>`
  ${(props) =>
    props.center &&
    css`
      text-align: center;
    `}
`;

const TitleCell = styled.td`
  text-align: center;
  font-style: italic;
  &&& {
    padding: 20px;
  }
`;

const Scroll = styled.div`
  overflow: auto;
`;
const _FormFields = (props: FormFieldsProps) => {
  const { className, entries } = props;
  return (
    <Scroll>
      <table className={className}>
        <tbody>
          <tr>
            <TitleCell colSpan={4}>Form description</TitleCell>
          </tr>
          {entries.map((entry, i) => (
            <React.Fragment key={i}>
              <tr>
                <th>Field</th>
                <td colSpan={3}>{entry.field}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td colSpan={3}>{entry.type}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td colSpan={3}>{entry.desc}</td>
              </tr>
              {entry.options && (
                <tr>
                  <th>Options</th>
                  <td colSpan={3}>{entry.options}</td>
                </tr>
              )}
              {entry.defaultValue && (
                <tr>
                  <th>Default value</th>
                  <td colSpan={3}>{entry.defaultValue}</td>
                </tr>
              )}
              <tr>
                <Th center colSpan={4}>
                  Validation Rules
                </Th>
              </tr>
              <tr>
                <th>Rule</th>
                <th>Error Message</th>
                <th>Condition</th>
                <th>Async</th>
              </tr>
              {entry.rules.map((rule, j) => (
                <Tr
                  key={j}
                  bottomSep={
                    j + 1 === entry.rules.length && i + 1 !== entries.length
                  }
                >
                  <td>{rule.rule}</td>
                  <td>{rule.error}</td>
                  <td>{rule.condition}</td>
                  <Td center>{rule.async ? 'Yes' : 'No'}</Td>
                </Tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
};

export const FormFields = styled(_FormFields)`
  width: 100%;
  min-width: 500px;
`;
