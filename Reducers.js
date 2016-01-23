/**
 * @providesModule Reducers
 */

'use strict';

let {uniqueId} = require('lodash');

let card = (state = {}, action) => {

  switch(action.type) {

    case 'ADD_CARD':
      return {
        id: action.id,
        number: action.number,
        isDragging: false,
        isHover: false,
        posX: 0,
        posY: 0,
        height: 0,
        width: 0,
        combinedTo: null,
        combinedFrom: null
      }

    case 'REGISTER_CARD_POSITION':
      if (action.id === state.id) {
        return Object.assign({}, state, {
          posX: action.posX,
          posY: action.posY,
          height: action.height,
          width: action.width,
        });
      } else {
        return state;
      }

    case 'DRAG_CARD':
      return Object.assign({}, state, {
        isDragging: (action.id === state.id)
      });

    case 'RELEASE_CARD':
      return Object.assign({}, state, {
        isDragging: false,
        isHover: false,
      });

    case 'HOVER_CARD':
      if (action.id === state.id) {
        return Object.assign({}, state, {
          isHover: true
        });
      } else if (state.isHover) {
        return Object.assign({}, state, {
          isHover: false
        });
      } else {
        return state;
      }

    case 'COMBINE_CARDS':
      if (action.from.id === state.id) {
        return Object.assign({}, state, {
          combinedTo: action.to
        });
      } else if (action.to.id === state.id) {
        return Object.assign({}, state, {
          combinedFrom: action.from
        });
      } else {
        return state;
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

    case 'REGISTER_CARD_POSITION':
    case 'DRAG_CARD':
    case 'RELEASE_CARD':
    case 'HOVER_CARD':
    case 'COMBINE_CARDS':
      return state.map((cardState) => card(cardState, action));

    default:
      return state;
  }

};



module.exports = {
  cards
};