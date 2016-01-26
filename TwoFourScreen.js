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

let { sortBy, map } = require('lodash');

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

  renderCard(card, style) {
    return (
      <NumberCard
        key={card.id}
        dragKey={card.id}
        responder={this.responder}
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
        <NumberCardBackground key={'backgroundTopLeft'} style={positionFunc(0, 0)} />,
        <NumberCardBackground key={'backgroundTopRight'} style={positionFunc(0, 1)} />,
        <NumberCardBackground key={'backgroundBottomLeft'} style={positionFunc(1, 0)} />,
        <NumberCardBackground key={'backgroundBottomRight'} style={positionFunc(1, 1)} />
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
      cardData = sortBy(cardData, ([card, style]) => card.zIndex);
      let cards = map(cardData, ([card, style]) => this.renderCard(card, style));

      return (
        <View
          style={{backgroundColor: Colors.white}}
          {...this.responder.panHandlers}
          >
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
