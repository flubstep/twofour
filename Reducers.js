/**
 * @providesModule Reducers
 */

'use strict';

let {uniqueId} = require('lodash');
let Fractional = require('Fractional');
let CardStack = require('CardStack');

let card = (state = {}, action) => {

  switch(action.type) {

    case 'ADD_CARD':
      return {
        id: action.id,
        stack: new CardStack(action.id, new Fractional(action.number)),
        combinedTo: null
      }

    case 'DRAG_CARD':
      return Object.assign({}, state, {
        // this has to live here rather than CardDragResponder
        zIndex: (action.id === state.id) ? 1 : 0
      });

    case 'COMBINE_CARDS':
      if (action.from.id === state.id) {
        return Object.assign({}, state, {
          combinedTo: action.to,
          zIndex: -1
        });
      } else if (action.to.id === state.id) {
        return Object.assign({}, state, {
          stack: state.stack.combineFrom(action.from.stack)
        });
      } else {
        return state;
      }

    case 'CHOOSE_OPERATION':
      if (action.id === state.id) {
        return Object.assign({}, state, {
          stack: state.stack.chooseOperation(action.operation)
        });
      }

    default:
      return state;

  }
}


let cards = (state = [], action) => {

  switch(action.type) {

    case 'SET_CARDS':
      return action.cards.map((number) => card(undefined, {
        type: 'ADD_CARD',
        id: uniqueId(),
        number: number
      }));

    case 'ADD_CARD':
      return [...state, card(undefined, action)];

    case 'DRAG_CARD':
    case 'RELEASE_CARD':
    case 'HOVER_CARD':
    case 'COMBINE_CARDS':
    case 'CHOOSE_OPERATION':
      return state.map((cardState) => card(cardState, action));

    default:
      return state;
  }

};



module.exports = {
  cards
};
