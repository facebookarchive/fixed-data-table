"use strict";

var React = require('react');
var Constants = require('../Constants');

var MAX_HEIGHT = 800;
var TABLE_OFFSET = 100;
var HEADER_HEIGHT = 50;
var EMPTY_OBJECT = {};
var GITHUB_URL = 'https://github.com/facebook/fixed-data-table-experimental';

var Header = React.createClass({
  getInitialState() {
    return {
      scroll: 0,
      fixed: false,
      renderHero: false,
    };
  },

  componentDidMount() {
    this.offsetWidth = this.getDOMNode().offsetWidth;
    this.offsetHeight = this.getDOMNode().offsetHeight;
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);

    if (window.matchMedia) {
      this.setState({
        renderHero: true,
        fixed: window.matchMedia('(max-device-width: 680px)').matches,
      });
    }
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },

  handleResize(event) {
    this.offsetWidth = this.getDOMNode().offsetWidth;
    this.offsetHeight = this.getDOMNode().offsetHeight;
    this.forceUpdate();
  },

  handleScroll(event) {
    var scrollPos = window.scrollY;
    scrollPos = scrollPos < this.offsetHeight ? scrollPos : this.offsetHeight;
    this.setState({ scroll: scrollPos });
  },

  _renderHero() {
    if (this.offsetWidth < 680) {
      return;
    }

    var HeroTable = require('./HeroTable');

    return (
      <div className="heroContainer" style={{top: TABLE_OFFSET}}>
        <HeroTable
          scrollTop={2 * MAX_HEIGHT - 2 * this.state.scroll}
          tableWidth={this.offsetWidth}
          tableHeight={this.offsetHeight - 100}
        />
      </div>
    );
  },

  render() {
    var coverHeight  = this.offsetHeight - this.state.scroll;
    var topClip = coverHeight < 0 ? 0 : coverHeight;
    topClip = coverHeight > HEADER_HEIGHT ? HEADER_HEIGHT : coverHeight;

    var clipStyles = {
      clip: 'rect(' + topClip + 'px, 5000px, ' + HEADER_HEIGHT + 'px, 0)',
    };

    return (
      <div className="header">
        <div
          className="miniHeader"
          style={this.state.fixed ? EMPTY_OBJECT : clipStyles}>
          <div className="miniHeaderContents">
            <a href="./" target="_self" className="miniLogo" />
            <a href={Constants.DOCS_INDEX} target="_self">Documentation</a>
            <a href={Constants.EXAMPLES_INDEX} target="_self">Examples</a>
            <a href={GITHUB_URL}>Github</a>
          </div>
        </div>
        <div className="cover">
          <div className="filler">
            <div className="miniHeaderContents">
              <a href={Constants.DOCS_INDEX} target="_self">Documentation</a>
              <a href={Constants.EXAMPLES_INDEX} target="_self">Examples</a>
              <a href={GITHUB_URL}>Github</a>
            </div>
          </div>
          {this.state.renderHero && this._renderHero()}
          <div className="logo">
            <div className="logoPic" />
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Header;
