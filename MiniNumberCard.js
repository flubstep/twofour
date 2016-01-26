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

let DraggableCard = require('DraggableCard');


class MiniNumberCard extends DraggableCard {

  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: new Animated.Value(0.0),
      opacity: new Animated.Value(this.props.combinedTo ? 0.1 : 1.0),
      positionOffset: new Animated.ValueXY(0, 0)
    };
  }

  animateScale(scale) {
    return Animated.timing(this.state.scale, {
      toValue: scale,
      duration: 200
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

  onMove(evt, gestureState) {
    // TODO: if it's gone past a certain amount, then do a select and then drag
  }

  onRelease(evt, gestureState) {
    // TODO: replace the current equation with this value
  }

  componentDidMount() {
    this.state.scale.setValue(0.0);
    this.animateScale(1.0).start();
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
      this.props.responder.removeCard(this); // TODO: need inverse
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

  borderStyle() {
    if (this.props.top && this.props.left) { return {'borderTopLeftRadius': 8}; }
    if (this.props.top && this.props.right) { return {'borderTopRightRadius': 8}; }
    if (this.props.bottom && this.props.left) { return {'borderBottomLeftRadius': 8}; }
    if (this.props.bottom && this.props.right) { return {'borderBottomRightRadius': 8}; }
    return {};
  }

  render() {
    return (
      <Animated.View style={[
          {
            transform: [
              {scale: this.state.scale},
              ...this.state.positionOffset.getTranslateTransform()
            ]
          }
        ]}
        >
        <View
          style={[BaseStyles.centerContent, styles.miniCard, this.borderStyle()]}
          onLayout={(evt) => this.onLayout(evt)}
          ref="card"
          >
          <Text style={[BaseStyles.largeText]}>{this.props.number.toString()}</Text>
        </View>
      </Animated.View>
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