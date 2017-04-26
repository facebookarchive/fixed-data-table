/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PrefixIntervalTree
 * @flow
 * @typechecks
 */

'use strict';

var invariant = require('invariant');

var parent = node => Math.floor(node / 2);

var Int32Array = global.Int32Array ||
  function(size: number): Array<number> {
    var xs = [];
    for (var i = size - 1; i >= 0; --i) {
      xs[i] = 0;
    }
    return xs;
  };

/**
 * Computes the next power of 2 after or equal to x.
 */
function ceilLog2(x: number): number {
  var y = 1;
  while (y < x) {
    y *= 2;
  }
  return y;
}

/**
 * A prefix interval tree stores an numeric array and the partial sums of that
 * array. It is optimized for updating the values of the array without
 * recomputing all of the partial sums.
 *
 *   - O(ln n) update
 *   - O(1) lookup
 *   - O(ln n) compute a partial sum
 *   - O(n) space
 *
 * Note that the sequence of partial sums is one longer than the array, so that
 * the first partial sum is always 0, and the last partial sum is the sum of the
 * entire array.
 */
class PrefixIntervalTree {
  /**
   * Number of elements in the array
   */
  _size: number;

  /**
   * Half the size of the heap. It is also the number of non-leaf nodes, and the
   * index of the first element in the heap. Always a power of 2.
   */
  _half: number;

  /**
   * Binary heap
   */
  _heap: Array<number>;

  constructor(xs: Array<number>) {
    this._size = xs.length;
    this._half = ceilLog2(this._size);
    this._heap = new Int32Array(2 * this._half);

    var i;
    for (i = 0; i < this._size; ++i) {
      this._heap[this._half + i] = xs[i];
    }

    for (i = this._half - 1; i > 0; --i) {
      this._heap[i] =  this._heap[2 * i] + this._heap[2 * i + 1];
    }
  }

  static uniform(size: number, initialValue: number): PrefixIntervalTree {
    var xs = [];
    for (var i = size - 1; i >= 0; --i) {
      xs[i] = initialValue;
    }

    return new PrefixIntervalTree(xs);
  }

  static empty(size: number): PrefixIntervalTree {
    return PrefixIntervalTree.uniform(size, 0);
  }

  set(index: number, value: number): void {
    invariant(
      0 <= index && index < this._size,
      'Index out of range %s',
      index,
    );

    var node = this._half + index;
    this._heap[node] = value;

    node = parent(node);
    for (; node !== 0; node = parent(node)) {
      this._heap[node] =
        this._heap[2 * node] + this._heap[2 * node + 1];
    }
  }

  get(index: number): number {
    invariant(
      0 <= index && index < this._size,
      'Index out of range %s',
      index,
    );

    var node = this._half + index;
    return this._heap[node];
  }

  getSize(): number {
    return this._size;
  }

  /**
   * Returns the sum get(0) + get(1) + ... + get(end - 1).
   */
  sumUntil(end: number): number {
    invariant(
      0 <= end && end < this._size + 1,
      'Index out of range %s',
      end,
    );

    if (end === 0) {
      return 0;
    }

    var node = this._half + end - 1;
    var sum = this._heap[node];
    for (; node !== 1; node = parent(node)) {
      if (node % 2 === 1) {
        sum += this._heap[node - 1];
      }
    }

    return sum;
  }

  /**
   * Returns the sum get(0) + get(1) + ... + get(inclusiveEnd).
   */
  sumTo(inclusiveEnd: number): number {
    invariant(
      0 <= inclusiveEnd && inclusiveEnd < this._size,
      'Index out of range %s',
      inclusiveEnd,
    );
    return this.sumUntil(inclusiveEnd + 1);
  }

  /**
   * Returns the sum get(begin) + get(begin + 1) + ... + get(end - 1).
   */
  sum(begin: number, end: number): number {
    invariant(begin <= end, 'Begin must precede end');
    return this.sumUntil(end) - this.sumUntil(begin);
  }

  /**
   * Returns the smallest i such that 0 <= i <= size and sumUntil(i) <= t, or
   * -1 if no such i exists.
   */
  greatestLowerBound(t: number): number {
    if (t < 0) {
      return -1;
    }

    var node = 1;
    if (this._heap[node] <= t) {
      return this._size;
    }

    while (node < this._half) {
      var leftSum = this._heap[2 * node];
      if (t < leftSum) {
        node = 2 * node;
      } else {
        node = 2 * node + 1;
        t -= leftSum;
      }
    }

    return node - this._half;
  }

  /**
   * Returns the smallest i such that 0 <= i <= size and sumUntil(i) < t, or
   * -1 if no such i exists.
   */
  greatestStrictLowerBound(t: number): number {
    if (t <= 0) {
      return -1;
    }

    var node = 1;
    if (this._heap[node] < t) {
      return this._size;
    }

    while (node < this._half) {
      var leftSum = this._heap[2 * node];
      if (t <= leftSum) {
        node = 2 * node;
      } else {
        node = 2 * node + 1;
        t -= leftSum;
      }
    }

    return node - this._half;
  }

  /**
   * Returns the smallest i such that 0 <= i <= size and t <= sumUntil(i), or
   * size + 1 if no such i exists.
   */
  leastUpperBound(t: number): number {
    return this.greatestStrictLowerBound(t) + 1;
  }

  /**
   * Returns the smallest i such that 0 <= i <= size and t < sumUntil(i), or
   * size + 1 if no such i exists.
   */
  leastStrictUpperBound(t: number): number {
    return this.greatestLowerBound(t) + 1;
  }
}

module.exports = PrefixIntervalTree;
