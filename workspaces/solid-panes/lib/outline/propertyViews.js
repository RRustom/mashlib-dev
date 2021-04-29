"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _solidUi = require("solid-ui");

var _viewAsImage = _interopRequireDefault(require("./viewAsImage"));

var _viewAsMbox = _interopRequireDefault(require("./viewAsMbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** some builtin simple views **/
var _default = function _default(dom) {
  // view that applies to items that are objects of certain properties.
  var views = {
    properties: [],
    defaults: [],
    classes: []
  }; // views

  var asImage = (0, _viewAsImage["default"])(dom);
  var asMbox = (0, _viewAsMbox["default"])(dom);
  viewsAddPropertyView(views, _solidUi.ns.foaf('depiction').uri, asImage, true);
  viewsAddPropertyView(views, _solidUi.ns.foaf('img').uri, asImage, true);
  viewsAddPropertyView(views, _solidUi.ns.foaf('thumbnail').uri, asImage, true);
  viewsAddPropertyView(views, _solidUi.ns.foaf('logo').uri, asImage, true);
  viewsAddPropertyView(views, _solidUi.ns.schema('image').uri, asImage, true);
  viewsAddPropertyView(views, _solidUi.ns.foaf('mbox').uri, asMbox, true);
  return views;
};
/** add a property view function **/


exports["default"] = _default;

function viewsAddPropertyView(views, property, pviewfunc, isDefault) {
  if (!views.properties[property]) {
    views.properties[property] = [];
  }

  views.properties[property].push(pviewfunc);

  if (isDefault) {
    // will override an existing default!
    views.defaults[property] = pviewfunc;
  }
} // addPropertyView
//# sourceMappingURL=propertyViews.js.map