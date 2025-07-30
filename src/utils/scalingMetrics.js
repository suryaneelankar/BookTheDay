import { Dimensions } from 'react-native';
import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();

export const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;

const verticalScale = (size) => (height / guidelineBaseHeight) * size;

const moderateScale = (size, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

const getFontSize = (size) => size / fontScale;
export { horizontalScale, verticalScale, moderateScale, getFontSize };