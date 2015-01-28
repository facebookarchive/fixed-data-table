"use strict";

var DocsHTMLWrapper = require('./DocsHTMLWrapper');
var TableAPIHTML = require('../../docs/ColumnGroupAPI.md');
var React = require('react');

var ColumnGroupAPIPage = React.createClass({
  render() {
    return (
      <DocsHTMLWrapper
        html={TableAPIHTML}
      />
    );
  }
});

module.exports = ColumnGroupAPIPage;
