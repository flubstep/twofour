/**
 * This is the entry point for your experience that you will run on Exponent.
 */
'use strict';

let React = require('react-native');
let {
  AppRegistry,
  StatusBarIOS
} = React;

if (StatusBarIOS) {
  StatusBarIOS.setHidden(true);
}

let TwoFourScreen = require('TwoFourScreen');

AppRegistry.registerComponent('main', () => TwoFourScreen);
