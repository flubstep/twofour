/**
 * @providesModule NumberCardBackground
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


class NumberCardBackground extends React.Component {

  render() {
    return (
      <View style={[
          BaseStyles.centerContent,
          styles.card,
          this.props.isHover ? styles.hover : null,
          this.props.isDragging ? styles.dragging : null,
          this.props.style
        ]}
        ref="card"
        >
        <Text style={BaseStyles.hugeText}>
          {this.props.combinedTo ? '' : this.props.number}
        </Text>
      </View>
    );
  }

}

let styles = StyleSheet.create({

  card: {
    height: Dimensions.cardSide,
    width: Dimensions.cardSide,
    backgroundColor: Colors.midBackground,
    borderRadius: 8,
    opacity: 0.1
  }
});

module.exports = NumberCardBackground;
