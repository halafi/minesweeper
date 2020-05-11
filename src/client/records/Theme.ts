import baseStyled, { ThemedStyledInterface } from 'styled-components';

export const SIZES = {
  DESKTOP: 1220,
  BIG_TABLET: 1112,
  TABLET: 768,
  BIG_MOBILE: 600, // or 568
  MIDDLE_MOBILE: 414,
  SMALL_MOBILE: 360,
};

export const themeDefault = {
  colors: {
    text: '#000000',
    primary: '#000000',
    secondary: '#ffffff',
  },
};

export type Theme = typeof themeDefault;

export const styled = baseStyled as ThemedStyledInterface<Theme>;
