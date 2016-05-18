/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BrowserSupportCore
 */

'use strict';

var getVendorPrefixedName = require('./getVendorPrefixedName');

var BrowserSupportCore = {
  /**
   * @return {bool} True if browser supports css animations.
   */
  hasCSSAnimations: function hasCSSAnimations() {
    return !!getVendorPrefixedName('animationName');
  },

  /**
   * @return {bool} True if browser supports css transforms.
   */
  hasCSSTransforms: function hasCSSTransforms() {
    return !!getVendorPrefixedName('transform');
  },

  /**
   * @return {bool} True if browser supports css 3d transforms.
   */
  hasCSS3DTransforms: function hasCSS3DTransforms() {
    return !!getVendorPrefixedName('perspective');
  },

  /**
   * @return {bool} True if browser supports css transitions.
   */
  hasCSSTransitions: function hasCSSTransitions() {
    return !!getVendorPrefixedName('transition');
  }
};

module.exports = BrowserSupportCore;