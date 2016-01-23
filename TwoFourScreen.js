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

  onCardMove(evt, card) {
    this.calculateHover(evt.moveX, evt.moveY);
  }

  onCardRelease(evt, card) {
    Actions.releaseCard({id: card.id});
  }

  onCardPress(evt, card) {
    Actions.dragCard({id: card.id});
  }

  calculateHover(hoverX, hoverY) {
    this.state.cards.map((card) => {
      let inVertical = (card.posX < hoverX) && (hoverX < card.posX + card.height);
      let inHorizontal = (card.posY < hoverY) && (hoverY < card.posY + card.width);
      if (!card.isHover && !card.isDragging && inVertical && inHorizontal) {
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
        onPress={(evt) => this.onCardPress(evt, card)}
        onMove={(evt) => this.onCardMove(evt, card)}
        onRelease={(evt) => this.onCardRelease(evt, card)}
        {...card}
      />
    );
  }

  render() {
    if (this.state.cards) {
      return (
        <View>
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
          <View style={[
            BaseStyles.centerContent,
            BaseStyles.transparentBackground,
            {
              position: 'absolute',
              top: 0,
              left: 0
            },
            ]}
            >
            <Text style={[BaseStyles.largeText]}>Drag the boxes around</Text>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightBackground
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