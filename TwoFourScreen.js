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

let NumberCard = require('NumberCard');
let NumberCardBackground = require('NumberCardBackground');


class TwoFourScreen extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      cards: null,
      iterations: 0
    };
  }

  componentDidMount() {
    Actions.subscribe((gameState) => {
      console.log('game state', gameState);
      this.setState(gameState);
    });
    this.createCards();
    this.setInterval(this.onTick, 1000);
  }

  onTick() {

  }

  combineCards(cardFrom, cardInto) {
    console.log("combining cards ", cardFrom, cardInto);
    Actions.combineCards({
      from: cardFrom,
      to: cardInto
    });
  }

  onCardMove(gestureState, card) {
    this.calculateHover(gestureState.moveX, gestureState.moveY);
  }

  onCardRelease(gestureState, card) {
    let hoveredCards = this.state.cards.filter((card) => card.isHover);
    if (hoveredCards.length > 0) {
      this.combineCards(card, hoveredCards[0]);
    }
    Actions.releaseCard({id: card.id});
  }

  onCardPress(gestureState, card) {
    Actions.dragCard({id: card.id});
  }

  calculateHover(hoverX, hoverY) {
    // Not very functional implementation, but need to do the Action
    // dispatch here otherwise the performance crawls to a halt.
    this.state.cards.map((card) => {
      let inVertical = (card.posX < hoverX) && (hoverX < card.posX + card.height);
      let inHorizontal = (card.posY < hoverY) && (hoverY < card.posY + card.width);
      if (!card.isHover && !card.isDragging && !card.combinedTo && inVertical && inHorizontal) {
        Actions.hoverCard({id: card.id});
      } else if (card.isHover && !(inVertical && inHorizontal)) {
        Actions.hoverCard({id: null});
      }
    });

  }

  createCards() {
    let cards = [4, 5, 6, 7];
    Actions.setCards({cards});
  }

  renderCard(card) {
    return (
      <NumberCard
        onPress={(gestureState) => this.onCardPress(gestureState, card)}
        onMove={(gestureState) => this.onCardMove(gestureState, card)}
        onRelease={(gestureState) => this.onCardRelease(gestureState, card)}
        {...card}
      />
    );
  }

  render() {
    if (this.state.cards) {
      return (
        <View style={{backgroundColor: 'white'}}>
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
    backgroundColor: 'rgba(0,0,0,0.0)'
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