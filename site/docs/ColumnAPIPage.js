"use strict";

var DocsHTMLWrapper = require('./DocsHTMLWrapper');
var TableAPIHTML = require('../../docs/ColumnAPI.md');
var React = require('react');

var ColumnAPIPage = React.createClass({
  render() {
    return (
      <DocsHTMLWrapper
        html={TableAPIHTML}
      />
    );
  }
});

module.exports = ColumnAPIPage;
