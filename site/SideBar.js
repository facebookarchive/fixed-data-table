"use strict";

var React = require('react');
var Constants = require('./Constants');

var SideBar = React.createClass({
  render() {
    return (
      <div className="sideBar">
        <div className="scrollContent">
          <h4 className="groupTitle">{this.props.title}</h4>
        {Object.keys(this.props.pages).map(
            link => this.renderLink(
              this.props.pages[link],
              Constants.PageLocations[link]
            )
          )}
        </div>
      </div>
    );
  },

  renderLink(linkName, LinkUrl) {
    return (
      <h2 key={linkName}>
        <a href={LinkUrl} target="_self">
          {linkName}
        </a>
      </h2>
    );
  }
});

module.exports = SideBar;
