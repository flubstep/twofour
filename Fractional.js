/**
 * @providesModule Fractional
 */

'use strict';

let {
  min,
  max
} = require('lodash');


function lcm(a, b) {
  let d = gcd(a, b);
  return (a * b) / d;
}


function gcd(a, b) {
  let numbers = [Math.abs(a), Math.abs(b)];
  let larger = max(numbers);
  let smaller = min(numbers);
  if (smaller == 0) {
    return larger;
  } else {
    return gcd(smaller, larger % smaller);
  }
}


class Fractional {

  constructor(numerator, denominator = 1) {
    let divisor = gcd(numerator, denominator);
    this.numerator = numerator / divisor;
    this.denominator = denominator / divisor;
  }

  add(rhs) {
    let denominator = lcm(this.denominator, rhs.denominator);
    let lhsNumerator = (this.denominator / denominator) * this.numerator;
    let rhsNumerator = (rhs.denominator / denominator) * rhs.numerator;
    return new Fractional(lhsNumerator + rhsNumerator, denominator);
  }

  subtract(rhs) {
    let denominator = lcm(this.denominator, rhs.denominator);
    let lhsNumerator = (this.denominator / denominator) * this.numerator;
    let rhsNumerator = (rhs.denominator / denominator) * rhs.numerator;
    return new Fractional(lhsNumerator - rhsNumerator, denominator);
  }

  multiply(rhs) {
    return new Fractional(this.numerator * rhs.numerator, this.denominator * rhs.denominator);
  }

  divide(rhs) {
    return new Fractional(this.numerator * rhs.denominator, this.denominator * rhs.numerator);
  }

  toString() {
    if (this.denominator == 1) {
      return this.numerator.toString();
    } else {
      return this.numerator.toString() + '/' + this.denominator.toString();
    }
  }

}

module.exports = Fractional;