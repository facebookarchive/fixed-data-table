/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PrefixIntervalTree
 * @typechecks
 */

"use strict";

/**
 * An interval tree that allows to set a number at index and given the value
 * find the largest index for which prefix sum is greater than or equal to value
 * (lower bound) or greater than value (upper bound)
 * Complexity:
 *   construct: O(n)
 *   query: O(log(n))
 *   memory: O(log(n)),
 * where n is leafCount from the constructor
 */
class PrefixIntervalTree {
  constructor(/*number*/ leafCount, /*?number*/ initialLeafValue) {
    var internalLeafCount = this.getInternalLeafCount(leafCount);
    this._leafCount = leafCount;
    this._internalLeafCount = internalLeafCount;
    var nodeCount = 2 * internalLeafCount;
    var Int32Array = global.Int32Array || Array;
    this._value = new Int32Array(nodeCount);
    this._initTables(initialLeafValue || 0);

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.lowerBound = this.lowerBound.bind(this);
    this.upperBound = this.upperBound.bind(this);
  }

  getInternalLeafCount(/*number*/ leafCount) /*number*/ {
    var internalLeafCount = 1;
    while (internalLeafCount < leafCount) {
      internalLeafCount *= 2;
    }
    return internalLeafCount;
  }

  _initTables(/*number*/ initialLeafValue) {
    var firstLeaf = this._internalLeafCount;
    var lastLeaf = this._internalLeafCount + this._leafCount - 1;
    var i;
    for (i = firstLeaf; i <= lastLeaf; ++i) {
      this._value[i] = initialLeafValue;
    }
    var lastInternalNode = this._internalLeafCount - 1;
    for (i = lastInternalNode; i > 0; --i) {
      this._value[i] =  this._value[2 * i] + this._value[2 * i + 1];
    }
  }

  set(/*number*/ position, /*number*/ value) {
    var nodeIndex = position + this._internalLeafCount;
    this._value[nodeIndex] = value;
    nodeIndex = Math.floor(nodeIndex / 2);
    while (nodeIndex !== 0) {
      this._value[nodeIndex] =
        this._value[2 * nodeIndex] + this._value[2 * nodeIndex + 1];
      nodeIndex = Math.floor(nodeIndex / 2);
    }
  }

  /**
   * Returns an object {index, value} for given position (including value at
   * specified position), or the same for last position if provided position
   * is out of range
   */
  get(/*number*/ position) /*object*/ {
    position = Math.min(position, this._leafCount);
    var nodeIndex = position + this._internalLeafCount;
    var result = this._value[nodeIndex];
    while (nodeIndex > 1) {
      if (nodeIndex % 2 === 1) {
        result = this._value[nodeIndex - 1] + result;
      }
      nodeIndex = Math.floor(nodeIndex / 2);
    }
    return {index: position, value: result};
  }

  /**
   * Returns an object {index, value} where index is index of leaf that was
   * found by upper bound algorithm. Upper bound finds first element for which
   * value is greater than argument
   */
  upperBound(/*number*/ value) /*object*/ {
    var result = this._upperBoundImpl(1, 0, this._internalLeafCount - 1, value);
    if (result.index > this._leafCount - 1) {
      result.index = this._leafCount - 1;
    }
    return result;
  }

  /**
   * Returns result in the same format as upperBound, but finds first element
   * for which value is greater than or equal to argument
   */
  lowerBound(/*number*/ value) /*object*/ {
    var result = this.upperBound(value);
    if (result.value > value && result.index > 0) {
      var previousValue =
        result.value - this._value[this._internalLeafCount + result.index];
      if (previousValue === value) {
        result.value = previousValue;
        result.index--;
      }
    }
    return result;
  }

  _upperBoundImpl(
    /*number*/ nodeIndex,
    /*number*/ nodeIntervalBegin,
    /*number*/ nodeIntervalEnd,
    /*number*/ value
  ) /*object*/ {
    if (nodeIntervalBegin === nodeIntervalEnd) {
      return {
        index: nodeIndex - this._internalLeafCount,
        value: this._value[nodeIndex],
      };
    }

    var nodeIntervalMidpoint =
      Math.floor((nodeIntervalBegin + nodeIntervalEnd + 1) / 2);
    if (value < this._value[nodeIndex * 2]) {
      return this._upperBoundImpl(
        2 * nodeIndex,
        nodeIntervalBegin,
        nodeIntervalMidpoint - 1,
        value
      );
    } else {
      var result = this._upperBoundImpl(
        2 * nodeIndex + 1,
        nodeIntervalMidpoint,
        nodeIntervalEnd,
        value - this._value[2 * nodeIndex]
      );
      result.value += this._value[2 * nodeIndex];
      return result;
    }
  }
}

module.exports = PrefixIntervalTree;
