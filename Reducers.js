/**
 * @providesModule Reducers
 */

'use strict';


let cardPositions = (state = {}, action) => {

  switch(action.type) {

    case 'REGISTER_CARD_POSITION':
      let cardState = {};
      cardState[action.cardId] = {
        posX: action.posX,
        posY: action.posY,
        height: action.height,
        width: action.width
      };
      return Object.assign({}, state, cardState);

    default:
      return state;
  }

};



module.exports = {
  cardPositions
};