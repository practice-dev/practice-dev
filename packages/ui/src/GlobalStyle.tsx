import { createGlobalStyle } from 'styled-components';
import { BaseTheme } from './BaseTheme';

export const GlobalStyle = createGlobalStyle`
*,
*::before,
*::after
{
    box-sizing: border-box;
}

html
{
    line-height: 1.15;

    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(31, 45, 61, 0);
    height: 100% !important;
}
body
{
    line-height: 1.7;
    margin: 0;
    text-align: left;
    color: ${BaseTheme.text};
    background-color: ${BaseTheme.bgLightGray};
    height: 100%;
    display: flex;
    flex-direction: column;
}

body, input, textarea {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;
    font-size: 14px;
    font-weight: 400;
}

a {
  color: ${BaseTheme.blue};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

#root {
    height: 100% ;
    display: flex;
    flex-direction: column;
}

`;
