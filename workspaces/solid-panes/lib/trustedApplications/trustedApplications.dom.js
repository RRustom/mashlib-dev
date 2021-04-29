"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApplicationTable = createApplicationTable;
exports.createContainer = createContainer;
exports.createText = createText;

var _rdflib = require("rdflib");

var _solidUi = require("solid-ui");

var _trustedApplications = require("./trustedApplications.utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createApplicationTable(subject) {
  var applicationsTable = createElement('table', {
    "class": 'results'
  }); // creating headers

  var header = createContainer('tr', [createText('th', 'Application URL'), createText('th', 'Access modes'), createText('th', 'Actions')]);
  applicationsTable.appendChild(header); // creating rows

  _solidUi.store.each(subject, _solidUi.ns.acl('trustedApp'), undefined, undefined).flatMap(function (app) {
    return _solidUi.store.each(app, _solidUi.ns.acl('origin'), undefined, undefined).map(function (origin) {
      return {
        appModes: _solidUi.store.each(app, _solidUi.ns.acl('mode'), undefined, undefined),
        origin: origin
      };
    });
  }).sort(function (a, b) {
    return a.origin.value < b.origin.value ? -1 : 1;
  }).forEach(function (_ref) {
    var appModes = _ref.appModes,
        origin = _ref.origin;
    return applicationsTable.appendChild(createApplicationEntry(subject, origin, appModes, updateTable));
  }); // adding a row for new applications


  applicationsTable.appendChild(createApplicationEntry(subject, null, [_solidUi.ns.acl('Read')], updateTable));
  return applicationsTable;

  function updateTable() {
    applicationsTable.parentElement.replaceChild(createApplicationTable(subject), applicationsTable);
  }
}

function createApplicationEntry(subject, origin, appModes, updateTable) {
  var trustedApplicationState = {
    origin: origin,
    appModes: appModes,
    formElements: {
      modes: [],
      origin: undefined
    }
  };
  return createContainer('tr', [createContainer('td', [createContainer('form', [createElement('input', {
    "class": 'textinput',
    placeholder: 'Write new URL here',
    value: origin ? origin.value : ''
  }, {}, function (element) {
    trustedApplicationState.formElements.origin = element;
  })], {}, {
    submit: addOrEditApplication
  })]), createContainer('td', [createContainer('form', createModesInput(trustedApplicationState), {}, {
    submit: addOrEditApplication
  })]), createContainer('td', [createContainer('form', origin ? [createText('button', 'Update', {
    "class": 'controlButton',
    style: 'background: LightGreen;'
  }), createText('button', 'Delete', {
    "class": 'controlButton',
    style: 'background: LightCoral;'
  }, {
    click: removeApplication
  })] : [createText('button', 'Add', {
    "class": 'controlButton',
    style: 'background: LightGreen;'
  })], {}, {
    submit: addOrEditApplication
  })])]);

  function addOrEditApplication(event) {
    event.preventDefault();
    var origin;

    try {
      origin = (0, _rdflib.sym)(trustedApplicationState.formElements.origin.value);
    } catch (err) {
      return alert('Please provide an application URL you want to trust');
    }

    var modes = trustedApplicationState.formElements.modes.filter(function (checkbox) {
      return checkbox.checked;
    }).map(function (checkbox) {
      return checkbox.value;
    });
    var deletions = (0, _trustedApplications.getStatementsToDelete)(trustedApplicationState.origin || origin, subject, _solidUi.store, _solidUi.ns);
    var additions = (0, _trustedApplications.getStatementsToAdd)(origin, (0, _trustedApplications.generateRandomString)(), modes, subject, _solidUi.ns);

    if (!_solidUi.store.updater) {
      throw new Error('Store has no updater');
    }

    _solidUi.store.updater.update(deletions, additions, handleUpdateResponse);
  }

  function removeApplication(event) {
    event.preventDefault();
    var origin;

    try {
      origin = (0, _rdflib.sym)(trustedApplicationState.formElements.origin.value);
    } catch (err) {
      return alert('Please provide an application URL you want to remove trust from');
    }

    var deletions = (0, _trustedApplications.getStatementsToDelete)(origin, subject, _solidUi.store, _solidUi.ns);

    if (!_solidUi.store.updater) {
      throw new Error('Store has no updater');
    }

    _solidUi.store.updater.update(deletions, [], handleUpdateResponse);
  }

  function handleUpdateResponse(uri, success, errorBody) {
    if (success) {
      return updateTable();
    }

    console.error(uri, errorBody);
  }
}

function createElement(elementName) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var eventListeners = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var onCreated = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var element = document.createElement(elementName);

  if (onCreated) {
    onCreated(element);
  }

  Object.keys(attributes).forEach(function (attName) {
    element.setAttribute(attName, attributes[attName]);
  });
  Object.keys(eventListeners).forEach(function (eventName) {
    element.addEventListener(eventName, eventListeners[eventName]);
  });
  return element;
}

function createContainer(elementName, children) {
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var eventListeners = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var onCreated = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var element = createElement(elementName, attributes, eventListeners, onCreated);
  children.forEach(function (child) {
    return element.appendChild(child);
  });
  return element;
}

function createText(elementName, textContent) {
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var eventListeners = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var onCreated = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var element = createElement(elementName, attributes, eventListeners, onCreated);
  element.textContent = textContent;
  return element;
}

function createModesInput(_ref2) {
  var appModes = _ref2.appModes,
      formElements = _ref2.formElements;
  return ['Read', 'Write', 'Append', 'Control'].map(function (mode) {
    var isChecked = appModes.some(function (appMode) {
      return appMode.value === _solidUi.ns.acl(mode).value;
    });
    return createContainer('label', [createElement('input', _objectSpread(_objectSpread({
      type: 'checkbox'
    }, isChecked ? {
      checked: ''
    } : {}), {}, {
      value: _solidUi.ns.acl(mode).uri
    }), {}, function (element) {
      return formElements.modes.push(element);
    }), createText('span', mode)]);
  });
}
//# sourceMappingURL=trustedApplications.dom.js.map