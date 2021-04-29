"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.dashboardPane = void 0;

var _solidUi = require("solid-ui");

var _rdflib = require("rdflib");

var _homepage = require("./homepage");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var dashboardPane = {
  icon: _solidUi.icons.iconBase + 'noun_547570.svg',
  name: 'dashboard',
  label: function label(subject) {
    if (subject.uri === subject.site().uri) {
      return 'Dashboard';
    }

    return null;
  },
  render: function render(subject, context) {
    var dom = context.dom;
    var container = dom.createElement('div');

    _solidUi.authn.solidAuthClient.trackSession( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(session) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                container.innerHTML = '';
                buildPage(container, session ? (0, _rdflib.sym)(session.webId) : null, context, subject);

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    return container;
  }
};
exports.dashboardPane = dashboardPane;

function buildPage(container, webId, context, subject) {
  if (webId && webId.site().uri === subject.site().uri) {
    return buildDashboard(container, context);
  }

  return buildHomePage(container, subject);
}

function buildDashboard(container, context) {
  // @@ TODO get a proper type
  var outliner = context.getOutliner(context.dom);
  outliner.getDashboard().then(function (dashboard) {
    return container.appendChild(dashboard);
  });
}

function buildHomePage(container, subject) {
  var wrapper = document.createElement('div');
  container.appendChild(wrapper);
  var shadow = wrapper.attachShadow({
    mode: 'open'
  });
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/common/css/bootstrap.min.css';
  shadow.appendChild(link);
  (0, _homepage.generateHomepage)(subject, _solidUi.store, _solidUi.store.fetcher).then(function (homepage) {
    return shadow.appendChild(homepage);
  });
}

var _default = dashboardPane;
exports["default"] = _default;
//# sourceMappingURL=dashboardPane.js.map