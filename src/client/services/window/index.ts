import { SIZES } from '../../records/Theme';

export type WindowType = 'desktop' | 'tablet' | 'mobile';

export function getWidth(): number | null {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export function getWindowType(): WindowType {
  const width = getWidth();
  if (width && width >= SIZES.DESKTOP) {
    return 'desktop';
  }
  if (width && width >= SIZES.TABLET) {
    return 'tablet';
  }
  return 'mobile';
}
