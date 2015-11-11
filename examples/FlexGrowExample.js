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

function colorizeText(str, index) {
  var val, n = 0;
  return str.split('').map((letter) => {
    val = index * 70 + n++;
    var color = 'hsl(' + val + ', 100%, 50%)';
    return <span style={{color}} key={val}>{letter}</span>;
  });
}


const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data.getObjectAt(rowIndex)[col]}
  </Cell>
);

const ColoredTextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {colorizeText(data.getObjectAt(rowIndex)[col], rowIndex)}
  </Cell>
);

class FlexGrowExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
    };
  }

  render() {
    var {dataList} = this.state;
    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowsCount={dataList.getSize()}
        width={1000}
        height={500}
        {...this.props}>
        <Column
          header={<Cell>First Name</Cell>}
          cell={<TextCell data={dataList} col="firstName" />}
          fixed={true}
          width={100}
        />
        <Column
          header={<Cell>Sentence! (flexGrow greediness=2)</Cell>}
          cell={<ColoredTextCell data={dataList} col="sentence" />}
          flexGrow={2}
          width={200}
        />
        <Column
          header={<Cell>Company (flexGrow greediness=1)</Cell>}
          cell={<TextCell data={dataList} col="companyName" />}
          flexGrow={1}
          width={200}
        />
        <Column
          width={100}
          header={<Cell>Last Name</Cell>}
          cell={<TextCell data={dataList} col="lastName" />}
        />
      </Table>
    );
  }
}

module.exports = FlexGrowExample;
