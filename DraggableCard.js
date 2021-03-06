/**
 * @providesModule DraggableCard
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Animated
} = React;


class DraggableCard extends React.Component {

  constructor(props, context) {
    super(props, context);
    if (typeof(props.responder) === "undefined") {
      throw new Error("Unable to create a DraggableCard without a CardDragResponder for 'responder' prop");
    }
  }

  componentWillUnmount() {
    this.props.responder.removeCard(this);
  }

  onLayout() {
    this.refs.card.measure((fx, fy, width, height, posX, posY) => {
      this.props.responder.addCard(this, posX, posX+height, posY, posY+width);
    });
  }

  onGrab: () => {}
  onMove: () => {}
  onHoverOver: () => {}
  onHoverOut: () => {}
  onRelease: () => {}
  onPress: () => {}

}


module.exports = DraggableCard;
