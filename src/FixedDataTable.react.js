/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTable.react
 * @typechecks
 */

/* jslint bitwise: true */

var FixedDataTableHelper = require('FixedDataTableHelper');
var Locale = require('Locale');
var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var ReactWheelHandler = require('ReactWheelHandler');
var Scrollbar = require('Scrollbar.react');
var FixedDataTableBufferedRows = require('FixedDataTableBufferedRows.react');
var FixedDataTableColumnResizeHandle = require('FixedDataTableColumnResizeHandle.react');
var FixedDataTableRow = require('FixedDataTableRow.react');
var FixedDataTableScrollHelper = require('FixedDataTableScrollHelper');
var FixedDataTableWidthHelper = require('FixedDataTableWidthHelper');

var cloneWithProps = require('cloneWithProps');
var cx = require('cx');
var debounceCore = require('debounceCore');
var emptyFunction = require('emptyFunction');
var invariant = require('invariant');
var shallowEqual = require('shallowEqual');
var translateDOMPositionXY = require('translateDOMPositionXY');

var {PropTypes} = React;
var ReactChildren = React.Children;

var renderToString = FixedDataTableHelper.renderToString;
var EMPTY_OBJECT = {};
var BORDER_HEIGHT = 1;

/**
 * Data grid component with fixed or scrollable header and columns.
 *
 * The layout of the data table is as follows:
 *
 * ```
 * +---------------------------------------------------+
 * | Fixed Column Group    | Scrollable Column Group   |
 * | Header                | Header                    |
 * |                       |                           |
 * +---------------------------------------------------+
 * |                       |                           |
 * | Fixed Header Columns  | Scrollable Header Columns |
 * |                       |                           |
 * +-----------------------+---------------------------+
 * |                       |                           |
 * | Fixed Body Columns    | Scrollable Body Columns   |
 * |                       |                           |
 * +-----------------------+---------------------------+
 * |                       |                           |
 * | Fixed Footer Columns  | Scrollable Footer Columns |
 * |                       |                           |
 * +-----------------------+---------------------------+
 * ```
 *
 * - Fixed Column Group Header: These are the headers for a group
 *   of columns if included in the table that do not scroll
 *   vertically or horizontally.
 *
 * - Scrollable Column Group Header: The header for a group of columns
 *   that do not move while scrolling vertically, but move horizontally
 *   with the horizontal scrolling.
 *
 * - Fixed Header Columns: The header columns that do not move while scrolling
 *   vertically or horizontally.
 *
 * - Scrollable Header Columns: The header columns that do not move
 *   while scrolling vertically, but move horizontally with the horizontal
 *   scrolling.
 *
 * - Fixed Body Columns: The body columns that do not move while scrolling
 *   horizontally, but move vertically with the vertical scrolling.
 *
 * - Scrollable Body Columns: The body columns that move while scrolling
 *   vertically or horizontally.
 */
var FixedDataTable = React.createClass({

  propTypes: {

    /**
     * Pixel width of table. If all columns do not fit,
     * a horizontal scrollbar will appear.
     */
    width: PropTypes.number.isRequired,

    /**
     * Pixel height of table. If all rows do not fit,
     * a vertical scrollbar will appear.
     *
     * Either `height` or `maxHeight` must be specified.
     */
    height: PropTypes.number,

    /**
     * Maximum pixel height of table. If all rows do not fit,
     * a vertical scrollbar will appear.
     *
     * Either `height` or `maxHeight` must be specified.
     */
    maxHeight: PropTypes.number,

    /**
     * Pixel height of table's owner, this is used in a managed scrolling
     * situation when you want to slide the table up from below the fold
     * without having to constantly update the height on every scroll tick.
     * Instead, vary this property on scroll. By using `ownerHeight`, we
     * over-render the table while making sure the footer and horizontal
     * scrollbar of the table are visible when the current space for the table
     * in view is smaller than the final, over-flowing height of table. It
     * allows us to avoid resizing and reflowing table when it is moving in the
     * view.
     *
     * This is used if `ownerHeight < height` (or `maxHeight`).
     */
    ownerHeight: PropTypes.number,

    overflowX: PropTypes.oneOf(['hidden', 'auto']),
    overflowY: PropTypes.oneOf(['hidden', 'auto']),

    /**
     * Number of rows in the table.
     */
    rowsCount: PropTypes.number.isRequired,

    /**
     * Pixel height of rows unless `rowHeightGetter` is specified and returns
     * different value.
     */
    rowHeight: PropTypes.number.isRequired,

    /**
     * If specified, `rowHeightGetter(index)` is called for each row and the
     * returned value overrides `rowHeight` for particular row.
     */
    rowHeightGetter: PropTypes.func,

    /**
     * To get rows to display in table, `rowGetter(index)`
     * is called. `rowGetter` should be smart enough to handle async
     * fetching of data and return temporary objects
     * while data is being fetched.
     */
    rowGetter: PropTypes.func.isRequired,

    /**
     * To get any additional CSS classes that should be added to a row,
     * `rowClassNameGetter(index)` is called.
     */
    rowClassNameGetter: PropTypes.func,

    /**
     * Pixel height of the column group header.
     */
    groupHeaderHeight: PropTypes.number,

    /**
     * Pixel height of header.
     */
    headerHeight: PropTypes.number.isRequired,

    /**
     * Function that is called to get the data for the header row.
     * If the function returns null, the header will be set to the
     * Column's label property.
     */
    headerDataGetter: PropTypes.func,

    /**
     * Pixel height of footer.
     */
    footerHeight: PropTypes.number,

    /**
     * DEPRECATED - use footerDataGetter instead.
     * Data that will be passed to footer cell renderers.
     */
    footerData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),

    /**
     * Function that is called to get the data for the footer row.
     */
    footerDataGetter: PropTypes.func,

    /**
     * Value of horizontal scroll.
     */
    scrollLeft: PropTypes.number,

    /**
     * Index of column to scroll to.
     */
    scrollToColumn: PropTypes.number,

    /**
     * Value of vertical scroll.
     */
    scrollTop: PropTypes.number,

    /**
     * Index of row to scroll to.
     */
    scrollToRow: PropTypes.number,

    /**
     * Callback that is called when scrolling starts with current horizontal
     * and vertical scroll values.
     */
    onScrollStart: PropTypes.func,

    /**
     * Callback that is called when scrolling ends or stops with new horizontal
     * and vertical scroll values.
     */
    onScrollEnd: PropTypes.func,

    /**
     * Callback that is called when `rowHeightGetter` returns a different height
     * for a row than the `rowHeight` prop. This is necessary because initially
     * table estimates heights of some parts of the content.
     */
    onContentHeightChange: PropTypes.func,

    /**
     * Callback that is called when a row is clicked.
     */
    onRowClick: PropTypes.func,

    /**
     * Callback that is called when a row is double clicked.
     */
    onRowDoubleClick: PropTypes.func,

    /**
     * Callback that is called when a mouse-down event happens on a row.
     */
    onRowMouseDown: PropTypes.func,

    /**
     * Callback that is called when a mouse-enter event happens on a row.
     */
    onRowMouseEnter: PropTypes.func,

    /**
     * Callback that is called when a mouse-leave event happens on a row.
     */
    onRowMouseLeave: PropTypes.func,

    /**
     * Callback that is called when resizer has been released
     * and column needs to be updated.
     *
     * Required if the isResizable property is true on any column.
     *
     * ```
     * function(
     *   newColumnWidth: number,
     *   dataKey: string,
     * )
     * ```
     */
    onColumnResizeEndCallback: PropTypes.func,

    /**
     * Whether a column is currently being resized.
     */
    isColumnResizing: PropTypes.bool,
  },

  getDefaultProps() /*object*/ {
    return {
      footerHeight: 0,
      groupHeaderHeight: 0,
      headerHeight: 0,
      scrollLeft: 0,
      scrollTop: 0,
    };
  },

  getInitialState() /*object*/ {
    var props = this.props;
    var viewportHeight = props.height -
      props.headerHeight -
      props.footerHeight -
      props.groupHeaderHeight;
    this._scrollHelper = new FixedDataTableScrollHelper(
      props.rowsCount,
      props.rowHeight,
      viewportHeight,
      props.rowHeightGetter
    );
    if (props.scrollTop) {
      this._scrollHelper.scrollTo(props.scrollTop);
    }
    this._didScrollStop = debounceCore(this._didScrollStop, 160, this);

    return this._calculateState(this.props);
  },

  componentWillMount() {
    var scrollToRow = this.props.scrollToRow;
    if (scrollToRow !== undefined && scrollToRow !== null) {
      this._rowToScrollTo = scrollToRow;
    }
    var scrollToColumn = this.props.scrollToColumn;
    if (scrollToColumn !== undefined && scrollToColumn !== null) {
      this._columnToScrollTo = scrollToColumn;
    }
    this._wheelHandler = new ReactWheelHandler(
      this._onWheel,
      this._shouldHandleWheelX,
      this._shouldHandleWheelY
    );
  },

  _shouldHandleWheelX(/*number*/ delta) /*boolean*/ {
    if (this.props.overflowX === 'hidden') {
      return false;
    }

    delta = Math.round(delta);
    if (delta === 0) {
      return false;
    }

    return(
      (delta < 0 && this.state.scrollX > 0) ||
      (delta >= 0 && this.state.scrollX < this.state.maxScrollX)
    );
  },

  _shouldHandleWheelY(/*number*/ delta) /*boolean*/ {
    if (this.props.overflowY === 'hidden'|| delta === 0) {
      return false;
    }

    delta = Math.round(delta);
    if (delta === 0) {
      return false;
    }

    return(
      (delta < 0 && this.state.scrollY > 0) ||
      (delta >= 0 && this.state.scrollY < this.state.maxScrollY)
    );
  },

  _reportContentHeight() {
    var scrollContentHeight = this.state.scrollContentHeight;
    var reservedHeight = this.state.reservedHeight;
    var requiredHeight = scrollContentHeight + reservedHeight;
    var contentHeight;
    var useMaxHeight = this.props.height === undefined;
    if (useMaxHeight && this.props.maxHeight > requiredHeight) {
      contentHeight = requiredHeight;
    } else if (this.state.height > requiredHeight && this.props.ownerHeight) {
      contentHeight = Math.max(requiredHeight, this.props.ownerHeight);
    } else {
      contentHeight = this.state.height + this.state.maxScrollY;
    }
    if (contentHeight !== this._contentHeight &&
        this.props.onContentHeightChange) {
      this.props.onContentHeightChange(contentHeight);
    }
    this._contentHeight = contentHeight;
  },

  componentDidMount() {
    this._reportContentHeight();
  },

  componentWillReceiveProps(/*object*/ nextProps) {
    var scrollToRow = nextProps.scrollToRow;
    if (scrollToRow !== undefined && scrollToRow !== null) {
      this._rowToScrollTo = scrollToRow;
    }
    var scrollToColumn = nextProps.scrollToColumn;
    if (scrollToColumn !== undefined && scrollToColumn !== null) {
      this._columnToScrollTo = scrollToColumn;
    }

    var newOverflowX = nextProps.overflowX;
    var newOverflowY = nextProps.overflowY;
    if (newOverflowX !== this.props.overflowX ||
        newOverflowY !== this.props.overflowY) {
      this._wheelHandler = new ReactWheelHandler(
        this._onWheel,
        newOverflowX !== 'hidden', // Should handle horizontal scroll
        newOverflowY !== 'hidden' // Should handle vertical scroll
      );
    }

    this.setState(this._calculateState(nextProps, this.state));
  },

  componentDidUpdate() {
    this._reportContentHeight();
  },

  render() /*object*/ {
    var state = this.state;
    var props = this.props;

    var groupHeader;
    if (state.useGroupHeader) {
      groupHeader = (
        <FixedDataTableRow
          key="group_header"
          className={cx('public/fixedDataTable/header')}
          data={state.groupHeaderData}
          width={state.width}
          height={state.groupHeaderHeight}
          index={0}
          zIndex={1}
          offsetTop={0}
          scrollLeft={state.scrollX}
          fixedColumns={state.groupHeaderFixedColumns}
          scrollableColumns={state.groupHeaderScrollableColumns}
        />
      );
    }

    var maxScrollY = this.state.maxScrollY;
    var showScrollbarX = state.maxScrollX > 0 && state.overflowX !== 'hidden';
    var showScrollbarY = maxScrollY > 0 && state.overflowY !== 'hidden';
    var scrollbarXHeight = showScrollbarX ? Scrollbar.SIZE : 0;
    var scrollbarYHeight = state.height - scrollbarXHeight - (2 * BORDER_HEIGHT) - state.footerHeight;

    var headerOffsetTop = state.useGroupHeader ? state.groupHeaderHeight : 0;
    var bodyOffsetTop = headerOffsetTop + state.headerHeight;
    scrollbarYHeight -= bodyOffsetTop;
    var bottomSectionOffset = 0;
    var footOffsetTop = props.maxHeight != null
      ? bodyOffsetTop + state.bodyHeight
      : bodyOffsetTop + scrollbarYHeight;
    var rowsContainerHeight = footOffsetTop + state.footerHeight;

    if (props.ownerHeight !== undefined && props.ownerHeight < state.height) {
      bottomSectionOffset = props.ownerHeight - state.height;
      footOffsetTop = Math.min(
        footOffsetTop,
        bodyOffsetTop + scrollbarYHeight + bottomSectionOffset - state.footerHeight
      );
      scrollbarYHeight = Math.max(0, footOffsetTop - bodyOffsetTop);
    }

    var verticalScrollbar;
    if (showScrollbarY) {
      verticalScrollbar =
        <Scrollbar
          size={scrollbarYHeight}
          contentSize={scrollbarYHeight + maxScrollY}
          onScroll={this._onVerticalScroll}
          verticalTop={bodyOffsetTop}
          position={state.scrollY}
        />;
    }

    var horizontalScrollbar;
    if (showScrollbarX) {
      var scrollbarYWidth = showScrollbarY ? Scrollbar.SIZE : 0;
      var scrollbarXWidth = state.width - scrollbarYWidth;
      horizontalScrollbar =
        <HorizontalScrollbar
          contentSize={scrollbarXWidth + state.maxScrollX}
          offset={bottomSectionOffset}
          onScroll={this._onHorizontalScroll}
          position={state.scrollX}
          size={scrollbarXWidth}
        />;
    }

    var dragKnob =
      <FixedDataTableColumnResizeHandle
        height={state.height}
        initialWidth={state.columnResizingData.width || 0}
        minWidth={state.columnResizingData.minWidth || 0}
        maxWidth={state.columnResizingData.maxWidth || Number.MAX_VALUE}
        visible={!!state.isColumnResizing}
        leftOffset={state.columnResizingData.left || 0}
        knobHeight={state.headerHeight}
        initialEvent={state.columnResizingData.initialEvent}
        onColumnResizeEnd={props.onColumnResizeEndCallback}
        columnKey={state.columnResizingData.key}
      />;

    var footer = null;
    if (state.footerHeight) {
      var footerData = props.footerDataGetter
        ? props.footerDataGetter()
        : props.footerData;

      footer =
        <FixedDataTableRow
          key="footer"
          className={cx('public/fixedDataTable/footer')}
          data={footerData}
          fixedColumns={state.footFixedColumns}
          height={state.footerHeight}
          index={-1}
          zIndex={1}
          offsetTop={footOffsetTop}
          scrollableColumns={state.footScrollableColumns}
          scrollLeft={state.scrollX}
          width={state.width}
        />;
    }

    var rows = this._renderRows(bodyOffsetTop);

    var header =
      <FixedDataTableRow
        key="header"
        className={cx('public/fixedDataTable/header')}
        data={state.headData}
        width={state.width}
        height={state.headerHeight}
        index={-1}
        zIndex={1}
        offsetTop={headerOffsetTop}
        scrollLeft={state.scrollX}
        fixedColumns={state.headFixedColumns}
        scrollableColumns={state.headScrollableColumns}
        onColumnResize={this._onColumnResize}
      />;

    var topShadow;
    var bottomShadow;
    if (state.scrollY) {
      topShadow =
        <div
          className={cx('public/fixedDataTable/topShadow')}
          style={{top: bodyOffsetTop}}
        />;
    }

    if (
      (state.ownerHeight != null &&
        state.ownerHeight < state.height &&
        state.scrollContentHeight + state.reservedHeight > state.ownerHeight) ||
      state.scrollY < maxScrollY
    ) {
      bottomShadow =
        <div
          className={cx('public/fixedDataTable/bottomShadow')}
          style={{top: footOffsetTop}}
        />;
    }

    return (
      <div
        className={cx('public/fixedDataTable/main')}
        onWheel={this._wheelHandler.onWheel}
        style={{height: state.height, width: state.width}}>
        <div
          className={cx('fixedDataTable/rowsContainer')}
          style={{height: rowsContainerHeight, width: state.width}}>
          {dragKnob}
          {groupHeader}
          {header}
          {rows}
          {footer}
          {topShadow}
          {bottomShadow}
        </div>
        {verticalScrollbar}
        {horizontalScrollbar}
      </div>
    );
  },

  _renderRows(/*number*/ offsetTop) /*object*/ {
    var state = this.state;

    return (
      <FixedDataTableBufferedRows
        defaultRowHeight={state.rowHeight}
        firstRowIndex={state.firstRowIndex}
        firstRowOffset={state.firstRowOffset}
        fixedColumns={state.bodyFixedColumns}
        height={state.bodyHeight}
        offsetTop={offsetTop}
        onRowClick={state.onRowClick}
        onRowDoubleClick={state.onRowDoubleClick}
        onRowMouseDown={state.onRowMouseDown}
        onRowMouseEnter={state.onRowMouseEnter}
        onRowMouseLeave={state.onRowMouseLeave}
        rowClassNameGetter={state.rowClassNameGetter}
        rowsCount={state.rowsCount}
        rowGetter={state.rowGetter}
        rowHeightGetter={state.rowHeightGetter}
        scrollLeft={state.scrollX}
        scrollableColumns={state.bodyScrollableColumns}
        showLastRowBorder={true}
        width={state.width}
        rowPositionGetter={this._scrollHelper.getRowPosition}
      />
    );
  },

  /**
   * This is called when a cell that is in the header of a column has its
   * resizer knob clicked on. It displays the resizer and puts in the correct
   * location on the table.
   */
  _onColumnResize(
    /*number*/ combinedWidth,
    /*number*/ leftOffset,
    /*number*/ cellWidth,
    /*?number*/ cellMinWidth,
    /*?number*/ cellMaxWidth,
    /*number|string*/ columnKey,
    /*object*/ event) {
    if (Locale.isRTL()) {
      leftOffset = -leftOffset;
    }
    this.setState({
      isColumnResizing: true,
      columnResizingData: {
        left: leftOffset + combinedWidth - cellWidth,
        width: cellWidth,
        minWidth: cellMinWidth,
        maxWidth: cellMaxWidth,
        initialEvent: {
          clientX: event.clientX,
          clientY: event.clientY,
          preventDefault: emptyFunction
        },
        key: columnKey
      }
    });
  },

  _areColumnSettingsIdentical(
    oldColumns: Array,
    newColumns: Array
  ): boolean {
    if (oldColumns.length !== newColumns.length) {
      return false;
    }
    for (var index = 0; index < oldColumns.length; ++index) {
      if (!shallowEqual(
          oldColumns[index].props,
          newColumns[index].props
      )) {
        return false;
      }
    }
    return true;
  },

  _populateColumnsAndColumnData(
    columns: Array,
    columnGroups: ?Array,
    oldState: ?Object
  ): Object {
    var canReuseColumnSettings = false;
    var canReuseColumnGroupSettings = false;

    if (oldState && oldState.columns) {
      canReuseColumnSettings =
        this._areColumnSettingsIdentical(columns, oldState.columns);
    }
    if (oldState && oldState.columnGroups && columnGroups) {
      canReuseColumnGroupSettings =
        this._areColumnSettingsIdentical(columnGroups, oldState.columnGroups);
    }

    var columnInfo = {};
    if (canReuseColumnSettings) {
      columnInfo.bodyFixedColumns = oldState.bodyFixedColumns;
      columnInfo.bodyScrollableColumns = oldState.bodyScrollableColumns;
      columnInfo.headFixedColumns = oldState.headFixedColumns;
      columnInfo.headScrollableColumns = oldState.headScrollableColumns;
      columnInfo.footFixedColumns = oldState.footFixedColumns;
      columnInfo.footScrollableColumns = oldState.footScrollableColumns;
    } else {
      var bodyColumnTypes = this._splitColumnTypes(columns);
      columnInfo.bodyFixedColumns = bodyColumnTypes.fixed;
      columnInfo.bodyScrollableColumns = bodyColumnTypes.scrollable;

      var headColumnTypes = this._splitColumnTypes(
        this._createHeadColumns(columns)
      );
      columnInfo.headFixedColumns = headColumnTypes.fixed;
      columnInfo.headScrollableColumns = headColumnTypes.scrollable;

      var footColumnTypes = this._splitColumnTypes(
        this._createFootColumns(columns)
      );
      columnInfo.footFixedColumns = footColumnTypes.fixed;
      columnInfo.footScrollableColumns = footColumnTypes.scrollable;
    }

    if (canReuseColumnGroupSettings) {
      columnInfo.groupHeaderFixedColumns = oldState.groupHeaderFixedColumns;
      columnInfo.groupHeaderScrollableColumns =
        oldState.groupHeaderScrollableColumns;
    } else {
      if (columnGroups) {
        columnInfo.groupHeaderData = this._getGroupHeaderData(columnGroups);
        columnGroups = this._createGroupHeaderColumns(columnGroups);
        var groupHeaderColumnTypes = this._splitColumnTypes(columnGroups);
        columnInfo.groupHeaderFixedColumns = groupHeaderColumnTypes.fixed;
        columnInfo.groupHeaderScrollableColumns =
          groupHeaderColumnTypes.scrollable;
      }
    }

    columnInfo.headData = this._getHeadData(columns);

    return columnInfo;
  },

  _calculateState(/*object*/ props, /*?object*/ oldState) /*object*/ {
    invariant(
      props.height !== undefined || props.maxHeight !== undefined,
      'You must set either a height or a maxHeight'
    );

    var children = [];
    ReactChildren.forEach(props.children, (child, index) => {
      if (child == null) {
        return;
      }
      invariant(
        child.type.__TableColumnGroup__ ||
        child.type.__TableColumn__,
        'child type should be <FixedDataTableColumn /> or ' +
        '<FixedDataTableColumnGroup />'
      );
      children.push(child);
    });

    var useGroupHeader = false;
    if (children.length && children[0].type.__TableColumnGroup__) {
      useGroupHeader = true;
    }

    var firstRowIndex = (oldState && oldState.firstRowIndex) || 0;
    var firstRowOffset = (oldState && oldState.firstRowOffset) || 0;
    var scrollX, scrollY;
    if (oldState && props.overflowX !== 'hidden') {
      scrollX = oldState.scrollX;
    } else {
      scrollX = props.scrollLeft;
    }
    if (oldState && props.overflowY !== 'hidden') {
      scrollY = oldState.scrollY;
    } else {
      scrollState = this._scrollHelper.scrollTo(props.scrollTop);
      firstRowIndex = scrollState.index;
      firstRowOffset = scrollState.offset;
      scrollY = scrollState.position;
    }

    if (this._rowToScrollTo !== undefined) {
      scrollState =
        this._scrollHelper.scrollRowIntoView(this._rowToScrollTo);
      firstRowIndex = scrollState.index;
      firstRowOffset = scrollState.offset;
      scrollY = scrollState.position;
      delete this._rowToScrollTo;
    }

    var groupHeaderHeight = useGroupHeader ? props.groupHeaderHeight : 0;

    if (oldState && props.rowsCount !== oldState.rowsCount) {
      // Number of rows changed, try to scroll to the row from before the
      // change
      var viewportHeight = props.height -
        props.headerHeight -
        props.footerHeight -
        groupHeaderHeight;
      this._scrollHelper = new FixedDataTableScrollHelper(
        props.rowsCount,
        props.rowHeight,
        viewportHeight,
        props.rowHeightGetter
      );
      var scrollState =
        this._scrollHelper.scrollToRow(firstRowIndex, firstRowOffset);
      firstRowIndex = scrollState.index;
      firstRowOffset = scrollState.offset;
      scrollY = scrollState.position;
    } else if (oldState && props.rowHeightGetter !== oldState.rowHeightGetter) {
      this._scrollHelper.setRowHeightGetter(props.rowHeightGetter);
    }

    var columnResizingData;
    if (props.isColumnResizing) {
      columnResizingData = oldState && oldState.columnResizingData;
    } else {
      columnResizingData = EMPTY_OBJECT;
    }

    var columns;
    var columnGroups;

    if (useGroupHeader) {
      var columnGroupSettings =
        FixedDataTableWidthHelper.adjustColumnGroupWidths(
          children,
          props.width
      );
      columns = columnGroupSettings.columns;
      columnGroups = columnGroupSettings.columnGroups;
    } else {
      columns = FixedDataTableWidthHelper.adjustColumnWidths(
        children,
        props.width
      );
    }

    var columnInfo = this._populateColumnsAndColumnData(
      columns,
      columnGroups,
      oldState
    );

    if (this._columnToScrollTo !== undefined) {
      // If selected column is a fixed column, don't scroll
      var fixedColumnsCount = columnInfo.bodyFixedColumns.length;
      if (this._columnToScrollTo >= fixedColumnsCount) {
        var totalFixedColumnsWidth = 0;
        var i, column;
        for (i = 0; i < columnInfo.bodyFixedColumns.length; ++i) {
          column = columnInfo.bodyFixedColumns[i];
          totalFixedColumnsWidth += column.props.width;
        }

        var scrollableColumnIndex = this._columnToScrollTo - fixedColumnsCount;
        var previousColumnsWidth = 0;
        for (i = 0; i < scrollableColumnIndex; ++i) {
          column = columnInfo.bodyScrollableColumns[i];
          previousColumnsWidth += column.props.width;
        }

        var availableScrollWidth = props.width - totalFixedColumnsWidth;
        var selectedColumnWidth = columnInfo.bodyScrollableColumns[
          this._columnToScrollTo - fixedColumnsCount
        ].props.width;
        var minAcceptableScrollPosition =
          previousColumnsWidth + selectedColumnWidth - availableScrollWidth;

        if (scrollX < minAcceptableScrollPosition) {
          scrollX = minAcceptableScrollPosition;
        }

        if (scrollX > previousColumnsWidth) {
          scrollX = previousColumnsWidth;
        }
      }
      delete this._columnToScrollTo;
    }

    var useMaxHeight = props.height === undefined;
    var height = useMaxHeight ? props.maxHeight : props.height;
    var totalHeightReserved = props.footerHeight + props.headerHeight +
      groupHeaderHeight + 2 * BORDER_HEIGHT;
    var bodyHeight = height - totalHeightReserved;
    var scrollContentHeight = this._scrollHelper.getContentHeight();
    var totalHeightNeeded = scrollContentHeight + totalHeightReserved;
    var scrollContentWidth =
      FixedDataTableWidthHelper.getTotalWidth(columns);

    var horizontalScrollbarVisible = scrollContentWidth > props.width &&
      props.overflowX !== 'hidden';

    if (horizontalScrollbarVisible) {
      bodyHeight -= Scrollbar.SIZE;
      totalHeightNeeded += Scrollbar.SIZE;
      totalHeightReserved += Scrollbar.SIZE;
    }

    var maxScrollX = Math.max(0, scrollContentWidth - props.width);
    var maxScrollY = Math.max(0, scrollContentHeight - bodyHeight);
    scrollX = Math.min(scrollX, maxScrollX);
    scrollY = Math.min(scrollY, maxScrollY);

    if (!maxScrollY) {
      // no vertical scrollbar necessary, use the totals we tracked so we
      // can shrink-to-fit vertically
      if (useMaxHeight) {
        height = totalHeightNeeded;
      }
      bodyHeight = totalHeightNeeded - totalHeightReserved;
    }

    this._scrollHelper.setViewportHeight(bodyHeight);

    // The order of elements in this object metters and bringing bodyHeight,
    // height or useGroupHeader to the top can break various features
    var newState = {
      isColumnResizing: oldState && oldState.isColumnResizing,
      // isColumnResizing should be overwritten by value from props if
      // avaialble

      ...columnInfo,
      ...props,

      columns,
      columnGroups,
      columnResizingData,
      firstRowIndex,
      firstRowOffset,
      horizontalScrollbarVisible,
      maxScrollX,
      maxScrollY,
      reservedHeight: totalHeightReserved,
      scrollContentHeight,
      scrollX,
      scrollY,

      // These properties may overwrite properties defined in
      // columnInfo and props
      bodyHeight,
      height,
      groupHeaderHeight,
      useGroupHeader,
    };

    // Both `headData` and `groupHeaderData` are generated by
    // `FixedDataTable` will be passed to each header cell to render.
    // In order to prevent over-rendering the cells, we do not pass the
    // new `headData` or `groupHeaderData`
    // if they haven't changed.
    if (oldState) {
      if (
        oldState.headData &&
        newState.headData &&
        shallowEqual(oldState.headData, newState.headData)
      ) {
        newState.headData = oldState.headData;
      }
      if (
        oldState.groupHeaderData &&
        newState.groupHeaderData &&
        shallowEqual(oldState.groupHeaderData, newState.groupHeaderData)
      ) {
        newState.groupHeaderData = oldState.groupHeaderData;
      }
    }

    return newState;
  },

  _createGroupHeaderColumns(/*array*/ columnGroups) /*array*/  {
    var newColumnGroups = [];
    for (var i = 0; i < columnGroups.length; ++i) {
      newColumnGroups[i] = cloneWithProps(
        columnGroups[i],
        {
          dataKey: i,
          children: undefined,
          columnData: columnGroups[i].props.columnGroupData,
          cellRenderer: columnGroups[i].props.groupHeaderRenderer ||
            renderToString,
          isHeaderCell: true,
        }
      );
    }
    return newColumnGroups;
  },

  _createHeadColumns(/*array*/ columns) /*array*/ {
    var headColumns = [];
    for (var i = 0; i < columns.length; ++i) {
      var columnProps = columns[i].props;
      headColumns.push(cloneWithProps(
        columns[i],
        {
          cellRenderer: columnProps.headerRenderer || renderToString,
          columnData: columnProps.columnData,
          dataKey: columnProps.dataKey,
          isHeaderCell: true,
          label: columnProps.label,
        }
      ));
    }
    return headColumns;
  },

  _createFootColumns(/*array*/ columns) /*array*/ {
    var footColumns = [];
    for (var i = 0; i < columns.length; ++i) {
      var columnProps = columns[i].props;
      footColumns.push(cloneWithProps(
        columns[i],
        {
          cellRenderer: columnProps.footerRenderer || renderToString,
          columnData: columnProps.columnData,
          dataKey: columnProps.dataKey,
          isFooterCell: true,
        }
      ));
    }
    return footColumns;
  },

  _getHeadData(/*array*/ columns) /*?object*/ {
    if (!this.props.headerDataGetter) {
      return null;
    }

    var headData = {};
    for (var i = 0; i < columns.length; ++i) {
      var columnProps = columns[i].props;
      headData[columnProps.dataKey] =
        this.props.headerDataGetter(columnProps.dataKey);
    }
    return headData;
   },

  _getGroupHeaderData(/*array*/ columnGroups) /*array*/ {
    var groupHeaderData = [];
    for (var i = 0; i < columnGroups.length; ++i) {
      groupHeaderData[i] = columnGroups[i].props.label || '';
    }
    return groupHeaderData;
  },

  _splitColumnTypes(/*array*/ columns) /*object*/ {
    var fixedColumns = [];
    var scrollableColumns = [];
    for (var i = 0; i < columns.length; ++i) {
      if (columns[i].props.fixed) {
        fixedColumns.push(columns[i]);
      } else {
        scrollableColumns.push(columns[i]);
      }
    }
    return {
      fixed: fixedColumns,
      scrollable: scrollableColumns,
    };
  },

  _onWheel(/*number*/ deltaX, /*number*/ deltaY) {
    if (this.isMounted()) {
      if (!this._isScrolling) {
        this._didScrollStart();
      }
      var x = this.state.scrollX;
      if (Math.abs(deltaY) > Math.abs(deltaX) &&
          this.props.overflowY !== 'hidden') {
        var scrollState = this._scrollHelper.scrollBy(Math.round(deltaY));
        var maxScrollY = Math.max(
          0,
          scrollState.contentHeight - this.state.bodyHeight
        );
        this.setState({
          firstRowIndex: scrollState.index,
          firstRowOffset: scrollState.offset,
          scrollY: scrollState.position,
          scrollContentHeight: scrollState.contentHeight,
          maxScrollY: maxScrollY,
        });
      } else if (deltaX && this.props.overflowX !== 'hidden') {
        x += deltaX;
        x = x < 0 ? 0 : x;
        x = x > this.state.maxScrollX ? this.state.maxScrollX : x;
        this.setState({
          scrollX: x,
        });
      }

      this._didScrollStop();
    }
  },


  _onHorizontalScroll(/*number*/ scrollPos) {
    if (this.isMounted() && scrollPos !== this.state.scrollX) {
      if (!this._isScrolling) {
        this._didScrollStart();
      }
      this.setState({
        scrollX: scrollPos,
      });
      this._didScrollStop();
    }
  },

  _onVerticalScroll(/*number*/ scrollPos) {
    if (this.isMounted() && scrollPos !== this.state.scrollY) {
      if (!this._isScrolling) {
        this._didScrollStart();
      }
      var scrollState = this._scrollHelper.scrollTo(Math.round(scrollPos));
      this.setState({
        firstRowIndex: scrollState.index,
        firstRowOffset: scrollState.offset,
        scrollY: scrollState.position,
        scrollContentHeight: scrollState.contentHeight,
      });
      this._didScrollStop();
    }
  },

  _didScrollStart() {
    if (this.isMounted() && !this._isScrolling) {
      this._isScrolling = true;
      if (this.props.onScrollStart) {
        this.props.onScrollStart(this.state.scrollX, this.state.scrollY);
      }
    }
  },

  _didScrollStop() {
    if (this.isMounted() && this._isScrolling) {
      this._isScrolling = false;
      if (this.props.onScrollEnd) {
        this.props.onScrollEnd(this.state.scrollX, this.state.scrollY);
      }
    }
  }
});

var HorizontalScrollbar = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin],
  propTypes: {
    contentSize: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    onScroll: PropTypes.func.isRequired,
    position: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
  },

  render() /*object*/ {
    var outerContainerStyle = {
      height: Scrollbar.SIZE,
      width: this.props.size,
    };
    var innerContainerStyle = {
      height: Scrollbar.SIZE,
      position: 'absolute',
      overflow: 'hidden',
      width: this.props.size,
    };
    translateDOMPositionXY(
      innerContainerStyle,
      0,
      this.props.offset
    );

    return (
      <div
        className={cx('fixedDataTable/horizontalScrollbar')}
        style={outerContainerStyle}>
        <div style={innerContainerStyle}>
          <Scrollbar
            {...this.props}
            isOpaque={true}
            orientation="horizontal"
            offset={undefined}
          />
        </div>
      </div>
    );
  },
});

module.exports = FixedDataTable;
