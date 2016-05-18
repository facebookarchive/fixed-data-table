/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableRowBuffer
 * @typechecks
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var IntegerBufferSet = require('./IntegerBufferSet');

var clamp = require('./clamp');
var invariant = require('./invariant');
var MIN_BUFFER_ROWS = 3;
var MAX_BUFFER_ROWS = 6;

// FixedDataTableRowBuffer is a helper class that executes row buffering
// logic for FixedDataTable. It figures out which rows should be rendered
// and in which positions.

var FixedDataTableRowBuffer = (function () {
  function FixedDataTableRowBuffer(
  /*number*/rowsCount,
  /*number*/defaultRowHeight,
  /*number*/viewportHeight,
  /*?function*/rowHeightGetter) {
    _classCallCheck(this, FixedDataTableRowBuffer);

    invariant(defaultRowHeight !== 0, "defaultRowHeight musn't be equal 0 in FixedDataTableRowBuffer");

    this._bufferSet = new IntegerBufferSet();
    this._defaultRowHeight = defaultRowHeight;
    this._viewportRowsBegin = 0;
    this._viewportRowsEnd = 0;
    this._maxVisibleRowCount = Math.ceil(viewportHeight / defaultRowHeight) + 1;
    this._bufferRowsCount = clamp(Math.floor(this._maxVisibleRowCount / 2), MIN_BUFFER_ROWS, MAX_BUFFER_ROWS);
    this._rowsCount = rowsCount;
    this._rowHeightGetter = rowHeightGetter;
    this._rows = [];
    this._viewportHeight = viewportHeight;

    this.getRows = this.getRows.bind(this);
    this.getRowsWithUpdatedBuffer = this.getRowsWithUpdatedBuffer.bind(this);
  }

  _createClass(FixedDataTableRowBuffer, [{
    key: 'getRowsWithUpdatedBuffer',
    value: function getRowsWithUpdatedBuffer() /*array*/{
      var remainingBufferRows = 2 * this._bufferRowsCount;
      var bufferRowIndex = Math.max(this._viewportRowsBegin - this._bufferRowsCount, 0);
      while (bufferRowIndex < this._viewportRowsBegin) {
        this._addRowToBuffer(bufferRowIndex, this._viewportRowsBegin, this._viewportRowsEnd - 1);
        bufferRowIndex++;
        remainingBufferRows--;
      }
      bufferRowIndex = this._viewportRowsEnd;
      while (bufferRowIndex < this._rowsCount && remainingBufferRows > 0) {
        this._addRowToBuffer(bufferRowIndex, this._viewportRowsBegin, this._viewportRowsEnd - 1);
        bufferRowIndex++;
        remainingBufferRows--;
      }
      return this._rows;
    }
  }, {
    key: 'getRows',
    value: function getRows(
    /*number*/firstRowIndex,
    /*number*/firstRowOffset) /*array*/{
      var top = firstRowOffset;
      var totalHeight = top;
      var rowIndex = firstRowIndex;
      var endIndex = Math.min(firstRowIndex + this._maxVisibleRowCount, this._rowsCount);

      this._viewportRowsBegin = firstRowIndex;
      while (rowIndex < endIndex || totalHeight < this._viewportHeight && rowIndex < this._rowsCount) {
        this._addRowToBuffer(rowIndex, firstRowIndex, endIndex - 1);
        totalHeight += this._rowHeightGetter(rowIndex);
        ++rowIndex;
        // Store index after the last viewport row as end, to be able to
        // distinguish when there are no rows rendered in viewport
        this._viewportRowsEnd = rowIndex;
      }

      return this._rows;
    }
  }, {
    key: '_addRowToBuffer',
    value: function _addRowToBuffer(
    /*number*/rowIndex,
    /*number*/firstViewportRowIndex,
    /*number*/lastViewportRowIndex) {
      var rowPosition = this._bufferSet.getValuePosition(rowIndex);
      var viewportRowsCount = lastViewportRowIndex - firstViewportRowIndex + 1;
      var allowedRowsCount = viewportRowsCount + this._bufferRowsCount * 2;
      if (rowPosition === null && this._bufferSet.getSize() >= allowedRowsCount) {
        rowPosition = this._bufferSet.replaceFurthestValuePosition(firstViewportRowIndex, lastViewportRowIndex, rowIndex);
      }
      if (rowPosition === null) {
        // We can't reuse any of existing positions for this row. We have to
        // create new position
        rowPosition = this._bufferSet.getNewPositionForValue(rowIndex);
        this._rows[rowPosition] = rowIndex;
      } else {
        // This row already is in the table with rowPosition position or it
        // can replace row that is in that position
        this._rows[rowPosition] = rowIndex;
      }
    }
  }]);

  return FixedDataTableRowBuffer;
})();

module.exports = FixedDataTableRowBuffer;