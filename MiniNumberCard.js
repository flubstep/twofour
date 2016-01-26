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
    props = Object.assign({}, props, { manualMeasure: true });
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

  onGrab(evt, gestureState) {
    // let redux know so it can trigger a rerender with the grabbed
    // card on top
    Actions.dragCard({id: this.props.id});
  }

  onMove(evt, gestureState) {
    let {dx, dy, moveX, moveY} = gestureState;
    this.state.positionOffset.setValue({
      x: dx,
      y: dy
    });
  }

  onRelease(evt, gestureState) {
    Actions.chooseOperation({id: this.props.cardId, operation: this.props.operation});
    Animated.parallel([
      this.animatePosition(0)
    ]).start();
  }

  onHoverOver(evt, gestureState) {
    this.animateScale(1.1).start();
  }

  onHoverOut(evt, gestureState) {
    this.animateScale(1.0).start();
  }

  componentDidMount() {
    this.state.scale.setValue(0.0);
    this.animateScale(1.0).start(__ => this.onMeasure());
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
