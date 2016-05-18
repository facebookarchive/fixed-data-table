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

var FakeObjectDataListStore = require('./helpers/FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

const {Table, Column, Cell} = FixedDataTable;

const TextCell = ({rowIndex, data, columnKey, ...props}) => (
  <Cell {...props}>
    {data.getObjectAt(rowIndex)[columnKey]}
  </Cell>
);

class ResizeExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
      columnWidths: {
        firstName: 240,
        lastName: 150,
        sentence: 140,
        companyName: 60,
      },
    };

    this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
  }

  _onColumnResizeEndCallback(newColumnWidth, columnKey) {
    this.setState(({columnWidths}) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }));
  }

  render() {
    var {dataList, columnWidths} = this.state;
    return (
      <Table
        rowHeight={30}
        headerHeight={50}
        rowsCount={dataList.getSize()}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
        isColumnResizing={false}
        width={1000}
        height={500}
        {...this.props}>
        <Column
          columnKey="firstName"
          header={<Cell>First Name</Cell>}
          cell={<TextCell data={dataList} />}
          fixed={true}
          width={columnWidths.firstName}
          isResizable={true}
        />
        <Column
          columnKey="lastName"
          header={<Cell>Last Name (min/max constrained)</Cell>}
          cell={<TextCell data={dataList} />}
          width={columnWidths.lastName}
          isResizable={true}
          minWidth={70}
          maxWidth={170}
        />
        <Column
          columnKey="companyName"
          header={<Cell>Company</Cell>}
          cell={<TextCell data={dataList} />}
          width={columnWidths.companyName}
          isResizable={true}
        />
        <Column
          columnKey="sentence"
          header={<Cell>Sentence</Cell>}
          cell={<TextCell data={dataList} />}
          width={columnWidths.sentence}
          isResizable={true}
        />
      </Table>
    );
  }
}

module.exports = ResizeExample;
