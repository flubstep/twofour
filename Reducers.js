/**
 * @providesModule Reducers
 */

'use strict';

let {uniqueId} = require('lodash');
let Fractional = require('Fractional');
let CardCombo = require('CardCombo');

let card = (state = {}, action) => {

  switch(action.type) {
    case 'MAKE_CARD':
      return {
        id: action.id,
        number: new Fractional(action.number),
      }

    case 'COMBINE_CARDS':
      if (!state) { return null; }

      if (action.from.id.indexOf(state.id) === 0) {
        // we dragged either this card or a mini from this space
        return null;
      } else if (action.to.id.indexOf(state.id) === 0) {
        return new CardCombo(action.from, action.to);
      } else {
        return state;
      }

    case 'EMBIGGEN_MINI':
      if (!state) { return null; }

      if (action.id.indexOf(state.id) === 0) {
        return state.cloneWithSelectedOperator(action.operation);
      }

    default:
      return state;
  }
}


let gameState = (state, action) => {
  console.log(action);
  if (typeof state === 'undefined') {
    return {
      cards: [], // 4 elements. contains the contents of each card _position_
      mostRecentlyActiveCardId: null, // used by drag-n-drop rendering
      cardsHistory: [] // history of cards, used for undo
    };
  }

  var newState = {
    cards: state.cards,
    mostRecentlyActiveCardId: state.mostRecentlyActiveCardId,
    cardsHistory: state.cardsHistory,
  };

  let saveToHistory = __ => {
    newState.cardsHistory = [...state.cardsHistory, state.cards];
  }

  switch(action.type) {
    case 'SET_CARDS':
      newState.cards = action.cards.map((number) => card(undefined, {
        type: 'MAKE_CARD',
        id: uniqueId(),
        number: number
      }));
      return newState;

    case 'DRAG_CARD':
      newState.mostRecentlyActiveCardId = action.id;
      return newState;

    case 'COMBINE_CARDS':
    case 'EMBIGGEN_MINI':
      saveToHistory();
      newState.cards = state.cards.map((cardState) => card(cardState, action));
      return newState;

    default:
      return state;
  }
};



module.exports = {
  gameState 
};
