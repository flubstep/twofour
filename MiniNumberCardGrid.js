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
    let combo = this.props.combo;

    return (
      <View style={[styles.cardGrid, this.props.style]}>
        <View style={[styles.row]}>
          <MiniNumberCard
            dragKey={combo.makeId('add')}
            responder={this.props.responder}
            card={combo.cloneWithSelectedOperator('add')}
            operation='add'
            top={true}
            left={true}
          />
          <MiniNumberCard
            dragKey={combo.makeId('subtract')}
            responder={this.props.responder}
            card={combo.cloneWithSelectedOperator('subtract')}
            operation='subtract'
            top={true}
            right={true}
          />
        </View>
        <View style={[styles.row]}>
          <MiniNumberCard
            dragKey={combo.makeId('multiply')}
            responder={this.props.responder}
            card={combo.cloneWithSelectedOperator('multiply')}
            operation='multiply'
            bottom={true}
            left={true}
          />
          <MiniNumberCard
            dragKey={combo.makeId('divide')}
            responder={this.props.responder}
            card={combo.cloneWithSelectedOperator('divide')}
            operation='divide'
            bottom={true}
            right={true}
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
