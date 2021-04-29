"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _solidUi = require("solid-ui");

var _trustedApplications = require("./trustedApplications.dom");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var thisColor = '#418d99';
var trustedApplicationView = {
  global: true,
  icon: "".concat(_solidUi.icons.iconBase, "noun_15177.svg"),
  name: 'trustedApplications',
  label: function label() {
    return null;
  },
  render: function render(subject, context) {
    var dom = context.dom;
    var div = dom.createElement('div');
    div.classList.add('trusted-applications-pane');
    div.setAttribute('style', 'border: 0.3em solid ' + thisColor + '; border-radius: 0.5em; padding: 0.7em; margin-top:0.7em;');
    var table = div.appendChild(dom.createElement('table'));
    var main = table.appendChild(dom.createElement('tr'));
    var bottom = table.appendChild(dom.createElement('tr'));
    var statusArea = bottom.appendChild(dom.createElement('div'));
    statusArea.setAttribute('style', 'padding: 0.7em;');

    _render(dom, main, statusArea)["catch"](function (err) {
      return statusArea.appendChild(_solidUi.widgets.errorMessageBlock(dom, err));
    });

    return div;
  }
};

function _render(_x, _x2, _x3) {
  return _render2.apply(this, arguments);
}

function _render2() {
  _render2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dom, main, statusArea) {
    var authContext, subject, profile, editable, applicationsTable;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _solidUi.authn.logInLoadProfile({
              dom: dom,
              div: main,
              statusArea: statusArea,
              me: null
            });

          case 2:
            authContext = _context.sent;
            subject = authContext.me;
            profile = subject.doc();

            if (_solidUi.store.updater) {
              _context.next = 7;
              break;
            }

            throw new Error('Store has no updater');

          case 7:
            editable = _solidUi.store.updater.editable(profile.uri, _solidUi.store);
            main.appendChild((0, _trustedApplications.createText)('h3', 'Manage your trusted applications'));

            if (editable) {
              _context.next = 12;
              break;
            }

            main.appendChild(_solidUi.widgets.errorMessageBlock(dom, "Your profile ".concat(subject.doc().uri, " is not editable, so we cannot do much here.")));
            return _context.abrupt("return");

          case 12:
            main.appendChild((0, _trustedApplications.createText)('p', 'Here you can manage the applications you trust.'));
            applicationsTable = (0, _trustedApplications.createApplicationTable)(subject);
            main.appendChild(applicationsTable);
            main.appendChild((0, _trustedApplications.createText)('h4', 'Notes'));
            main.appendChild((0, _trustedApplications.createContainer)('ol', [main.appendChild((0, _trustedApplications.createText)('li', 'Trusted applications will get access to all resources that you have access to.')), main.appendChild((0, _trustedApplications.createText)('li', 'You can limit which modes they have by default.')), main.appendChild((0, _trustedApplications.createText)('li', 'They will not gain more access than you have.'))]));
            main.appendChild((0, _trustedApplications.createText)('p', 'Application URLs must be valid URL. Examples are http://localhost:3000, https://trusted.app, and https://sub.trusted.app.'));

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _render2.apply(this, arguments);
}

var _default = trustedApplicationView;
exports["default"] = _default;
//# sourceMappingURL=trustedApplications.view.js.map