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

let CardCombo = require('CardCombo');
let DraggableCard = require('DraggableCard');
let MiniNumberCardGrid = require('MiniNumberCardGrid');


class NumberCard extends DraggableCard {

  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: new Animated.Value(1.0),
      opacity: new Animated.Value(1.0),
      positionOffset: new Animated.ValueXY(0, 0)
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

  onGrab(evt, gestureState) {
    // let redux know so it can trigger a rerender with the grabbed
    // card on top
    Actions.dragCard({id: this.props.card.id});
  }

  onMove(evt, gestureState) {
    let {dx, dy, moveX, moveY} = gestureState;
    this.state.positionOffset.setValue({
      x: dx,
      y: dy
    });
  }

  onHoverOver(evt, gestureState) {
    this.animateScale(1.1).start();
  }

  onHoverOut(evt, gestureState) {
    this.animateScale(1.0).start();
  }

  onRelease(evt, gestureState) {
    if (gestureState.hoveredCards.length > 0) {
      // this.props.responder.removeCard(this); // TODO: need inverse
      this.props.responder.removeCard(gestureState.hoveredCards[0]);
      Actions.combineCards({
        from: this.props.card,
        to: gestureState.hoveredCards[0].props.card // assuming only one right now
      });

      Animated.sequence([
        Animated.parallel([
          this.animateOpacity(0.0)
        ])
      ]).start()
    } else {
      Animated.parallel([
        this.animatePosition(0)
      ]).start();
    }
  }

  render() {
    if (this.props.card instanceof CardCombo && !this.props.card.selected) {
      return (
        <MiniNumberCardGrid
          combo={this.props.card}
          dragKey={this.props.dragKey}
          responder={this.props.responder}
          style={this.props.style}
        />
      );
    }
    else {
      return (
        <Animated.View
          style={[
            BaseStyles.transparentBackground,
            {
              opacity: this.state.opacity
            },
            {
              transform: [
                {scale: this.state.scale},
                ...this.state.positionOffset.getTranslateTransform()
              ]
            },
            this.props.style
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
              {this.props.card.number.toString()}
            </Text>
          </View>
        </Animated.View>
      );
    }
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

  },
  hover: {
    shadowRadius: 8
  }
});


module.exports = NumberCard;
