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
const cardSide = (windowWidth - (cardMargin*3)) / 2;
const miniCardMargin = 4;
const miniCardSide = (cardSide - (miniCardMargin*3)) / 2;


const Colors = {
  darkBackground: '#061539',
  midBackground: '#4F628E',
  lightBackground: '#7887AB',
  green: '#407F7F',
  white: '#FEFEFE',
  dark: '#333333',
  red: 'red',
  transparent: 'rgba(0,0,0,0.0)'
};


const AppDimensions = {
  baseMargin: cardMargin,
  cardSide: cardSide,
  miniCardSide: miniCardSide,
  windowHeight: windowHeight,
  windowWidth: windowWidth
};


const BaseStyles = {
  smallText: {
    fontFamily: baseFont,
    fontSize: 12,
    color: Colors.white
  },
  mediumText: {
    fontFamily: baseFont,
    fontSize: 18,
    color: Colors.white
  },
  largeText: {
    fontFamily: baseFont,
    fontSize: 24,
    fontWeight: '400',
    color: Colors.white
  },
  hugeText: {
    fontFamily: baseFont,
    fontSize: 48,
    fontWeight: '400',
    color: Colors.white
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  transparentBackground: {
    backgroundColor: Colors.transparent
  }
};


module.exports = {
  Colors,
  BaseStyles,
  Dimensions: AppDimensions
};