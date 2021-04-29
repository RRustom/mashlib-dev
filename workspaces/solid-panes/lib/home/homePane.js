"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _solidUi = require("solid-ui");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var HomePaneSource = {
  icon: _solidUi.icons.iconBase + 'noun_547570.svg',
  // noun_25830
  global: true,
  name: 'home',
  // Does the subject deserve an home pane?
  //
  //   yes, always!
  //
  label: function label() {
    return 'home';
  },
  render: function render(subject, context) {
    var dom = context.dom;

    var showContent = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var homePaneContext, creationDiv, creationContext, relevantPanes;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                homePaneContext = {
                  div: div,
                  dom: dom,
                  statusArea: div,
                  me: me
                };
                /*
                      div.appendChild(dom.createElement('h4')).textContent = 'Login status'
                      var loginStatusDiv = div.appendChild(context.dom.createElement('div'))
                      // TODO: Find out what the actual type is:
                      type UriType = unknown;
                      loginStatusDiv.appendChild(UI.authn.loginStatusBox(context.dom, () => {
                        // Here we know new log in status
                      }))
                */

                div.appendChild(dom.createElement('h4')).textContent = 'Create new thing somewhere';
                creationDiv = div.appendChild(dom.createElement('div'));
                creationContext = {
                  div: creationDiv,
                  dom: dom,
                  statusArea: div,
                  me: me
                };
                _context.next = 6;
                return _solidUi.authn.filterAvailablePanes(context.session.paneRegistry.list);

              case 6:
                relevantPanes = _context.sent;

                _solidUi.create.newThingUI(creationContext, context, relevantPanes); // newUI Have to pass panes down


                div.appendChild(dom.createElement('h4')).textContent = 'Private things'; // TODO: Replace by a common, representative interface

                _solidUi.authn.registrationList(homePaneContext, {
                  "private": true
                }).then(function (authContext) {
                  div.appendChild(dom.createElement('h4')).textContent = 'Public things';
                  div.appendChild(dom.createElement('p')).textContent = 'Things in this list are visible to others.';

                  _solidUi.authn.registrationList(authContext, {
                    "public": true
                  }).then(function () {// done
                  });
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function showContent() {
        return _ref.apply(this, arguments);
      };
    }();

    var div = dom.createElement('div');

    var me = _solidUi.authn.currentUser(); // this will be incorrect if not logged in


    showContent();
    return div;
  }
}; // pane object
// ends

var _default = HomePaneSource;
exports["default"] = _default;
//# sourceMappingURL=homePane.js.map