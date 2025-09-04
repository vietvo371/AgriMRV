import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const responsive = {
  wp,
  hp,
};

// Font sizes
export const FONT_SIZE = {
  xs: wp('3%'),
  sm: wp('3.5%'),
  md: wp('4%'),
  lg: wp('4.5%'),
  xl: wp('5%'),
  xxl: wp('6%'),
};

// Spacing
export const SPACING = {
  xs: wp('2%'),
  sm: wp('3%'),
  md: wp('4%'),
  lg: wp('5%'),
  xl: wp('6%'),
  xxl: wp('8%'),
};

// Border radius
export const BORDER_RADIUS = {
  xs: wp('1%'),
  sm: wp('2%'),
  md: wp('3%'),
  lg: wp('4%'),
  xl: wp('5%'),
}; 