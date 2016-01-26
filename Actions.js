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

function createAction(type) {
  return (args) => {
    gameStore.dispatch({
      type: type,
      ...args
    })
  }
}

let setCards = createAction('SET_CARDS');
let dragCard = createAction('DRAG_CARD');
let combineCards = createAction('COMBINE_CARDS');
let embiggenMini = createAction('EMBIGGEN_MINI');

module.exports = {
  subscribe,
  setCards,
  dragCard,
  combineCards,
  embiggenMini
}
