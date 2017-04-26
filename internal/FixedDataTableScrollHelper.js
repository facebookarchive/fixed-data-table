/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableScrollHelper
 * @typechecks
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PrefixIntervalTree = require('./PrefixIntervalTree');
var clamp = require('./clamp');

var BUFFER_ROWS = 5;
var NO_ROWS_SCROLL_RESULT = {
  index: 0,
  offset: 0,
  position: 0,
  contentHeight: 0
};

var FixedDataTableScrollHelper = (function () {
  function FixedDataTableScrollHelper(
  /*number*/rowCount,
  /*number*/defaultRowHeight,
  /*number*/viewportHeight,
  /*?function*/rowHeightGetter) {
    _classCallCheck(this, FixedDataTableScrollHelper);

    this._rowOffsets = PrefixIntervalTree.uniform(rowCount, defaultRowHeight);
    this._storedHeights = new Array(rowCount);
    for (var i = 0; i < rowCount; ++i) {
      this._storedHeights[i] = defaultRowHeight;
    }
    this._rowCount = rowCount;
    this._position = 0;
    this._contentHeight = rowCount * defaultRowHeight;
    this._defaultRowHeight = defaultRowHeight;
    this._rowHeightGetter = rowHeightGetter ? rowHeightGetter : function () {
      return defaultRowHeight;
    };
    this._viewportHeight = viewportHeight;
    this.scrollRowIntoView = this.scrollRowIntoView.bind(this);
    this.setViewportHeight = this.setViewportHeight.bind(this);
    this.scrollBy = this.scrollBy.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
    this.setRowHeightGetter = this.setRowHeightGetter.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);
    this.getRowPosition = this.getRowPosition.bind(this);

    this._updateHeightsInViewport(0, 0);
  }

  _createClass(FixedDataTableScrollHelper, [{
    key: 'setRowHeightGetter',
    value: function setRowHeightGetter( /*function*/rowHeightGetter) {
      this._rowHeightGetter = rowHeightGetter;
    }
  }, {
    key: 'setViewportHeight',
    value: function setViewportHeight( /*number*/viewportHeight) {
      this._viewportHeight = viewportHeight;
    }
  }, {
    key: 'getContentHeight',
    value: function getContentHeight() /*number*/{
      return this._contentHeight;
    }
  }, {
    key: '_updateHeightsInViewport',
    value: function _updateHeightsInViewport(
    /*number*/firstRowIndex,
    /*number*/firstRowOffset) {
      var top = firstRowOffset;
      var index = firstRowIndex;
      while (top <= this._viewportHeight && index < this._rowCount) {
        this._updateRowHeight(index);
        top += this._storedHeights[index];
        index++;
      }
    }
  }, {
    key: '_updateHeightsAboveViewport',
    value: function _updateHeightsAboveViewport( /*number*/firstRowIndex) {
      var index = firstRowIndex - 1;
      while (index >= 0 && index >= firstRowIndex - BUFFER_ROWS) {
        var delta = this._updateRowHeight(index);
        this._position += delta;
        index--;
      }
    }
  }, {
    key: '_updateRowHeight',
    value: function _updateRowHeight( /*number*/rowIndex) /*number*/{
      if (rowIndex < 0 || rowIndex >= this._rowCount) {
        return 0;
      }
      var newHeight = this._rowHeightGetter(rowIndex);
      if (newHeight !== this._storedHeights[rowIndex]) {
        var change = newHeight - this._storedHeights[rowIndex];
        this._rowOffsets.set(rowIndex, newHeight);
        this._storedHeights[rowIndex] = newHeight;
        this._contentHeight += change;
        return change;
      }
      return 0;
    }
  }, {
    key: 'getRowPosition',
    value: function getRowPosition( /*number*/rowIndex) /*number*/{
      this._updateRowHeight(rowIndex);
      return this._rowOffsets.sumUntil(rowIndex);
    }
  }, {
    key: 'scrollBy',
    value: function scrollBy( /*number*/delta) /*object*/{
      if (this._rowCount === 0) {
        return NO_ROWS_SCROLL_RESULT;
      }
      var firstRow = this._rowOffsets.greatestLowerBound(this._position);
      firstRow = clamp(firstRow, 0, Math.max(this._rowCount - 1, 0));
      var firstRowPosition = this._rowOffsets.sumUntil(firstRow);
      var rowIndex = firstRow;
      var position = this._position;

      var rowHeightChange = this._updateRowHeight(rowIndex);
      if (firstRowPosition !== 0) {
        position += rowHeightChange;
      }
      var visibleRowHeight = this._storedHeights[rowIndex] - (position - firstRowPosition);

      if (delta >= 0) {

        while (delta > 0 && rowIndex < this._rowCount) {
          if (delta < visibleRowHeight) {
            position += delta;
            delta = 0;
          } else {
            delta -= visibleRowHeight;
            position += visibleRowHeight;
            rowIndex++;
          }
          if (rowIndex < this._rowCount) {
            this._updateRowHeight(rowIndex);
            visibleRowHeight = this._storedHeights[rowIndex];
          }
        }
      } else if (delta < 0) {
        delta = -delta;
        var invisibleRowHeight = this._storedHeights[rowIndex] - visibleRowHeight;

        while (delta > 0 && rowIndex >= 0) {
          if (delta < invisibleRowHeight) {
            position -= delta;
            delta = 0;
          } else {
            position -= invisibleRowHeight;
            delta -= invisibleRowHeight;
            rowIndex--;
          }
          if (rowIndex >= 0) {
            var change = this._updateRowHeight(rowIndex);
            invisibleRowHeight = this._storedHeights[rowIndex];
            position += change;
          }
        }
      }

      var maxPosition = this._contentHeight - this._viewportHeight;
      position = clamp(position, 0, maxPosition);
      this._position = position;
      var firstRowIndex = this._rowOffsets.greatestLowerBound(position);
      firstRowIndex = clamp(firstRowIndex, 0, Math.max(this._rowCount - 1, 0));
      firstRowPosition = this._rowOffsets.sumUntil(firstRowIndex);
      var firstRowOffset = firstRowPosition - position;

      this._updateHeightsInViewport(firstRowIndex, firstRowOffset);
      this._updateHeightsAboveViewport(firstRowIndex);

      return {
        index: firstRowIndex,
        offset: firstRowOffset,
        position: this._position,
        contentHeight: this._contentHeight
      };
    }
  }, {
    key: '_getRowAtEndPosition',
    value: function _getRowAtEndPosition( /*number*/rowIndex) /*number*/{
      // We need to update enough rows above the selected one to be sure that when
      // we scroll to selected position all rows between first shown and selected
      // one have most recent heights computed and will not resize
      this._updateRowHeight(rowIndex);
      var currentRowIndex = rowIndex;
      var top = this._storedHeights[currentRowIndex];
      while (top < this._viewportHeight && currentRowIndex >= 0) {
        currentRowIndex--;
        if (currentRowIndex >= 0) {
          this._updateRowHeight(currentRowIndex);
          top += this._storedHeights[currentRowIndex];
        }
      }
      var position = this._rowOffsets.sumTo(rowIndex) - this._viewportHeight;
      if (position < 0) {
        position = 0;
      }
      return position;
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo( /*number*/position) /*object*/{
      if (this._rowCount === 0) {
        return NO_ROWS_SCROLL_RESULT;
      }
      if (position <= 0) {
        // If position less than or equal to 0 first row should be fully visible
        // on top
        this._position = 0;
        this._updateHeightsInViewport(0, 0);

        return {
          index: 0,
          offset: 0,
          position: this._position,
          contentHeight: this._contentHeight
        };
      } else if (position >= this._contentHeight - this._viewportHeight) {
        // If position is equal to or greater than max scroll value, we need
        // to make sure to have bottom border of last row visible.
        var rowIndex = this._rowCount - 1;
        position = this._getRowAtEndPosition(rowIndex);
      }
      this._position = position;

      var firstRowIndex = this._rowOffsets.greatestLowerBound(position);
      firstRowIndex = clamp(firstRowIndex, 0, Math.max(this._rowCount - 1, 0));
      var firstRowPosition = this._rowOffsets.sumUntil(firstRowIndex);
      var firstRowOffset = firstRowPosition - position;

      this._updateHeightsInViewport(firstRowIndex, firstRowOffset);
      this._updateHeightsAboveViewport(firstRowIndex);

      return {
        index: firstRowIndex,
        offset: firstRowOffset,
        position: this._position,
        contentHeight: this._contentHeight
      };
    }

    /**
     * Allows to scroll to selected row with specified offset. It always
     * brings that row to top of viewport with that offset
     */
  }, {
    key: 'scrollToRow',
    value: function scrollToRow( /*number*/rowIndex, /*number*/offset) /*object*/{
      rowIndex = clamp(rowIndex, 0, Math.max(this._rowCount - 1, 0));
      offset = clamp(offset, -this._storedHeights[rowIndex], 0);
      var firstRow = this._rowOffsets.sumUntil(rowIndex);
      return this.scrollTo(firstRow - offset);
    }

    /**
     * Allows to scroll to selected row by bringing it to viewport with minimal
     * scrolling. This that if row is fully visible, scroll will not be changed.
     * If top border of row is above top of viewport it will be scrolled to be
     * fully visible on the top of viewport. If the bottom border of row is
     * below end of viewport, it will be scrolled up to be fully visible on the
     * bottom of viewport.
     */
  }, {
    key: 'scrollRowIntoView',
    value: function scrollRowIntoView( /*number*/rowIndex) /*object*/{
      rowIndex = clamp(rowIndex, 0, Math.max(this._rowCount - 1, 0));
      var rowBegin = this._rowOffsets.sumUntil(rowIndex);
      var rowEnd = rowBegin + this._storedHeights[rowIndex];
      if (rowBegin < this._position) {
        return this.scrollTo(rowBegin);
      } else if (this._position + this._viewportHeight < rowEnd) {
        var position = this._getRowAtEndPosition(rowIndex);
        return this.scrollTo(position);
      }
      return this.scrollTo(this._position);
    }
  }]);

  return FixedDataTableScrollHelper;
})();

module.exports = FixedDataTableScrollHelper;