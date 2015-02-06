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
              page => this.renderLink(
                this.props.pages[page].title,
                this.props.pages[page].location
              )
            )}
        </div>
      </div>
    );
  },

  renderLink(linkName, linkUrl) {
    var arrow = <span className="arrowBullet" />;
    var linkClass = 'sideItem';
    if (this.props.example.location === linkUrl) {
      linkClass += ' curSideItem';
    }

    return (
      <h2 key={linkName}>
        <a href={linkUrl} target="_self" className={linkClass}>
          <span className="sidebarItemText">{linkName}</span>
          {arrow}
        </a>
      </h2>
    );
  }
});

module.exports = SideBar;
