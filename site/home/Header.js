"use strict";

var React = require('react');
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var Constants = require('../Constants');

var FIXED_THRESHOLD = 680;
var MAX_HEIGHT = 800;
var HEADER_HEIGHT = 50;
var EMPTY_OBJECT = {};
var GITHUB_URL = 'https://github.com/facebook/fixed-data-table';
var DOCS_DEFAULT_LOCATION = Constants.DOCS_DEFAULT.location;
var EXAMPLES_DEFAULT_LOCATION = Constants.EXAMPLES_DEFAULT.location;

var Header = createReactClass({
  getInitialState() {
    return {
      scroll: 0,
      fixed: false,
      renderHero: false,
    };
  },

  componentDidMount() {
    this.offsetWidth = this._getWindowWidth();
    this.offsetHeight = ReactDOM.findDOMNode(this).offsetHeight;
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);

    this.setState({
      renderHero: true,
      fixed: this.offsetWidth <= FIXED_THRESHOLD,
    });
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },

  handleResize(event) {
    this.offsetWidth = this._getWindowWidth();
    this.offsetHeight = ReactDOM.findDOMNode(this).offsetHeight;
    this.setState({
      fixed: this.offsetWidth <= FIXED_THRESHOLD,
    });
    this.forceUpdate();
  },

  handleScroll(event) {
    var scrollPos = window.scrollY;
    scrollPos = scrollPos < this.offsetHeight ? scrollPos : this.offsetHeight;
    this.setState({ scroll: Math.max(scrollPos, 0) });
  },

  _getWindowWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  },

  _renderHero() {
    var HeroTable = require('./HeroTable');

    return (
      <div className="heroContainer">
        <HeroTable
          scrollLeft={0.5 * this.state.scroll}
          scrollTop={2 * MAX_HEIGHT - 2 * this.state.scroll}
          tableWidth={this.offsetWidth}
          tableHeight={this.offsetHeight}
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

    var miniHeaderClasses = 'miniHeader';
    if (!this.state.renderHero) {
      miniHeaderClasses += ' notLoaded';
    }

    return (
      <div className="header">
        <div
          className={miniHeaderClasses}
          style={this.state.fixed ? EMPTY_OBJECT : clipStyles}>
          <div className="miniHeaderContents">
            <a href="./" target="_self" className="miniLogo" />
            <a href={DOCS_DEFAULT_LOCATION} target="_self">Docs</a>
            <a href={EXAMPLES_DEFAULT_LOCATION} target="_self">Examples</a>
            <a href={GITHUB_URL}>Github</a>
          </div>
        </div>
        <div className="cover">
          {this.state.renderHero && this._renderHero()}
          <div className="logo">
            <div className="title">
              FixedDataTable
            </div>
            <div className="subtitle">
              A fast and flexible lazily rendered table for React.js
            </div>
            <a href={GITHUB_URL} className="button">View on GitHub</a>
            <div className="links">
              <a href={DOCS_DEFAULT_LOCATION} target="_self">Docs</a>
              &bull;
              <a href={EXAMPLES_DEFAULT_LOCATION} target="_self">Examples</a>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Header;
