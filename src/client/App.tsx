import * as React from 'react';
import { render } from 'react-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Normalize } from 'styled-normalize';
import { themeDefault } from './records/Theme';
import type { Theme } from './records/Theme';
import Root from './scenes/Root';

if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
  navigator.serviceWorker.register('/sw.js');
}

const container = document.getElementById('container');

type GlobalStyleProps = {
  theme: Theme;
};

// FIXME: tmp hide overflow coz right image can stretch out of grid
const GlobalStyle = createGlobalStyle`
  body {
    color: ${({ theme }: GlobalStyleProps) => theme.colors.text};
    background-color: black;
    font-family: 'Work Sans', sans-serif;
    overflow-x: hiden;
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
