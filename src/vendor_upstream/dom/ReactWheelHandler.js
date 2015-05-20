/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * This is utility that hanlds onWheel events and calls provided wheel
 * callback with correct frame rate.
 *
 * @providesModule ReactWheelHandler
 * @typechecks
 */

'use strict';

var normalizeWheel = require('normalizeWheel');
var requestAnimationFramePolyfill = require('requestAnimationFramePolyfill');

class ReactWheelHandler {
  /**
   * onWheel is the callback that will be called with right frame rate if
   * any wheel events happened
   * onWheel should is to be called with two arguments: deltaX and deltaY in
   * this order
   */
  constructor(
    /*function*/ onWheel,
    /*boolean*/ handleScrollX,
    /*boolean*/ handleScrollY,
    /*?boolean*/ stopPropagation
  ) {
    this._animationFrameID = null;
    this._deltaX = 0;
    this._deltaY = 0;
    this._didWheel = this._didWheel.bind(this);
    this._handleScrollX = handleScrollX;
    this._handleScrollY = handleScrollY;
    this._stopPropagation = !!stopPropagation;
    this._onWheelCallback = onWheel;
    this.onWheel = this.onWheel.bind(this);
  }

  onWheel(/*object*/ event) {
    if (this._handleScrollX || this._handleScrollY) {
      event.preventDefault();
    }
    var normalizedEvent = normalizeWheel(event);

    this._deltaX += this._handleScrollX ? normalizedEvent.pixelX : 0;
    this._deltaY += this._handleScrollY ? normalizedEvent.pixelY : 0;

    var changed;
    if (this._deltaX !== 0 || this._deltaY !== 0) {
      if (this._stopPropagation) {
        event.stopPropagation();
      }
      changed = true;
    }

    if (changed === true && this._animationFrameID === null) {
      this._animationFrameID = requestAnimationFramePolyfill(this._didWheel);
    }
  }

  _didWheel() {
    this._animationFrameID = null;
    this._onWheelCallback(this._deltaX, this._deltaY);
    this._deltaX = 0;
    this._deltaY = 0;
  }
}

module.exports = ReactWheelHandler;
