/**
 * @providesModule CardStack
 */

'use strict';

let {
  last
} = require('lodash');


class CardStack {

  constructor(cardId, number) {
    this.cardId = cardId;
    this.stack = [
      ['start', number]
    ];
  }

  // Action equivalent to dragging 'cardStack' into this card
  combineFrom(cardStack) {
    if (last(this.stack)[0] == 'CardStack') {
      throw new Error('Attempting to stack a card without choosing operation first.');
    }
    this.stack.push(['CardStack', cardStack]);
    return this;
  }

  // Action equivalent to selecting an 'operation' after dragging a card into it
  chooseOperation(operation) {
    if (last(this.stack)[0] != 'CardStack') {
      throw new Error('Cannot push an operation without a previous card first.');
    }
    this.stack.push(['Operation', operation]);
    return this;
  }

  pop() {
    this.stack.pop();
    return this;
  }

  // Pops the stack and returns the last card that was dragged into this one.
  // Don't use this yet; it still needs some
  undo() {
    if (this.stack.length < 2) {
      return null;
    } else {
      let undone = this.stack.slice(this.stack.length-2);
      this.stack = this.stack.slice(0, this.stack.length-2);
      let [_, equation] = (undone[0]);
      return equation.card;
    }
  }

  value() {
    let val = this.stack[0][1];
    let stack = this.stack.slice(1);

    while (stack.length >= 2) {
      var [stackList, operationList] = stack.slice(0, 2);
      var otherStack = stackList[1];
      var operation = operationList[1];
      var lhs = otherStack.value().value; // TODO: this is super ugly
      switch (operation) {
        case 'add':
          val = lhs.add(val);
          break;
        case 'multiply':
          val = lhs.multiply(val);
          break;
        case 'subtract':
          val = lhs.subtract(val);
          break;
        case 'divide':
          val = lhs.divide(val);
          break;
        default:
          throw new Error("Invalid operation: " + operation);
      }
      stack = stack.slice(2);
    }
    if (stack.length == 1) {
      let lhsResolved = stack[0][1].value();
      return { multi: [lhsResolved.value, val] }
    } else {
      return { value: val }
    }
  }
}

module.exports = CardStack;