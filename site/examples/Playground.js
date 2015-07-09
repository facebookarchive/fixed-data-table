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

function renderImage(/*string*/ cellData) {
  return <ExampleImage src={cellData} />;
}

function renderLink(/*string*/ cellData) {
  return <a href="#">{cellData}</a>;
}

function renderDate(/*object*/ cellData) {
  return <span>{cellData.toLocaleString()}</span>;
}

var ImageCell = React.createClass({
  propTypes: {
    dataKey: PropTypes.string
  },
  _getData() {
    return this.props.dataList.getObjectAt(this.props.rowIndex)[this.props.dataKey];
  },
  render() {
    return (
      <ExampleImage src={this._getData()} />
    )
  }
})

var MyHeaderCell = React.createClass({
  propTypes: {
    label: PropTypes.string.isRequired
  },
  render() {
    return (
      <div>{this.props.label}</div>
    )
  }
})

var TextCell = React.createClass({
  propTypes: {
    dataKey: PropTypes.string,
  },
  render() {
    <div>
      {this.props.dataList.getObjectAt(this.props.index)[this.props.dataKey]}
    </div>
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

  _rowGetter(index){
    return this.state.dataList.getObjectAt(index);
  },

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowsCount={this.state.dataList.getSize()}
        width={100}
        height={this.props.tableHeight}
        onContentHeightChange={this._onContentHeightChange}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}>
        <Column
          headerCell={
            <MyHeaderCell label="Image" />
          }
          cell={
            <ImageCell dataKey="avartar" dataList={this.state.dataList} />
          }
          fixed={true}
          width={50}
        />
        <Column
          headerCell={
            <MyHeaderCell label="Firstname" />
          }
          cell={
            <TextCell dataKey="firstName" dataList={this.state.dataList} />
          }
          fixed={false}
          width={50}
        />
      </Table>
    );
  },
});

module.exports = ObjectDataExample;
