/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width < 375 ? 0.85 : width < 414 ? 0.95 : 1;

export const Typography = {
  // Base sizes that scale with screen width
  xs: 10 * scale,
  sm: 12 * scale,
  base: 14 * scale,
  lg: 16 * scale,
  xl: 18 * scale,
  '2xl': 20 * scale,
  '3xl': 24 * scale,
  '4xl': 28 * scale,
  '5xl': 32 * scale,
  '6xl': 48 * scale,
  giant: 64 * scale,
};

const tintColorLight = '#8B5CF6';
const tintColorDark = '#E9D5FF';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#7B6F91',
    background: '#FFFFFF',
    cardBackground: '#F5F0FF',
    tint: tintColorLight,
    icon: '#7B6F91',
    tabIconDefault: '#7B6F91',
    tabIconSelected: tintColorLight,
    success: '#6EE7B7',
    warning: '#FCD34D',
  },
  dark: {
    text: '#F5F0FF',
    textSecondary: '#C4B5FD',
    background: '#1A1A2E',
    cardBackground: '#2D2D44',
    tint: tintColorDark,
    icon: '#C4B5FD',
    tabIconDefault: '#C4B5FD',
    tabIconSelected: tintColorDark,
    success: '#34D399',
    warning: '#FBBF24',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
