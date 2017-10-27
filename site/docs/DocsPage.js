"use strict";

require('./docsPageStyle.less');

var MiniHeader = require('../MiniHeader');
var SideBar = require('../SideBar');
var StaticHTMLBlock = require('../StaticHTMLBlock');
var React = require('react');
var createReactClass = require('create-react-class');
var Constants = require('../Constants');

var DocsPages = Constants.DocsPages;

var DOCS_MARKDOWN_FILES = {
  [DocsPages.DOCS.GETTING_STARTED.location]: require('../../docs/README.md'),
  [DocsPages.DOCS.V6_MIGRATION.location]: require('../../docs/v6-migration.md'),

  // API
  [DocsPages.API.TABLE_API.location]: require('../../docs/api/TableAPI.md'),
  [DocsPages.API.COLUMN_API.location]: require('../../docs/api/ColumnAPI.md'),
  [DocsPages.API.COLUMNGROUP_API.location]: require('../../docs/api/ColumnGroupAPI.md'),
  [DocsPages.API.CELL_API.location]: require('../../docs/api/CellAPI.md'),

  // API - v0.5
  [DocsPages.API_V5.TABLE_API.location]: require('../../docs/api-v0.5/TableAPI.md'),
  [DocsPages.API_V5.COLUMN_API.location]: require('../../docs/api-v0.5/ColumnAPI.md'),
  [DocsPages.API_V5.COLUMNGROUP_API.location]: require('../../docs/api-v0.5/ColumnGroupAPI.md'),
};

var DocsPage = createReactClass({
  render() {
    var HTML = DOCS_MARKDOWN_FILES[this.props.page.location];

    return (
      <div className="docsPage">
        <MiniHeader />

        <div className="pageBody" id="body">
          <div className="contents">
            <SideBar
              title="API"
              pages={DocsPages}
              page={this.props.page}
            />
            <StaticHTMLBlock
              className="docContents"
              html={HTML}
            />
          </div>
        </div>
      </div>
    );
  },
});

module.exports = DocsPage;
