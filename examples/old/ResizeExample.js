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

var FakeObjectDataListStore = require('../helpers/FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var Table = FixedDataTable.Table;

var ROWS = 1000000;

var columnWidths = {
  firstName: 240,
  lastName: 150,
  sentence: 140,
  companyName: 60,
};
var isColumnResizing;

var ResizeExample = React.createClass({
  getInitialState() {
    return {
      dataList: new FakeObjectDataListStore(ROWS),
      columnWidths: columnWidths
    }
  },

  _rowGetter(index) {
    return this.state.dataList.getObjectAt(index);
  },

  _onColumnResizeEndCallback(newColumnWidth, dataKey) {
    var columnWidths = this.state.columnWidths;
    columnWidths[dataKey] = newColumnWidth;
    isColumnResizing = false;
    this.setState({
      columnWidths
    })
  },

  render() {
    return (
      <Table
        rowHeight={30}
        headerHeight={50}
        rowGetter={this._rowGetter}
        rowsCount={this.state.dataList.getSize()}
        isColumnResizing={isColumnResizing}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
        width={1000}
        height={500}
        {...this.props}>
        <Column
          dataKey="firstName"
          fixed={true}
          label="First Name"
          width={columnWidths['firstName']}
          isResizable={true}
        />
        <Column
          label="Last Name (min/max constrained)"
          dataKey="lastName"
          width={columnWidths['lastName']}
          isResizable={true}
          minWidth={70}
          maxWidth={170}
        />
        <Column
          label="Company"
          dataKey="companyName"
          width={columnWidths['companyName']}
          isResizable={true}
        />
        <Column
          label="Sentence"
          dataKey="sentence"
          width={columnWidths['sentence']}
          isResizable={true}
        />
      </Table>
    );
  }
});

module.exports = ResizeExample;
