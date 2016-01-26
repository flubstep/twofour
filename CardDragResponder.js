/**
 * @providesModule CardDragResponder
 */

'use strict';

let React = require('react-native');
let {
  PanResponder
} = React;

let {
  union,
  difference,
  filter
} = require('lodash');


const nop = () => {};


class CardDragResponder {

  constructor(options) {
    let panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => this.onPanResponderGrant(evt, gestureState),
      onPanResponderMove: (evt, gestureState) => this.onPanResponderMove(evt, gestureState),
      onPanResponderRelease: (evt, gestureState) => this.onPanResponderRelease(evt, gestureState)
    });
    this.cards = [];        // Component list of cards that have been added
    this.positions = {};    // card.dragKey => {x0, x1, y0, y1}
    this.grabbedCards = []; // Updating list of all cards that are being dragged
    this.hoveredCards = []; // Updating list of all cards that are being hovered over

    // Used for the parent component's gesture responders
    this.panHandlers = panResponder.panHandlers;
  }

  updatedGestureState(gestureState) {
    return Object.assign({}, gestureState, {
      grabbedCards: this.grabbedCards,
      hoveredCards: this.hoveredCards
    });
  }

  onCardGrab(card, evt, gestureState) {
    let fn = (card.onGrab || nop).bind(card);
    fn(evt, this.updatedGestureState(gestureState));
  }

  onCardMove(card, evt, gestureState) {
    let fn = (card.onMove || nop).bind(card);
    fn(evt, this.updatedGestureState(gestureState));
  }

  onCardHoverOver(card, evt, gestureState) {
    let fn = (card.onHoverOver || nop).bind(card);
    fn(evt, this.updatedGestureState(gestureState));
  }

  onCardHoverOut(card, evt, gestureState) {
    let fn = (card.onHoverOut || nop).bind(card);
    fn(evt, this.updatedGestureState(gestureState));
  }

  onCardRelease(card, evt, gestureState) {
    let fn = (card.onRelease || nop).bind(card);
    fn(evt, this.updatedGestureState(gestureState));
  }

  onPanResponderGrant(evt, gestureState) {
    this.grabbedCards = this.cardsAtPosition({x: gestureState.x0, y: gestureState.y0});
    this.hoveredCards = [];
    this.grabbedCards.map((card) => {
      this.onCardGrab(card, evt, gestureState);
    });
  }

  onPanResponderMove(evt, gestureState) {
    if (this.grabbedCards.length == 0) {
      return;
    }
    let currentCards = this.cardsAtPosition({x: gestureState.moveX, y: gestureState.moveY});
    let currentHoveredCards = difference(currentCards, this.grabbedCards);
    let newHovered = difference(currentHoveredCards, this.hoveredCards);
    let oldHovered = difference(this.hoveredCards, currentHoveredCards);
    this.hoveredCards = currentHoveredCards;

    // Call hover over for any new cards we are hovering over
    newHovered.map((card) => {
      this.onCardHoverOver(card, evt, gestureState);
    });

    // Call hover out for any cards we are no longer hovering over
    oldHovered.map((card) => {
      this.onCardHoverOut(card, evt, gestureState);
    });

    // Call move on any card that's being dragged
    this.grabbedCards.map((card) => {
      this.onCardMove(card, evt, gestureState);
    });
  }

  onPanResponderRelease(evt, gestureState) {
    if (this.grabbedCards.length == 0) {
      return;
    }
    this.grabbedCards.map((card) => {
      this.onCardRelease(card, evt, gestureState);
    });
    this.hoveredCards.map((card) => {
      this.onCardHoverOut(card, evt, gestureState);
    });
    this.grabbedCards = [];
    this.hoveredCards = [];
  }

  addCard(card, x0, x1, y0, y1) {
    if (typeof(card.props.dragKey) === "undefined") {
      throw new Error("A key property is required for draggable components");
    }
    this.cards = union(this.cards, [card]);
    this.positions[card.props.dragKey] = {x0, x1, y0, y1};
  }

  removeCard(toRemove) {
    this.cards = this.cards.filter((card) => (card.props.dragKey !== toRemove.props.dragKey));
    delete this.positions[toRemove.props.dragKey];
  }

  cardsAtPosition(pos) {
    let [posX, posY] = [pos.x, pos.y];
    return this.cards.filter((card) => {
      let {x0, x1, y0, y1} = this.positions[card.props.dragKey];
      let inVertical = (x0 < posX) && (posX < x1);
      let inHorizontal = (y0 < posY) && (posY < y1);
      return (inVertical && inHorizontal);
    });
  }
}


CardDragResponder.create = (options) => {
  return new CardDragResponder(options);
}


module.exports = CardDragResponder;
