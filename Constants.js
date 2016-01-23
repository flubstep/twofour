/**
 * @providesModule Constants
 */

'use strict';

let React = require('react-native');
let {
  Dimensions
} = React;

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const baseFont = 'Avenir';
const cardMargin = 24;

const Constants = {

  Colors: {
    darkBackground: '#061539',
    midBackground: '#4F628E',
    lightBackground: '#7887AB',
    green: '#407F7F',
    white: '#FEFEFE',
    dark: '#333333',
    red: 'red'
  },

  Dimensions: {
    baseMargin: cardMargin,
    cardSide: (windowWidth - (cardMargin*3)) / 2,
    windowHeight: windowHeight,
    windowWidth: windowWidth
  },

  BaseStyles: {
    smallText: {
      fontFamily: baseFont,
      fontSize: 12
    },
    mediumText: {
      fontFamily: baseFont,
      fontSize: 18
    },
    largeText: {
      fontFamily: baseFont,
      fontSize: 24,
      fontWeight: '400'
    },
    hugeText: {
      fontFamily: baseFont,
      fontSize: 36,
      fontWeight: '400'
    },
    centerContent: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    transparentBackground: {
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }
  }

};

module.exports = Constants;