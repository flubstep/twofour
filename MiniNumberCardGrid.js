/**
 * @providesModule MiniNumberCardGrid
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

let MiniNumberCard = require('MiniNumberCard');


class MiniNumberCardGrid extends React.Component {

  render() {
    let lhs = this.props.lhs;
    let rhs = this.props.rhs;

    return (
      <View style={[styles.cardGrid, this.props.style]}>
        <View style={[styles.row]}>
          <MiniNumberCard
            dragKey={this.props.dragKey+'TopLeft'}
            responder={this.props.responder}
            top={true}
            left={true}
            number={lhs.add(rhs)}
            />
          <MiniNumberCard
            dragKey={this.props.dragKey+'TopRight'}
            responder={this.props.responder}
            top={true}
            right={true}
            number={lhs.subtract(rhs)}
            />
        </View>
        <View style={[styles.row]}>
          <MiniNumberCard
            dragKey={this.props.dragKey+'BottomLeft'}
            responder={this.props.responder}
            bottom={true}
            left={true}
            number={lhs.multiply(rhs)}
            />
          <MiniNumberCard
            dragKey={this.props.dragKey+'BottomRight'}
            responder={this.props.responder}
            bottom={true}
            right={true}
            number={lhs.divide(rhs)}
            />
        </View>
      </View>
    );
  }

}

let styles = StyleSheet.create({

  cardGrid: {
    height: Dimensions.cardSide,
    width: Dimensions.cardSide,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  row: {
    height: Dimensions.miniCardSide,
    width: Dimensions.cardSide,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

});

module.exports = MiniNumberCardGrid;
