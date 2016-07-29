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

const PrefixIntervalTree = require('PrefixIntervalTree');
const clamp = require('clamp');

const BUFFER_ROWS = 5;
const NO_ROWS_SCROLL_RESULT = {
  index: 0,
  offset: 0,
  position: 0,
  contentHeight: 0,
};

class FixedDataTableScrollHelper {
  constructor(
    /*number*/ rowCount,
    /*number*/ defaultRowHeight,
    /*number*/ viewportHeight,
    /*?function*/ rowHeightGetter
  ) {
    this._rowOffsets = PrefixIntervalTree.uniform(rowCount, defaultRowHeight);
    this._storedHeights = new Array(rowCount);
    for (let i = 0; i < rowCount; ++i) {
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
    let top = firstRowOffset;
    let index = firstRowIndex;
    while (top <= this._viewportHeight && index < this._rowCount) {
      this._updateRowHeight(index);
      top += this._storedHeights[index];
      index++;
    }
  }

  _updateHeightsAboveViewport(/*number*/ firstRowIndex) {
    let index = firstRowIndex - 1;
    while (index >= 0 && index >= firstRowIndex - BUFFER_ROWS) {
      const delta = this._updateRowHeight(index);
      this._position += delta;
      index--;
    }
  }

  _updateRowHeight(/*number*/ rowIndex) /*number*/ {
    if (rowIndex < 0 || rowIndex >= this._rowCount) {
      return 0;
    }
    const newHeight = this._rowHeightGetter(rowIndex);
    if (newHeight !== this._storedHeights[rowIndex]) {
      const change = newHeight - this._storedHeights[rowIndex];
      this._rowOffsets.set(rowIndex, newHeight);
      this._storedHeights[rowIndex] = newHeight;
      this._contentHeight += change;
      return change;
    }
    return 0;
  }

  getRowPosition(/*number*/ rowIndex) /*number*/ {
    this._updateRowHeight(rowIndex);
    return this._rowOffsets.sumUntil(rowIndex);
  }

  scrollBy(/*number*/ delta) /*object*/ {
    if (this._rowCount === 0) {
      return NO_ROWS_SCROLL_RESULT;
    }
    let firstRow = this._rowOffsets.greatestLowerBound(this._position);
    firstRow = clamp(firstRow, 0, Math.max(this._rowCount - 1, 0));
    let firstRowPosition = this._rowOffsets.sumUntil(firstRow);
    let rowIndex = firstRow;
    let position = this._position;

    const rowHeightChange = this._updateRowHeight(rowIndex);
    if (firstRowPosition !== 0) {
      position += rowHeightChange;
    }
    let visibleRowHeight = this._storedHeights[rowIndex] -
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
      let invisibleRowHeight = this._storedHeights[rowIndex] - visibleRowHeight;

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
          const change = this._updateRowHeight(rowIndex);
          invisibleRowHeight = this._storedHeights[rowIndex];
          position += change;
        }
      }
    }

    const maxPosition = this._contentHeight - this._viewportHeight;
    position = clamp(position, 0, maxPosition);
    this._position = position;
    let firstRowIndex = this._rowOffsets.greatestLowerBound(position);
    firstRowIndex = clamp(firstRowIndex, 0, Math.max(this._rowCount - 1, 0));
    firstRowPosition = this._rowOffsets.sumUntil(firstRowIndex);
    const firstRowOffset = firstRowPosition - position;

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
    let currentRowIndex = rowIndex;
    let top = this._storedHeights[currentRowIndex];
    while (top < this._viewportHeight && currentRowIndex >= 0) {
      currentRowIndex--;
      if (currentRowIndex >= 0) {
        this._updateRowHeight(currentRowIndex);
        top += this._storedHeights[currentRowIndex];
      }
    }
    let position = this._rowOffsets.sumTo(rowIndex) - this._viewportHeight;
    if (position < 0) {
      position = 0;
    }
    return position;
  }

  scrollTo(/*number*/ position) /*object*/ {
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
        contentHeight: this._contentHeight,
      };
    } else if (position >= this._contentHeight - this._viewportHeight) {
      // If position is equal to or greater than max scroll value, we need
      // to make sure to have bottom border of last row visible.
      const rowIndex = this._rowCount - 1;
      position = this._getRowAtEndPosition(rowIndex);
    }
    this._position = position;

    let firstRowIndex = this._rowOffsets.greatestLowerBound(position);
    firstRowIndex = clamp(firstRowIndex, 0, Math.max(this._rowCount - 1, 0));
    const firstRowPosition = this._rowOffsets.sumUntil(firstRowIndex);
    const firstRowOffset = firstRowPosition - position;

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
    rowIndex = clamp(rowIndex, 0, Math.max(this._rowCount - 1, 0));
    offset = clamp(offset, -this._storedHeights[rowIndex], 0);
    const firstRow = this._rowOffsets.sumUntil(rowIndex);
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
  scrollRowIntoView(/*number*/ rowIndex) /*object*/ {
    rowIndex = clamp(rowIndex, 0, Math.max(this._rowCount - 1, 0));
    const rowBegin = this._rowOffsets.sumUntil(rowIndex);
    const rowEnd = rowBegin + this._storedHeights[rowIndex];
    if (rowBegin < this._position) {
      return this.scrollTo(rowBegin);
    } else if (this._position + this._viewportHeight < rowEnd) {
      const position = this._getRowAtEndPosition(rowIndex);
      return this.scrollTo(position);
    }
    return this.scrollTo(this._position);
  }

  getLastRowIndex(
    firstRowIndex: number,
    firstRowOffset: number,
    viewportHeight: number,
  ) {
    const top = this._rowOffsets.sumUntil(firstRowIndex) - firstRowOffset;
    const bottom = top + viewportHeight;
    return this._rowOffsets.leastUpperBound(bottom);
  }

  getViewportHeight(): number {
    return this._viewportHeight;
  }
}

module.exports = FixedDataTableScrollHelper;
