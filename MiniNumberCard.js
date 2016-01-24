/**
 * @providesModule MiniNumberCard
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


function value(cardState) {
  if (!cardState) {
    return 0;
  } else {
    return cardState.number + value(cardState.combinedFrom);
  }
}


class MiniNumberCard extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: new Animated.Value(1.0),
      opacity: new Animated.Value(this.props.combinedTo ? 0.1 : 1.0),
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

  isVisible() {
    return !this.props.combinedTo;
  }

  value() {
    return this.props.number.toString();
  }

  panHandlers() {
    if (!this.isVisible()) {
      return {};
    } else {
      return this.responder.panHandlers;
    };
  }

  animateScale(scale) {
    return Animated.spring(this.state.scale, {
      toValue: scale,
      tension: 150,
      friction: 10
    });
  }

  animatePosition(toPosition) {
    if (toPosition) {
      let {posX, posY} = toPosition;
      return Animated.spring(this.state.positionOffset, {
        toValue: {
          x: posX - this.props.posX,
          y: posY - this.props.posY
        }
      });
    } else {
      return Animated.spring(this.state.positionOffset, {
        toValue: {x: 0, y: 0}
      });
    }
  }

  animateOpacity(opacity) {
    return Animated.timing(this.state.opacity, {
      toValue: opacity,
      duration: 200
    });
  }

  componentDidUpdate(prevProps) {
    // no hover -> hover
    if (this.props.isHover && !prevProps.isHover) {
      this.animateScale(1.1).start();
    }
    // hover -> no hover
    else if (!this.props.isHover && prevProps.isHover) {
      this.animateScale(1.0).start();
    }
    // start drag
    else if (this.props.isDragging && !prevProps.isDragging) {
      // no-op
    }
    // drag -> release, no hover
    else if (!this.props.isDragging && prevProps.isDragging && !this.props.combinedTo) {
      Animated.parallel([
        this.animatePosition(0)
      ]).start();
    }
    // drag -> release, combine
    else if (!this.props.isDragging && prevProps.isDragging && this.props.combinedTo) {
      Animated.sequence([
        Animated.parallel([
          this.animateScale(1.0),
          this.animateOpacity(0.0),
          this.animatePosition(this.props.combinedTo)
        ]),
        this.animatePosition(0) // TODO: actually move the object backwards in z-index
      ]).start()
    }
  }

  onLayout() {
    let id = this.props.id;
    this.refs.card.measure((fx, fy, width, height, posX, posY) => {
      Actions.registerCardPosition({id, posX, posY, height, width});
    });
  }

  onPanResponderGrant(evt, gestureState) {
    if (!this.isVisible()) {
      return;
    }
    //this.props.onPress(evt);
  }

  onPanResponderMove(evt, gestureState) {
    if (!this.isVisible()) {
      return;
    }
    let {dx, dy, moveX, moveY} = gestureState;
    this.state.positionOffset.setValue({
      x: dx,
      y: dy
    });
    //this.props.onMove({moveX, moveY});
  }

  onPanResponderRelease(evt, gestureState) {
    if (!this.isVisible()) {
      return;
    }
    //this.props.onRelease(evt);
  }

  borderStyle() {
    if (this.props.top && this.props.left) { return {'borderTopLeftRadius': 8}; }
    if (this.props.top && this.props.right) { return {'borderTopRightRadius': 8}; }
    if (this.props.bottom && this.props.left) { return {'borderBottomLeftRadius': 8}; }
    if (this.props.bottom && this.props.right) { return {'borderBottomRightRadius': 8}; }
    return {};
  }

  render() {
    return (
      <View
        style={[BaseStyles.centerContent, styles.miniCard, this.borderStyle()]}
        {...this.panHandlers()}
        >
        <Text style={[BaseStyles.largeText]}>{this.props.number.toString()}</Text>
      </View>
    );
  }

}

MiniNumberCard.defaultProps = {
  top: false,
  left: false,
  bottom: false,
  right: false
};

let styles = StyleSheet.create({

  miniCard: {
    height: Dimensions.miniCardSide,
    width: Dimensions.miniCardSide,
    backgroundColor: Colors.midBackground,
    shadowOffset: {left: 0, bottom: 0},
    shadowOpacity: 0.4,
    shadowRadius: 2
  }

});

module.exports = MiniNumberCard;