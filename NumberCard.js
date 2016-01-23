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

let Actions = require('Actions');
let {Dimensions, BaseStyles, Colors} = require('Constants');


class NumberCard extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
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

  animateScale(scale) {
    return Animated.spring(this.state.scale, {
      toValue: scale,
      tension: 150,
      friction: 10
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.isHover && !prevProps.isHover) {
      this.animateScale(1.1).start();
    } else if (!this.props.isHover && prevProps.isHover) {
      this.animateScale(1.0).start();
    }
  }

  onLayout() {
    let id = this.props.id;
    this.refs.card.measure((fx, fy, width, height, posX, posY) => {
      Actions.registerCardPosition({id, posX, posY, height, width});
    });
  }

  onPanResponderGrant(evt, gestureState) {
    this.animateScale(0.9).start();
    this.props.onPress(evt);
  }

  onPanResponderMove(evt, gestureState) {
    let {dx, dy, moveX, moveY} = gestureState;
    this.state.positionOffset.setValue({
      x: dx,
      y: dy
    });
    this.props.onMove({moveX, moveY});
  }

  onPanResponderRelease(evt, gestureState) {
    Animated.parallel([
      Animated.spring(this.state.positionOffset, {
        toValue: {x: 0, y: 0}
      }),
      this.animateScale(1.0)
    ]).start();
    this.props.onRelease(evt);
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
        onLayout={(evt) => this.onLayout(evt)}
        >
        <View style={[
            BaseStyles.centerContent,
            styles.card,
            this.props.isHover ? styles.hover : null,
            this.props.isDragging ? styles.dragging : null
          ]}
          ref="card"
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
    backgroundColor: Colors.midBackground,
    borderRadius: 8,
    shadowOffset: {left: 0, bottom: 0},
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  dragging: {
    shadowRadius: 2,
  },
  hover: {
    shadowRadius: 8
  }
});

module.exports = NumberCard;