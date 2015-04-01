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

var PrefixIntervalTree = require('PrefixIntervalTree');
var clamp = require('clamp');

var BUFFER_ROWS = 5;

class FixedDataTableScrollHelper {
  constructor(
    /*number*/ rowCount,
    /*number*/ defaultRowHeight,
    /*number*/ viewportHeight,
    /*?function*/ rowHeightGetter
  ) {
    this._rowOffsets = new PrefixIntervalTree(rowCount, defaultRowHeight);
    this._storedHeights = new Array(rowCount);
    for (var i = 0; i < rowCount; ++i) {
      this._storedHeights[i] = defaultRowHeight;
    }
    this._rowCount = rowCount;
    this._position = 0;
    this._contentHeight = rowCount * defaultRowHeight;
    this._defaultRowHeight = defaultRowHeight;
    this._rowHeightGetter = rowHeightGetter ?
      rowHeightGetter :
      () => defaultRowHeight;
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

  setRowHeightGetter(/*function*/ rowHeightGetter) {
    this._rowHeightGetter = rowHeightGetter;
  }

  setViewportHeight(/*number*/ viewportHeight) {
    this._viewportHeight = viewportHeight;
  }

  getContentHeight() /*number*/ {
    return this._contentHeight;
  }

  _updateHeightsInViewport(
    /*number*/ firstRowIndex,
    /*number*/ firstRowOffset
  ) {
    var top = firstRowOffset;
    var index = firstRowIndex;
    while (top <= this._viewportHeight && index < this._rowCount) {
      this._updateRowHeight(index);
      top += this._storedHeights[index];
      index++;
    }
  }

  _updateHeightsAboveViewport(/*number*/ firstRowIndex) {
    var index = firstRowIndex - 1;
    while (index >= 0 && index >= firstRowIndex - BUFFER_ROWS) {
      var delta = this._updateRowHeight(index);
      this._position += delta;
      index--;
    }
  }

  _updateRowHeight(/*number*/ rowIndex) /*number*/ {
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

  getRowPosition(/*number*/ rowIndex) /*number*/ {
    return (
      this._rowOffsets.get(rowIndex).value - this._rowHeightGetter(rowIndex)
    );
  }

  scrollBy(/*number*/ delta) /*object*/ {
    var firstRow = this._rowOffsets.upperBound(this._position);
    var firstRowPosition =
      firstRow.value - this._storedHeights[firstRow.index];
    var rowIndex = firstRow.index;
    var position = this._position;

    var rowHeightChange = this._updateRowHeight(rowIndex);
    if (firstRowPosition !== 0) {
      position += rowHeightChange;
    }
    var visibleRowHeight = this._storedHeights[rowIndex] -
      (position - firstRowPosition);

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
    position = clamp(0, position, maxPosition);
    this._position = position;
    var firstVisibleRow = this._rowOffsets.upperBound(position);
    var firstRowIndex = firstVisibleRow.index;
    firstRowPosition =
      firstVisibleRow.value - this._rowHeightGetter(firstRowIndex);
    var firstRowOffset = firstRowPosition - position;

    this._updateHeightsInViewport(firstRowIndex, firstRowOffset);
    this._updateHeightsAboveViewport(firstRowIndex);

    return {
      index: firstRowIndex,
      offset: firstRowOffset,
      position: this._position,
      contentHeight: this._contentHeight,
    };
  }

  _getRowAtEndPosition(/*number*/ rowIndex) /*number*/ {
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
    var position = this._rowOffsets.get(rowIndex).value - this._viewportHeight;
    if (position < 0) {
      position = 0;
    }
    return position;
  }

  scrollTo(/*number*/ position) /*object*/ {
    if (position <= 0) {
      // If position less than or equal to 0 first row should be fully visible
      // on top
      this._position = 0;
      this._updateHeightsInViewport(0, 0);

      return {
        index: 0,
        offset: 0,
        position: this._position,
        contentHeight: this._contentHeight,
      };
    } else if (position >= this._contentHeight - this._viewportHeight) {
      // If position is equal to or greater than max scroll value, we need
      // to make sure to have bottom border of last row visible.
      var rowIndex = this._rowCount - 1;
      position = this._getRowAtEndPosition(rowIndex);
    }
    this._position = position;

    var firstVisibleRow = this._rowOffsets.upperBound(position);
    var firstRowIndex = Math.max(firstVisibleRow.index, 0);
    var firstRowPosition =
      firstVisibleRow.value - this._rowHeightGetter(firstRowIndex);
    var firstRowOffset = firstRowPosition - position;

    this._updateHeightsInViewport(firstRowIndex, firstRowOffset);
    this._updateHeightsAboveViewport(firstRowIndex);

    return {
      index: firstRowIndex,
      offset: firstRowOffset,
      position: this._position,
      contentHeight: this._contentHeight,
    };
  }

  /**
   * Allows to scroll to selected row with specified offset. It always
   * brings that row to top of viewport with that offset
   */
  scrollToRow(/*number*/ rowIndex, /*number*/ offset) /*object*/ {
    rowIndex = clamp(0, rowIndex, this._rowCount - 1);
    offset = clamp(-this._storedHeights[rowIndex], offset, 0);
    var firstRow = this._rowOffsets.get(rowIndex);
    return this.scrollTo(
      firstRow.value - this._storedHeights[rowIndex] - offset
    );
  }

  /**
   * Allows to scroll to selected row by bringing it to viewport with minimal
   * scrolling. This that if row is fully visible, scroll will not be changed.
   * If top border of row is above top of viewport it will be scrolled to be
   * fully visible on the top of viewport. If the bottom border of row is
   * below end of viewport, it will be scrolled up to be fully visible on the
   * bottom of viewport.
   */
  scrollRowIntoView(/*number*/ rowIndex) /*object*/ {
    rowIndex = clamp(0, rowIndex, this._rowCount - 1);
    var rowEnd = this._rowOffsets.get(rowIndex).value;
    var rowBegin = rowEnd - this._storedHeights[rowIndex];
    if (rowBegin < this._position) {
      return this.scrollTo(rowBegin);
    } else if (rowEnd > this._position + this._viewportHeight) {
      var position = this._getRowAtEndPosition(rowIndex);
      return this.scrollTo(position);
    }
    return this.scrollTo(this._position);
  }
}

module.exports = FixedDataTableScrollHelper;
