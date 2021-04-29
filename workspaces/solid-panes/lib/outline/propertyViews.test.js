"use strict";

var _rdflib = require("rdflib");

var _propertyViews = _interopRequireDefault(require("./propertyViews"));

var _viewAsImage = _interopRequireDefault(require("./viewAsImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-env jest */
describe('property views', function () {
  it.each(['http://xmlns.com/foaf/0.1/depiction', 'http://xmlns.com/foaf/0.1/img', 'http://xmlns.com/foaf/0.1/thumbnail', 'http://xmlns.com/foaf/0.1/logo', 'http://schema.org/image'])('renders %s as image', function (property) {
    var asImage = (0, _viewAsImage["default"])(document);
    var views = (0, _propertyViews["default"])(document);
    var view = views.defaults[property];
    var result = view((0, _rdflib.sym)('https://pod.example/img.jpg'));
    expect(result).toBeInstanceOf(HTMLImageElement);
    expect(result).toHaveAttribute('src', 'https://pod.example/img.jpg');
  });
  it.each(['http://xmlns.com/foaf/0.1/mbox'])('renders %s as anchor', function (property) {
    var asImage = (0, _viewAsImage["default"])(document);
    var views = (0, _propertyViews["default"])(document);
    var view = views.defaults[property];
    var result = view((0, _rdflib.sym)('mailto:alice@mail.example'));
    expect(result).toBeInstanceOf(HTMLAnchorElement);
    expect(result).toHaveAttribute('href', 'mailto:alice@mail.example');
  });
});
//# sourceMappingURL=propertyViews.test.js.map