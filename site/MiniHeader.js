"use strict";

var React = require('react');
var Constants = require('./Constants');

require('./miniHeader.less');

var GITHUB_URL = 'https://github.com/facebook/fixed-data-table';
var DOCS_DEFAULT_LOCATION = Constants.DOCS_DEFAULT.location;
var EXAMPLES_DEFAULT_LOCATION = Constants.EXAMPLES_DEFAULT.location;

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
            <a href={DOCS_DEFAULT_LOCATION} target="_self">Docs</a>
            <a href={EXAMPLES_DEFAULT_LOCATION} target="_self">Examples</a>
            <a href={GITHUB_URL}>Github</a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MiniHeader;
