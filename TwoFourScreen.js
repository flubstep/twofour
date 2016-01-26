/**
 * @providesModule TwoFourScreen
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View
} = React;

let ReactMixin = require('react-mixin');
let TimerMixin = require('react-timer-mixin');

let {Dimensions, BaseStyles, Colors} = require('Constants');
let Actions = require('Actions');
let CardDragResponder = require('CardDragResponder');

let NumberCard = require('NumberCard');
let NumberCardBackground = require('NumberCardBackground');


class TwoFourScreen extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      cards: null,
      iterations: 0
    };
    this.responder = CardDragResponder.create({});
  }

  componentDidMount() {
    Actions.subscribe((gameState) => {
      this.setState(gameState);
    });
    this.createCards();
    this.setInterval(this.onTick, 1000);
  }

  onTick() {

  }

  createCards() {
    let cards = [4, 5, 6, 7];
    Actions.setCards({cards});
  }

  renderCard(card) {
    return (
      <NumberCard
        dragKey={card.id}
        responder={this.responder}
        {...card}
      />
    );
  }

  render() {
    if (this.state.cards) {
      return (
        <View
          style={{backgroundColor: 'white'}}
          {...this.responder.panHandlers}
          >
          <View style={styles.container}>
            <View style={[styles.row, BaseStyles.transparentBackground]}>
              <NumberCardBackground />
              <NumberCardBackground />
            </View>
            <View style={[styles.row, BaseStyles.transparentBackground]}>
              <NumberCardBackground />
              <NumberCardBackground />
            </View>
          </View>
          <View style={styles.container}>
            <View style={[styles.row, BaseStyles.transparentBackground]}>
              {this.renderCard(this.state.cards[0])}
              {this.renderCard(this.state.cards[1])}
            </View>
            <View style={[styles.row, BaseStyles.transparentBackground]}>
              {this.renderCard(this.state.cards[2])}
              {this.renderCard(this.state.cards[3])}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
  }

}

let styles = StyleSheet.create({

  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.windowHeight,
    width: Dimensions.windowWidth,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.transparent
  },

  row: {
    width: Dimensions.windowWidth - Dimensions.baseMargin * 2,
    height: Dimensions.cardHeight,
    marginBottom: Dimensions.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

});

module.exports = ReactMixin.decorate(TimerMixin)(TwoFourScreen);