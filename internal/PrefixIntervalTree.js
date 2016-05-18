/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PrefixIntervalTree
 * 
 * @typechecks
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('./invariant');

var parent = function parent(node) {
  return Math.floor(node / 2);
};

var Int32Array = global.Int32Array || function (size) {
  var xs = [];
  for (var i = size - 1; i >= 0; --i) {
    xs[i] = 0;
  }
  return xs;
};

/**
 * Computes the next power of 2 after or equal to x.
 */
function ceilLog2(x) {
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

var PrefixIntervalTree = (function () {
  function PrefixIntervalTree(xs) {
    _classCallCheck(this, PrefixIntervalTree);

    this._size = xs.length;
    this._half = ceilLog2(this._size);
    this._heap = new Int32Array(2 * this._half);

    var i;
    for (i = 0; i < this._size; ++i) {
      this._heap[this._half + i] = xs[i];
    }

    for (i = this._half - 1; i > 0; --i) {
      this._heap[i] = this._heap[2 * i] + this._heap[2 * i + 1];
    }
  }

  _createClass(PrefixIntervalTree, [{
    key: 'set',
    value: function set(index, value) {
      invariant(0 <= index && index < this._size, 'Index out of range %s', index);

      var node = this._half + index;
      this._heap[node] = value;

      node = parent(node);
      for (; node !== 0; node = parent(node)) {
        this._heap[node] = this._heap[2 * node] + this._heap[2 * node + 1];
      }
    }
  }, {
    key: 'get',
    value: function get(index) {
      invariant(0 <= index && index < this._size, 'Index out of range %s', index);

      var node = this._half + index;
      return this._heap[node];
    }
  }, {
    key: 'getSize',
    value: function getSize() {
      return this._size;
    }

    /**
     * Returns the sum get(0) + get(1) + ... + get(end - 1).
     */
  }, {
    key: 'sumUntil',
    value: function sumUntil(end) {
      invariant(0 <= end && end < this._size + 1, 'Index out of range %s', end);

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
  }, {
    key: 'sumTo',
    value: function sumTo(inclusiveEnd) {
      invariant(0 <= inclusiveEnd && inclusiveEnd < this._size, 'Index out of range %s', inclusiveEnd);
      return this.sumUntil(inclusiveEnd + 1);
    }

    /**
     * Returns the sum get(begin) + get(begin + 1) + ... + get(end - 1).
     */
  }, {
    key: 'sum',
    value: function sum(begin, end) {
      invariant(begin <= end, 'Begin must precede end');
      return this.sumUntil(end) - this.sumUntil(begin);
    }

    /**
     * Returns the smallest i such that 0 <= i <= size and sumUntil(i) <= t, or
     * -1 if no such i exists.
     */
  }, {
    key: 'greatestLowerBound',
    value: function greatestLowerBound(t) {
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
  }, {
    key: 'greatestStrictLowerBound',
    value: function greatestStrictLowerBound(t) {
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
  }, {
    key: 'leastUpperBound',
    value: function leastUpperBound(t) {
      return this.greatestStrictLowerBound(t) + 1;
    }

    /**
     * Returns the smallest i such that 0 <= i <= size and t < sumUntil(i), or
     * size + 1 if no such i exists.
     */
  }, {
    key: 'leastStrictUpperBound',
    value: function leastStrictUpperBound(t) {
      return this.greatestLowerBound(t) + 1;
    }
  }], [{
    key: 'uniform',
    value: function uniform(size, initialValue) {
      var xs = [];
      for (var i = size - 1; i >= 0; --i) {
        xs[i] = initialValue;
      }

      return new PrefixIntervalTree(xs);
    }
  }, {
    key: 'empty',
    value: function empty(size) {
      return PrefixIntervalTree.uniform(size, 0);
    }
  }]);

  return PrefixIntervalTree;
})();

module.exports = PrefixIntervalTree;

/**
 * Number of elements in the array
 */

/**
 * Half the size of the heap. It is also the number of non-leaf nodes, and the
 * index of the first element in the heap. Always a power of 2.
 */

/**
 * Binary heap
 */