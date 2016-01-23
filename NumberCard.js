/**
 * @providesModule NumberCard
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder
} = React;

let {Dimensions, BaseStyles, Colors} = require('Constants');

class NumberCard extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      shadowProperties: styles.cardInactive,
      scale: new Animated.Value(1.0),
      positionOffset: new Animated.ValueXY(0, 0)
    };
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => this.onPanResponderGrant(evt, gestureState),
      onPanResponderMove: (evt, gestureState) => this.onPanResponderMove(evt, gestureState),
      onPanResponderRelease: (evt, gestureState) => this.onPanResponderRelease(evt, gestureState)
    });
  }

  onPanResponderGrant(evt, gestureState) {
    this.setState({
      shadowProperties: styles.cardActive
    });
    Animated.spring(this.state.scale, {
      toValue: 0.95,
      tension: 150,
      friction: 5
    }).start();
  }

  onPanResponderMove(evt, gestureState) {
    let {dx, dy} = gestureState;
    this.state.positionOffset.setValue({
      x: dx,
      y: dy
    });
  }

  onPanResponderRelease() {
    this.setState({
      shadowProperties: styles.cardInactive
    });
    Animated.parallel([
      Animated.spring(this.state.positionOffset, {
        toValue: {x: 0, y: 0}
      }),
      Animated.spring(this.state.scale, {
        toValue: 1.0,
        tension: 150,
        friction: 5
      })
    ]).start();
  }

  render() {
    return (
      <Animated.View
        {...this.responder.panHandlers}
        style={[
          BaseStyles.transparentBackground,
          {
            transform: [
              {scale: this.state.scale},
              ...this.state.positionOffset.getTranslateTransform()
            ]
          }
        ]}
        >
        <View style={[
            BaseStyles.centerContent,
            styles.card,
            this.state.shadowProperties
          ]}
          >
          <Text style={BaseStyles.hugeText}>
            {this.props.number}
          </Text>
        </View>
      </Animated.View>
    );
  }

}

let styles = StyleSheet.create({

  card: {
    height: Dimensions.cardSide,
    width: Dimensions.cardSide,
    backgroundColor: 'white',
    borderRadius: 8
  },
  cardActive: {
    shadowOffset: {left: 0, bottom: 0},
    shadowColor: 'green',
    shadowOpacity: 0.9,
    shadowRadius: 8
  },
  cardInactive: {
    shadowOffset: {left: 0, bottom: 0},
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 4
  }

});

module.exports = NumberCard;