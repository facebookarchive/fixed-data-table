"use strict";

var StaticHTMLBlock = require('../StaticHTMLBlock');
var TableAPIHTML = require('../../docs/TableAPI.md');
var React = require('react');

var TableAPIPage = React.createClass({
  render() {
    return (
      <StaticHTMLBlock
        className="docContents"
        html={TableAPIHTML}
      />
    );
  }
});

module.exports = TableAPIPage;
