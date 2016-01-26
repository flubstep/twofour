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

let Fractional = require('Fractional');
let CardCombo = require('CardCombo');
let Puzzle = require('Puzzle');

let {
  sortBy,
  map,
  random
} = require('lodash');

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
      this.setState(gameState.gameState);
    });
    this.createCards();
    this.setInterval(this.onTick, 1000);
  }

  onTick() {

  }

  createCards() {
    let cards = Puzzle.createPuzzle();
    Actions.setCards({cards});
  }

  renderCard(card, style) {
    return (
      <NumberCard
        // TODO: grab key from cardcombo if needed...
        key={card.id}
        dragKey={card.id}
        responder={this.responder}
        style={style}
        card={card}
      />
    );
  }

  render() {
    console.log(this.state);
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
      // reason we use absolute positioning.) We also account for dragging a child
      // card here: our invariant is that the id of any child must begin with its
      // parent's id (and only children begin with it) (TODO: this)
      cardData = sortBy(cardData, ([card, style]) => {
        if (card && this.state.mostRecentlyActiveCardId) {
          return this.state.mostRecentlyActiveCardId.indexOf(card.id) === 0 ?
            1 : 0;
        }
      });
      let cards = map(cardData, ([card, style]) => card && this.renderCard(card, style));
      console.log(cardData);

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
