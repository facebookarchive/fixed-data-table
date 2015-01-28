"use strict";

var React = require('react');
var Constants = require('./Constants');

require('./miniHeader.less');

var GITHUB_URL = 'https://github.com/facebook/fixed-data-table-experimental';

var MiniHeader = React.createClass({
  render() {
    return (
      <div className="header">
        <div className="miniHeader">
          <div className="miniHeaderContents">
            <a href="./" target="_self" className="miniLogo" />
            <a className="homeLink" href="./" target="_self">
              Home
            </a>
            <a href={Constants.DOCS_INDEX} target="_self">Documentation</a>
            <a href={Constants.EXAMPLES_INDEX} target="_self">Examples</a>
            <a href={GITHUB_URL}>Github</a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MiniHeader;
