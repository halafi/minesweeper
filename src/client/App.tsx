import * as React from 'react';
import { render } from 'react-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Normalize } from 'styled-normalize';
import { BrowserRouter } from 'react-router-dom';
import { themeDefault } from './records/Theme';
import type { Theme } from './records/Theme';
import Routes from './Routes';
// @ts-ignore
import PressStartBold from '../../assets/prstartk.ttf';

if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
  navigator.serviceWorker.register('/sw.js');
}

const container = document.getElementById('container');

type GlobalStyleProps = {
  theme: Theme;
};

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: PressStartBold;
    src: url(${PressStartBold});
    font-weight: 700;
  }
  body {
    color: ${({ theme }: GlobalStyleProps) => theme.colors.text};
    background-color: black;
    font-family: sans-serif;
  }
`;

if (container) {
  render(
    <React.StrictMode>
      <ThemeProvider theme={themeDefault}>
        <BrowserRouter>
          <Normalize />
          <GlobalStyle />
          <Routes />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>,
    container,
  );
}
