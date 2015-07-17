/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

var ROWS = 1000000;

var ExampleImage = require('./ExampleImage');
var FakeObjectDataListStore = require('./FakeObjectDataListStore');

var FixedDataTable = require('fixed-data-table');
var React = require('react');

var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

function _getData(el){
  return el.props.data.getObjectAt(el.props.rowIndex)[el.props.dataKey];
}

var DateCell = React.createClass({
  render() {
    return (
      <Cell
        {...this.props}>
        {_getData(this).toLocaleString()}
      </Cell>
    )
  }
})

var ImageCell = React.createClass({
  render() {
    return (
      <ExampleImage src={_getData(this)} />
    )
  }
})

var LinkCell = React.createClass({
  render() {
    return (
      <Cell
        {...this.props}>
        <a href="#">{_getData(this)}</a>
      </Cell>
    )
  }
})

var TextCell = React.createClass({
  _getData() {
    return this.props.data.getObjectAt(this.props.rowIndex)[this.props.dataKey];
  },
  render() {
    return (
      <Cell
        {...this.props}>
        {this._getData()}
      </Cell>
    )
  }
})

var ObjectDataExample = React.createClass({

  propTypes: {
    onContentDimensionsChange: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
  },

  _onContentHeightChange(contentHeight) {
    this.props.onContentDimensionsChange &&
      this.props.onContentDimensionsChange(contentHeight, 1150);
  },

  getInitialState() {
    return {
      dataList: new FakeObjectDataListStore(ROWS)
    }
  },

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowsCount={this.state.dataList.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        onContentHeightChange={this._onContentHeightChange}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}>
        <Column
          cell={<ImageCell data={this.state.dataList} dataKey="avartar" />}
          fixed={true}
          width={50}
        />
        <Column
          header="First Name"
          cell={<TextCell data={this.state.dataList} dataKey="firstName" />}
          fixed={true}
          width={100}
        />
        <Column
          header="Last Name"
          cell={<TextCell data={this.state.dataList} dataKey="lastName" />}
          fixed={true}
          width={100}
        />
        <Column
          header="City"
          cell={<TextCell data={this.state.dataList} dataKey="city" />}
          width={100}
        />
        <Column
          header="Street"
          cell={<TextCell data={this.state.dataList} dataKey="street" />}
          width={200}
        />
        <Column
          header="Zip Code"
          cell={<TextCell data={this.state.dataList} dataKey="zipCode" />}
          width={200}
        />
        <Column
          header="Email"
          cell={<LinkCell data={this.state.dataList} dataKey="email" />}
          width={200}
        />
        <Column
          header="DOB"
          cell={<DateCell data={this.state.dataList} dataKey="date" />}
          width={200}
        />
      </Table>
    );
  },
});

module.exports = ObjectDataExample;
