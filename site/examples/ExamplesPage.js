"use strict";

var ExamplesWrapper = require('./ExamplesWrapper');
var React = require('react');
var Constants = require('../Constants');

var PageLocations = Constants.PageLocations;

var ExamplesPage = React.createClass({
  getInitialState() {
    return {
      renderPage: false
    };
  },

  render() {
    return (
      <ExamplesWrapper {...this.props} >
        {this.state.renderPage && this._renderPage()}
      </ExamplesWrapper>
    );
  },

  _renderPage() {
    // Require common FixedDataTable CSS.
    require('fixed-data-table/css/Scrollbar.css');
    require('fixed-data-table/css/fixedDataTable.css');
    require('fixed-data-table/css/fixedDataTableCell.css');
    require('fixed-data-table/css/fixedDataTableCellGroup.css');
    require('fixed-data-table/css/fixedDataTableColumnResizerLine.css');
    require('fixed-data-table/css/fixedDataTableRow.css');

    switch (this.props.example) {
      case PageLocations.OBJECT_DATA_EXAMPLE:
        var ObjectDataExample = require('./ObjectDataExample');
        return <ObjectDataExample {...this.state} />;
      case PageLocations.RESIZE_EXAMPLE:
        var ResizeExample = require('./ResizeExample');
        return <ResizeExample {...this.state} />;
      case PageLocations.FLEXGROW_EXAMPLE:
        var FlexGrowExample = require('./FlexGrowExample');
        return <FlexGrowExample {...this.state} />;
    }
  },

  componentDidMount() {
    this._update();
    var win = window;
    if (win.addEventListener) {
      win.addEventListener('resize', this._onResize, false);
    } else if (win.attachEvent) {
      win.attachEvent('onresize', this._onResize);
    } else {
      win.onresize = this._onResize;
    }
  },

  _onResize() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(this._update, 16);
  },

  _update() {
    var win = window;

    var widthOffset = win.innerWidth < 680 ? 0 : 240;

    this.setState({
      renderPage: true,
      tableWidth: win.innerWidth - widthOffset,
      tableHeight: win.innerHeight - 100,
    });
  }
});

module.exports = ExamplesPage;
