/**
 * @providesModule Actions
 */

'use strict';

let {
  createStore,
  combineReducers
} = require('redux');

let reducers = require('Reducers');

const game = combineReducers(reducers);
const gameStore = createStore(game);


function subscribe(callback) {
  gameStore.subscribe(() => {
    callback(gameStore.getState())
  });
}

function registerCardPosition(cardId, posX, posY, height, width) {
  gameStore.dispatch({
    type: 'REGISTER_CARD_POSITION',
    cardId: cardId,
    posX: posX,
    posY: posY,
    height: height,
    width: width
  })
}


module.exports = {
  subscribe,
  registerCardPosition
}