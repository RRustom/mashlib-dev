"use strict";

var _manager = _interopRequireDefault(require("./manager"));

var _rdflib = require("rdflib");

var _dom = require("@testing-library/dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var MockPane = {
  render: function render(subject) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode("Mock Pane for ".concat(subject.uri)));
    return div;
  }
};
var mockPaneRegistry = {
  list: [],
  byName: function byName() {
    return MockPane;
  }
};
describe('manager', function () {
  describe('outline object td', function () {
    describe('for a named node', function () {
      var result;
      beforeAll(function () {
        var table = document.createElement('table');
        var row = document.createElement('tr');
        table.appendChild(row);
        var manager = new _manager["default"]({
          dom: document,
          session: {
            paneRegistry: mockPaneRegistry
          }
        });
        result = manager.outlineObjectTD((0, _rdflib.sym)('https://namednode.example/'), null, null, null);
        row.appendChild(result);
      });
      it('is a html td element', function () {
        expect(result.nodeName).toBe('TD');
      });
      it('about attribute refers to node', function () {
        expect(result).toHaveAttribute('about', '<https://namednode.example/>');
      });
      it('has class obj', function () {
        expect(result).toHaveClass('obj');
      });
      it('is selectable', function () {
        expect(result).toHaveAttribute('notselectable', 'false');
      });
      it('has style', function () {
        expect(result).toHaveStyle('margin: 0.2em; border: none; padding: 0; vertical-align: top;');
      });
      it('shows an expand icon', function () {
        var img = result.firstChild;
        expect(img.nodeName).toBe('IMG');
        expect(img).toHaveAttribute('src', 'https://solid.github.io/solid-ui/src/originalIcons/tbl-expand-trans.png');
      });
      it('shows the node label', function () {
        expect(result).toHaveTextContent('namednode.example');
      });
      it('label is draggable', function () {
        var label = (0, _dom.getByText)(result, 'namednode.example');
        expect(label).toHaveAttribute('draggable', 'true');
      });
      describe('link icon', function () {
        var linkIcon;
        beforeEach(function () {
          var label = (0, _dom.getByText)(result, 'namednode.example');
          linkIcon = label.lastChild;
        });
        it('is linked to named node URI', function () {
          expect(linkIcon.nodeName).toBe('A');
          expect(linkIcon).toHaveAttribute('href', 'https://namednode.example/');
        });
      });
      describe('expanding', function () {
        it('renders relevant pane', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var expand, error;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  expand = result.firstChild;
                  expand.click();
                  _context.next = 4;
                  return (0, _dom.findByText)(result.parentNode, /Mock Pane/);

                case 4:
                  error = _context.sent;
                  expect(error).toHaveTextContent('Mock Pane for https://namednode.example/');

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        })));
      });
    });
    describe('for a tel uri', function () {
      var result;
      beforeAll(function () {
        var manager = new _manager["default"]({
          dom: document
        });
        result = manager.outlineObjectTD((0, _rdflib.sym)('tel:+1-201-555-0123'), null, null, null);
      });
      it('is a html td element', function () {
        expect(result.nodeName).toBe('TD');
      });
      it('about attribute refers to tel uri', function () {
        expect(result).toHaveAttribute('about', '<tel:+1-201-555-0123>');
      });
      it('has class obj', function () {
        expect(result).toHaveClass('obj');
      });
      it('is selectable', function () {
        expect(result).toHaveAttribute('notselectable', 'false');
      });
      it('has style', function () {
        expect(result).toHaveStyle('margin: 0.2em; border: none; padding: 0; vertical-align: top;');
      });
      it('shows an expand icon', function () {
        var img = result.firstChild;
        expect(img.nodeName).toBe('IMG');
        expect(img).toHaveAttribute('src', 'https://solid.github.io/solid-ui/src/originalIcons/tbl-expand-trans.png');
      });
      it('shows the phone number', function () {
        expect(result).toHaveTextContent('+1-201-555-0123');
      });
      describe('phone link', function () {
        var phoneLink;
        beforeAll(function () {
          var label = (0, _dom.getByText)(result, '+1-201-555-0123');
          phoneLink = label.lastChild;
        });
        it('is linked to tel uri', function () {
          expect(phoneLink.nodeName).toBe('A');
          expect(phoneLink).toHaveAttribute('href', 'tel:+1-201-555-0123');
        });
        it('is represented by phone icon', function () {
          var phoneIcon = phoneLink.lastChild;
          expect(phoneIcon.nodeName).toBe('IMG');
          expect(phoneIcon).toHaveAttribute('src', 'https://solid.github.io/solid-ui/src/originalIcons/silk/telephone.png');
        });
      });
    });
    describe('for a literal', function () {
      var result;
      beforeAll(function () {
        var manager = new _manager["default"]({
          dom: document
        });
        result = manager.outlineObjectTD((0, _rdflib.lit)('some text'), null, null, null);
      });
      it('is a html td element', function () {
        expect(result.nodeName).toBe('TD');
      });
      it('has no about attribute', function () {
        expect(result).not.toHaveAttribute('about');
      });
      it('has class obj', function () {
        expect(result).toHaveClass('obj');
      });
      it('is selectable', function () {
        expect(result).toHaveAttribute('notselectable', 'false');
      });
      it('has style', function () {
        expect(result).toHaveStyle('margin: 0.2em; border: none; padding: 0; vertical-align: top;');
      });
      it('shows the literal text', function () {
        expect(result).toHaveTextContent('some text');
      });
      it('literal text preserves white space', function () {
        var text = (0, _dom.getByText)(result, 'some text');
        expect(text).toHaveStyle('white-space: pre-wrap;');
      });
    });
    describe('for a blank node', function () {
      var result;
      beforeAll(function () {
        var manager = new _manager["default"]({
          dom: document
        });
        result = manager.outlineObjectTD((0, _rdflib.blankNode)('blank-node'), null, null, null);
      });
      it('is a html td element', function () {
        expect(result.nodeName).toBe('TD');
      });
      it('has about attribute', function () {
        expect(result).toHaveAttribute('about', '_:blank-node');
      });
      it('has class obj', function () {
        expect(result).toHaveClass('obj');
      });
      it('is selectable', function () {
        expect(result).toHaveAttribute('notselectable', 'false');
      });
      it('has style', function () {
        expect(result).toHaveStyle('margin: 0.2em; border: none; padding: 0; vertical-align: top;');
      });
      it('shows 3 dots', function () {
        expect(result).toHaveTextContent('...');
      });
    });
  });
});
//# sourceMappingURL=manager.test.js.map