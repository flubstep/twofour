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

let { sortBy, map } = require('lodash');

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

  renderCard(card, style) {
    return (
      <NumberCard
        onPress={(gestureState) => this.onCardPress(gestureState, card)}
        onMove={(gestureState) => this.onCardMove(gestureState, card)}
        onRelease={(gestureState) => this.onCardRelease(gestureState, card)}
        key={card.id}
        style={style}
        {...card}
      />
    );
  }

  render() {
    if (this.state.cards) {
      // absolute position the cards/backgrounds
      let positionFunc = (shiftY = false, shiftX = false) => {
        let cardsTop = (Dimensions.windowHeight - Dimensions.cardSide * 2 - Dimensions.baseMargin) / 2;
        let cardsLeft = (Dimensions.windowWidth - Dimensions.cardSide * 2 - Dimensions.baseMargin) / 2;
        let horizOffset = Dimensions.cardSide + Dimensions.baseMargin;
        let vertOffset = Dimensions.cardSide + Dimensions.baseMargin;
        return {
          position: 'absolute',
          top: cardsTop + (shiftY ? vertOffset : 0),
          left: cardsLeft + (shiftX ? horizOffset : 0)
        };
      }

      let backgrounds = [
        <NumberCardBackground style={positionFunc(0, 0)} />,
        <NumberCardBackground style={positionFunc(0, 1)} />,
        <NumberCardBackground style={positionFunc(1, 0)} />,
        <NumberCardBackground style={positionFunc(1, 1)} />
      ];

      let cardData = [
        [this.state.cards[0], positionFunc(0, 0)],
        [this.state.cards[1], positionFunc(0, 1)],
        [this.state.cards[2], positionFunc(1, 0)],
        [this.state.cards[3], positionFunc(1, 1)]
      ];

      // if we're currently dragging a card, we want to render it last so that
      // it always shows up on top of other cards (incidentally, this is the main
      // reason we use absolute positioning)
      cardData = sortBy(cardData, data => data[0].isTopCard ? 1 : 0);
      let cards = map(cardData, data => this.renderCard(data[0], data[1]));

      return (
        <View style={{backgroundColor: 'white'}}>
          <View style={styles.container}>
            {backgrounds}
            {cards}
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
    height: Dimensions.windowHeight,
    width: Dimensions.windowWidth,
    backgroundColor: Colors.transparent
  },

});

module.exports = ReactMixin.decorate(TimerMixin)(TwoFourScreen);
