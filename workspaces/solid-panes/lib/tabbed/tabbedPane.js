"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _solidUi = require("solid-ui");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var TabbedPane = {
  icon: _solidUi.icons.iconBase + 'noun_688606.svg',
  name: 'tabbed',
  audience: [_solidUi.ns.solid('PowerUser')],
  // Does the subject deserve this pane?
  label: function label(subject, context) {
    var kb = context.session.store;
    var typeURIs = kb.findTypeURIs(subject);

    if (_solidUi.ns.meeting('Cluster').uri in typeURIs) {
      return 'Tabbed';
    }

    return null;
  },
  render: function render(subject, context) {
    var dom = context.dom;
    var store = context.session.store;
    var div = dom.createElement('div');

    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (store.fetcher) {
                _context.next = 2;
                break;
              }

              throw new Error('Store has no fetcher');

            case 2:
              _context.next = 4;
              return store.fetcher.load(subject);

            case 4:
              div.appendChild(_solidUi.tabs.tabWidget({
                dom: dom,
                subject: subject,
                predicate: store.any(subject, _solidUi.ns.meeting('predicate')) || _solidUi.ns.meeting('toolList'),
                ordered: true,
                orientation: store.anyValue(subject, _solidUi.ns.meeting('orientation')) || '0',
                renderMain: function renderMain(containerDiv, item) {
                  containerDiv.innerHTML = '';
                  var table = containerDiv.appendChild(context.dom.createElement('table'));
                  context.getOutliner(context.dom).GotoSubject(item, true, null, false, undefined, table);
                },
                renderTab: function renderTab(containerDiv, item) {
                  var predicate = store.the(subject, _solidUi.ns.meeting('predicate'));
                  containerDiv.appendChild(_solidUi.widgets.personTR(context.dom, predicate, item, {}));
                },
                backgroundColor: store.anyValue(subject, _solidUi.ns.ui('backgroundColor')) || '#ddddcc'
              }));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();

    return div;
  }
};
var _default = TabbedPane;
exports["default"] = _default;
//# sourceMappingURL=tabbedPane.js.map