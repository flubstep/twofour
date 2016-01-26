/**
 * @providesModule Puzzle
 */

'use strict';

let {
  any,
  random
} = require('lodash');

const add = (l, r) => (l + r);
const subtract = (l, r) => (l - r);
const multiply = (l, r) => (l * r);
const divide = (l, r) => (l / r);

const operations = [
  add,
  subtract,
  multiply,
  divide
];

function pairs(numbers) {
  let pairs = [];
  for (let ii = 0; ii < numbers.length; ii++) {
    for (let jj = 0; jj < numbers.length; jj++) {
      if (ii != jj) {
        pairs.push([numbers[ii], numbers[jj]]);
      }
    }
  }
  return pairs;
}

function possible(numbers) {

  if (numbers.length == 1) {
    if (numbers[0] === 24) {
      return true;
    } else {
      return false;
    }
  }
  else {
    for (let ii = 0; ii < numbers.length; ii++) {
      for (let jj = 0; jj < numbers.length; jj++) {
        if (ii == jj) {
          continue;
        }
        let lhs = numbers[ii];
        let rhs = numbers[jj];
        let rest = [];
        for (let kk = 0; kk < numbers.length; kk++) {
          if (kk != ii && kk != jj) {
            rest.push(numbers[kk]);
          }
        }
        let newSolutions = operations.filter((op) => {
          let newVal = op(lhs, rhs);
          let nextNumbers = rest.concat([newVal]);
          return possible(nextNumbers);
        });
        if (newSolutions.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

}


function createPuzzle() {
  while (true) {
    let puzzle = [1, 2, 3, 4].map(() => random(1, 9));
    if (possible(puzzle)) {
      return puzzle;
    }
  }
}

module.exports = {
  createPuzzle,
  possible
}