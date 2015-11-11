"use strict";

var React = require('react');
var Constants = require('./Constants');

var SideBar = React.createClass({
  render() {
    return (
      <div className="sideBar">
        <div className="scrollContent">
          {this._renderSections(this.props.pages)}
        </div>
      </div>
    );
  },

  _renderSections(pages) {
    return Object.keys(pages).map(pageKey => {
      var page = pages[pageKey];
      if (typeof page !== 'object') {
        return null;
      }

      if (page.groupTitle) {
        return [
          this._renderGroupTitle(page.groupTitle),
          ...this._renderSections(page),
        ];
      }

      return this._renderLink(
        page.title,
        page.location
      );
    });
  },

  _renderGroupTitle(title) {
    return (
      <h4 className="groupTitle">{title}</h4>
    );
  },

  _renderLink(linkName, linkUrl) {
    var arrow = <span className="arrowBullet" />;
    var linkClass = 'sideItem';
    if (this.props.page.location === linkUrl) {
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
  },
});

module.exports = SideBar;
