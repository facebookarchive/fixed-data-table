/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Heap
 * @typechecks
 * @preventMunge
 */

'use strict';

/*
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function defaultComparator(a, b) {
  return a < b;
}

var Heap = (function () {
  function Heap(items, comparator) {
    _classCallCheck(this, Heap);

    this._items = items || [];
    this._size = this._items.length;
    this._comparator = comparator || defaultComparator;
    this._heapify();
  }

  /*
   * @return {boolean}
   */

  _createClass(Heap, [{
    key: 'empty',
    value: function empty() {
      return this._size === 0;
    }

    /*
     * @return {*}
     */
  }, {
    key: 'pop',
    value: function pop() {
      if (this._size === 0) {
        return;
      }

      var elt = this._items[0];

      var lastElt = this._items.pop();
      this._size--;

      if (this._size > 0) {
        this._items[0] = lastElt;
        this._sinkDown(0);
      }

      return elt;
    }

    /*
     * @param {*} item
     */
  }, {
    key: 'push',
    value: function push(item) {
      this._items[this._size++] = item;
      this._bubbleUp(this._size - 1);
    }

    /*
     * @return {number}
     */
  }, {
    key: 'size',
    value: function size() {
      return this._size;
    }

    /*
     * @return {*}
     */
  }, {
    key: 'peek',
    value: function peek() {
      if (this._size === 0) {
        return;
      }

      return this._items[0];
    }
  }, {
    key: '_heapify',
    value: function _heapify() {
      for (var index = Math.floor((this._size + 1) / 2); index >= 0; index--) {
        this._sinkDown(index);
      }
    }

    /*
     * @parent {number} index
     */
  }, {
    key: '_bubbleUp',
    value: function _bubbleUp(index) {
      var elt = this._items[index];
      while (index > 0) {
        var parentIndex = Math.floor((index + 1) / 2) - 1;
        var parentElt = this._items[parentIndex];

        // if parentElt < elt, stop
        if (this._comparator(parentElt, elt)) {
          return;
        }

        // swap
        this._items[parentIndex] = elt;
        this._items[index] = parentElt;
        index = parentIndex;
      }
    }

    /*
     * @parent {number} index
     */
  }, {
    key: '_sinkDown',
    value: function _sinkDown(index) {
      var elt = this._items[index];

      while (true) {
        var leftChildIndex = 2 * (index + 1) - 1;
        var rightChildIndex = 2 * (index + 1);
        var swapIndex = -1;

        if (leftChildIndex < this._size) {
          var leftChild = this._items[leftChildIndex];
          if (this._comparator(leftChild, elt)) {
            swapIndex = leftChildIndex;
          }
        }

        if (rightChildIndex < this._size) {
          var rightChild = this._items[rightChildIndex];
          if (this._comparator(rightChild, elt)) {
            if (swapIndex === -1 || this._comparator(rightChild, this._items[swapIndex])) {
              swapIndex = rightChildIndex;
            }
          }
        }

        // if we don't have a swap, stop
        if (swapIndex === -1) {
          return;
        }

        this._items[index] = this._items[swapIndex];
        this._items[swapIndex] = elt;
        index = swapIndex;
      }
    }
  }]);

  return Heap;
})();

module.exports = Heap;