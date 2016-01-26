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
let hoverCard = createAction('HOVER_CARD');
let dragCard = createAction('DRAG_CARD');
let releaseCard = createAction('RELEASE_CARD');
let combineCards = createAction('COMBINE_CARDS');
let chooseOperation = createAction('CHOOSE_OPERATION');

module.exports = {
  subscribe,
  setCards,
  hoverCard,
  dragCard,
  releaseCard,
  combineCards,
  chooseOperation
}
