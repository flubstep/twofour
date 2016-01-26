/**
 * @providesModule CardCombo
 */

'use strict';

let {
  last
} = require('lodash');


class CardCombo {

  constructor(fromCard, toCard, selected = null) {
    this.fromCard = fromCard;
    this.toCard = toCard;
    this.selected = selected;

    if (this.selected) {
      this.number = this.evaluateNumber();
    }

    this.id = this.makeId(this.selected);
  }

  evaluateNumber() {
    if (!this.selected) {
      throw new Error('cannot evaluate a cardcombo without an operator...');
    }
    let evaluate = card => {
      if (card instanceof CardCombo) {
        return card.evaluateNumber();
      } else {
        return card.number;
      }
    };

    let fromValue = evaluate(this.fromCard);
    let toValue = evaluate(this.toCard);

    switch (this.selected) {
      case 'add':
        return fromValue.add(toValue);
      case 'subtract':
        return fromValue.subtract(toValue);
      case 'multiply':
        return fromValue.multiply(toValue);
      case 'divide':
        return fromValue.divide(toValue);
      default:
        throw new Error('unknown operation '+this.selected);
    }
  }

  cloneWithSelectedOperator(selection) {
    return new CardCombo(this.fromCard, this.toCard, selection);
  }

  // the combo itself has an id, and the 4 potential outcomes/children of a
  // combo also have ids (that begin with the combo id)
  makeId(operation = null) {
    return "c" + this.fromCard.id + "_" + this.toCard.id + 
      (operation ? "_" + operation : "");
  }
}

module.exports = CardCombo;
