"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOutliner = getOutliner;
Object.defineProperty(exports, "versionInfo", {
  enumerable: true,
  get: function get() {
    return _versionInfo["default"];
  }
});
Object.defineProperty(exports, "OutlineManager", {
  enumerable: true,
  get: function get() {
    return _manager["default"];
  }
});
Object.defineProperty(exports, "list", {
  enumerable: true,
  get: function get() {
    return _paneRegistry.list;
  }
});
Object.defineProperty(exports, "paneForIcon", {
  enumerable: true,
  get: function get() {
    return _paneRegistry.paneForIcon;
  }
});
Object.defineProperty(exports, "paneForPredicate", {
  enumerable: true,
  get: function get() {
    return _paneRegistry.paneForPredicate;
  }
});
Object.defineProperty(exports, "register", {
  enumerable: true,
  get: function get() {
    return _paneRegistry.register;
  }
});
Object.defineProperty(exports, "byName", {
  enumerable: true,
  get: function get() {
    return _paneRegistry.byName;
  }
});
exports.UI = void 0;

var _versionInfo = _interopRequireDefault(require("./versionInfo"));

var UI = _interopRequireWildcard(require("solid-ui"));

exports.UI = UI;

var _manager = _interopRequireDefault(require("./outline/manager.js"));

var _registerPanes = _interopRequireDefault(require("./registerPanes.js"));

var _paneRegistry = require("pane-registry");

var _context = require("./outline/context");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*                            SOLID PANES
 **
 **     Panes are regions of the outline view in which a particular subject is
 ** displayed in a particular way.
 ** Different panes about the same subject are typically stacked vertically.
 ** Panes may be used naked or with a pane selection header.
 **
 ** The label() method has two functions: it determines whether the pane is
 ** relevant to a given subject, returning null if not.
 ** If it is relevant, then it returns a suitable tooltip for a control which selects the pane
 */
// create the unique UI module on which to attach panes (no, don't attach as UI dot panes any more)
// var UI = require('solid-ui') // Note we will add the panes register to this.
function getOutliner(dom) {
  if (!dom.outlineManager) {
    var context = (0, _context.createContext)(dom, {
      list: _paneRegistry.list,
      paneForIcon: _paneRegistry.paneForIcon,
      paneForPredicate: _paneRegistry.paneForPredicate,
      register: _paneRegistry.register,
      byName: _paneRegistry.byName
    }, UI.store, UI.solidLogicSingleton);
    dom.outlineManager = new _manager["default"](context);
  }

  return dom.outlineManager;
}

if (typeof window !== 'undefined') {
  getOutliner(window.document);
}

(0, _registerPanes["default"])(function (cjsOrEsModule) {
  return (0, _paneRegistry.register)(cjsOrEsModule["default"] || cjsOrEsModule);
});
//# sourceMappingURL=index.js.map