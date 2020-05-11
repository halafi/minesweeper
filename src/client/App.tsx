import * as React from 'react';
import { render } from 'react-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Normalize } from 'styled-normalize';
import { themeDefault } from './records/Theme';
import type { Theme } from './records/Theme';
import Root from './scenes/Root';

const container = document.getElementById('container');

type GlobalStyleProps = {
  theme: Theme;
};

const GlobalStyle = createGlobalStyle`
  body {
    color: ${({ theme }: GlobalStyleProps) => theme.colors.text};
    font-family: 'Baloo 2', serif;
  }
`;

if (container) {
  render(
    <React.StrictMode>
      <ThemeProvider theme={themeDefault}>
        <>
          <Normalize />
          <GlobalStyle />
          <Root />
        </>
      </ThemeProvider>
    </React.StrictMode>,
    container,
  );
}
