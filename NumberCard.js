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

let DraggableCard = require('DraggableCard');
let MiniNumberCardGrid = require('MiniNumberCardGrid');


function value(cardState) {
  if (!cardState) {
    return 0;
  } else {
    return cardState.number + value(cardState.combinedFrom);
  }
}


class NumberCard extends DraggableCard {

  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: new Animated.Value(1.0),
      opacity: new Animated.Value(this.props.combinedTo ? 0.1 : 1.0),
      positionOffset: new Animated.ValueXY(0, 0)
    };
  }

  isVisible() {
    return !this.props.combinedTo;
  }

  value() {
    return this.props.number.toString();
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
      this.props.responder.removeCard(this); // TODO: need inverse
      Animated.sequence([
        Animated.parallel([
          this.animateScale(1.0),
          this.animateOpacity(0.0)
        ])
      ]).start()
    }
  }

  onGrab(evt, gestureState) {
    Actions.dragCard({id: this.props.id});
  }

  onMove(evt, gestureState) {
    let {dx, dy, moveX, moveY} = gestureState;
    this.state.positionOffset.setValue({
      x: dx,
      y: dy
    });
  }

  onHoverOver(evt, gestureState) {
    Actions.hoverCard({id: this.props.id});
  }

  onHoverOut(evt, gestureState) {
    Actions.hoverCard({id: null});
  }

  onRelease(evt, gestureState) {
    if (gestureState.hoveredCards.length > 0) {
      Actions.combineCards({
        from: this.props,
        to: gestureState.hoveredCards[0].props // assuming only one right now
      });
    }
    Actions.releaseCard({id: this.props.id});
  }

  renderSplitView() {
    return (
      <MiniNumberCardGrid
        dragKey={this.props.dragKey + 'Mini'}
        responder={this.props.responder}
        lhs={this.props.number}
        rhs={this.props.combinedFrom.number}
        style={this.props.style}
      />
    );
  }

  render() {
    if (this.props.combinedFrom) {
      return this.renderSplitView();
    }
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
            {this.props.combinedTo ? '' : this.value()}
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

  },
  hover: {
    shadowRadius: 8
  }
});


module.exports = NumberCard;
