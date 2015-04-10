/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var React = require('react');

var PendingPool = {};
var ReadyPool = {};

var ExampleImage = React.createClass({
  propTypes: {
    src: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      ready: false,
    };
  },

  componentWillMount() {
    this._load(this.props.src);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({src: null});
      this._load(nextProps.src);
    }
  },

  render() {
    var style = this.state.src ?
      { backgroundImage : 'url(' + this.state.src + ')'} :
      undefined;

    return <div className="exampleImage" style={style} />;
  },

  _load(/*string*/ src) {
    if (ReadyPool[src]) {
      this.setState({src: src});
      return;
    }

    if (PendingPool[src]) {
      PendingPool[src].push(this._onLoad);
      return;
    }

    PendingPool[src] = [this._onLoad];

    var img = new Image();
    img.onload = () => {
      PendingPool[src].forEach(/*function*/ callback => {
        callback(src);
      });
      delete PendingPool[src];
      img.onload = null;
      src = undefined;
    };
    img.src = src;
  },

  _onLoad(/*string*/ src) {
    ReadyPool[src] = true;
    if (this.isMounted() && src === this.props.src) {
      this.setState({
        src: src,
      });
    }
  },
});


module.exports = ExampleImage;
