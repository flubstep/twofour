/**
 * @providesModule TwoFourScreen
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View
} = React;

let ReactMixin = require('react-mixin');
let TimerMixin = require('react-timer-mixin');

let {Dimensions, BaseStyles, Colors} = require('Constants');
let Actions = require('Actions');

let NumberCard = require('NumberCard');


class TwoFourScreen extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      iterations: 0
    };
  }

  componentDidMount() {
    Actions.subscribe((gameState) => {
      this.setState(gameState);
    });
    this.setInterval(this.onTick, 1000);
  }

  onTick() {
    this.setState({
      iterations: this.state.iterations + 1
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.row, BaseStyles.transparentBackground]}>
          <NumberCard number={4} />
          <NumberCard number={5} />
        </View>
        <View style={[styles.row, BaseStyles.transparentBackground]}>
          <NumberCard number={6} />
          <NumberCard number={7} />
        </View>
      </View>
    );
  }

}

let styles = StyleSheet.create({

  container: {
    height: Dimensions.windowHeight,
    width: Dimensions.windowWidth,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightBackground
  },

  row: {
    width: Dimensions.windowWidth,
    height: Dimensions.cardHeight,
    marginBottom: Dimensions.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }

});

module.exports = ReactMixin.decorate(TimerMixin)(TwoFourScreen);