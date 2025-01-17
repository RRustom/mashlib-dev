"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.complain = complain;
exports.clearElement = clearElement;
exports.extractLogURI = extractLogURI;
exports.shortDate = shortDate;
exports.formatDateTime = formatDateTime;
exports.timestamp = timestamp;
exports.shortTime = shortTime;
exports.setName = setName;
exports.imagesOf = imagesOf;
exports.findImageFromURI = findImageFromURI;
exports.findImage = findImage;
exports.setImage = setImage;
exports.faviconOrDefault = faviconOrDefault;
exports.deleteButtonWithCheck = deleteButtonWithCheck;
exports.button = button;
exports.cancelButton = cancelButton;
exports.continueButton = continueButton;
exports.askName = askName;
exports.linkIcon = linkIcon;
exports.renderAsRow = renderAsRow;
exports.refreshTree = refreshTree;
exports.attachmentList = attachmentList;
exports.openHrefInOutlineMode = openHrefInOutlineMode;
exports.defaultAnnotationStore = defaultAnnotationStore;
exports.allClassURIs = allClassURIs;
exports.propertyTriage = propertyTriage;
exports.linkButton = linkButton;
exports.removeButton = removeButton;
exports.selectorPanel = selectorPanel;
exports.selectorPanelRefresh = selectorPanelRefresh;
exports.addStyleSheet = addStyleSheet;
exports.isAudio = isAudio;
exports.isVideo = isVideo;
exports.isImage = isImage;
exports.fileUploadButtonDiv = fileUploadButtonDiv;
exports.index = exports.personTR = exports.iconForClass = void 0;

var _rdflib = require("rdflib");

var _iconBase = require("../iconBase");

var _ns = _interopRequireDefault(require("../ns"));

var _style2 = _interopRequireDefault(require("../style"));

var debug = _interopRequireWildcard(require("../debug"));

var _log = require("../log");

var _jss = require("../jss");

var _dragAndDrop = require("./dragAndDrop.js");

var _logic = require("../logic");

/**
 * UI Widgets such as buttons
 * @packageDocumentation
 */

/* global alert */
var utils = require('../utils');

var error = require('./error');

var dragAndDrop = require('./dragAndDrop');

var store = _logic.solidLogicSingleton.store;
var cancelIconURI = _iconBase.iconBase + 'noun_1180156.svg'; // black X

var checkIconURI = _iconBase.iconBase + 'noun_1180158.svg'; // green checkmark; Continue

function getStatusArea(context) {
  var box = context && context.statusArea || context && context.div || null;
  if (box) return box;
  var dom = context && context.dom;

  if (!dom && typeof document !== 'undefined') {
    dom = document;
  }

  if (dom) {
    var body = dom.getElementsByTagName('body')[0];
    box = dom.createElement('div');
    body.insertBefore(box, body.firstElementChild);

    if (context) {
      context.statusArea = box;
    }

    return box;
  }

  return null;
}
/**
 * Display an error message block
 */


function complain(context, err) {
  if (!err) return; // only if error

  var ele = getStatusArea(context);
  debug.log('Complaint: ' + err);
  if (ele) ele.appendChild(error.errorMessageBlock(context && context.dom || document, err));else alert(err);
}
/**
 * Remove all the children of an HTML element
 */


function clearElement(ele) {
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }

  return ele;
}
/**
 * To figure out the log URI from the full URI used to invoke the reasoner
 */


function extractLogURI(fullURI) {
  var logPos = fullURI.search(/logFile=/);
  var rulPos = fullURI.search(/&rulesFile=/);
  return fullURI.substring(logPos + 8, rulPos);
}
/**
 * By default, converts e.g. '2020-02-19T19:35:28.557Z' to '19:35'
 * if today is 19 Feb 2020, and to 'Feb 19' if not.
 * @@@ TODO This needs to be changed to local time
 * @param noTime Return a string like 'Feb 19' even if it's today.
 */


function shortDate(str, noTime) {
  if (!str) return '???';
  var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  try {
    var nowZ = new Date().toISOString(); // var nowZ = $rdf.term(now).value
    // var n = now.getTimezoneOffset() // Minutes

    if (str.slice(0, 10) === nowZ.slice(0, 10) && !noTime) {
      return str.slice(11, 16);
    }

    if (str.slice(0, 4) === nowZ.slice(0, 4)) {
      return month[parseInt(str.slice(5, 7), 10) - 1] + ' ' + parseInt(str.slice(8, 10), 10);
    }

    return str.slice(0, 10);
  } catch (e) {
    return 'shortdate:' + e;
  }
}
/**
 * Format a date and time
 * @param date for instance `new Date()`
 * @param format  for instance '{FullYear}-{Month}-{Date}T{Hours}:{Minutes}:{Seconds}.{Milliseconds}'
 * @returns for instance '2000-01-15T23:14:23.002'
 */


function formatDateTime(date, format) {
  return format.split('{').map(function (s) {
    var k = s.split('}')[0];
    var width = {
      Milliseconds: 3,
      FullYear: 4
    };
    var d = {
      Month: 1
    };
    return s ? ('000' + (date['get' + k]() + (d[k] || 0))).slice(-(width[k] || 2)) + s.split('}')[1] : '';
  }).join('');
}
/**
 * Get a string representation of the current time
 * @returns for instance '2000-01-15T23:14:23.002'
 */


function timestamp() {
  return formatDateTime(new Date(), '{FullYear}-{Month}-{Date}T{Hours}:{Minutes}:{Seconds}.{Milliseconds}');
}
/**
 * Get a short string representation of the current time
 * @returns for instance '23:14:23.002'
 */


function shortTime() {
  return formatDateTime(new Date(), '{Hours}:{Minutes}:{Seconds}.{Milliseconds}');
} // ///////////////////// Handy UX widgets

/**
 * Sets the best name we have and looks up a better one
 */


function setName(element, x) {
  var kb = store;

  var findName = function findName(x) {
    var name = kb.any(x, _ns["default"].vcard('fn')) || kb.any(x, _ns["default"].foaf('name')) || kb.any(x, _ns["default"].vcard('organization-name'));
    return name ? name.value : null;
  };

  var name = x.sameTerm(_ns["default"].foaf('Agent')) ? 'Everyone' : findName(x);
  element.textContent = name || utils.label(x);

  if (!name && x.uri) {
    if (!kb.fetcher) {
      throw new Error('kb has no fetcher');
    } // Note this is only a fetch, not a lookUP of all sameAs etc


    kb.fetcher.nowOrWhenFetched(x.doc(), undefined, function (_ok) {
      element.textContent = findName(x) || utils.label(x); // had: (ok ? '' : '? ') +
    });
  }
}
/**
 * Set of suitable images
 * See also [[findImage]]
 * @param x The thing for which we want to find an image
 * @param kb The RDF store to look in
 * @returns It goes looking for triples in `kb`,
 *          `(subject: x), (predicate: see list below) (object: image-url)`
 *          to find any image linked from the thing with one of the following
 *          predicates (in order):
 *          * ns.sioc('avatar')
 *          * ns.foaf('img')
 *          * ns.vcard('logo')
 *          * ns.vcard('hasPhoto')
 *          * ns.vcard('photo')
 *          * ns.foaf('depiction')

 */


function imagesOf(x, kb) {
  return kb.each(x, _ns["default"].sioc('avatar')).concat(kb.each(x, _ns["default"].foaf('img'))).concat(kb.each(x, _ns["default"].vcard('logo'))).concat(kb.each(x, _ns["default"].vcard('hasPhoto'))).concat(kb.each(x, _ns["default"].vcard('photo'))).concat(kb.each(x, _ns["default"].foaf('depiction')));
}
/**
 * Best logo or avatar or photo etc to represent someone or some group etc
 */


var iconForClass = {
  // Potentially extendable by other apps, panes, etc
  // Relative URIs to the iconBase
  'solid:AppProviderClass': 'noun_144.svg',
  //  @@ classs name should not contain 'Class'
  'solid:AppProvider': 'noun_15177.svg',
  // @@
  'solid:Pod': 'noun_Cabinet_1434380.svg',
  'vcard:Group': 'noun_339237.svg',
  'vcard:Organization': 'noun_143899.svg',
  'vcard:Individual': 'noun_15059.svg',
  'schema:Person': 'noun_15059.svg',
  'foaf:Person': 'noun_15059.svg',
  'foaf:Agent': 'noun_98053.svg',
  'acl:AuthenticatedAgent': 'noun_99101.svg',
  'prov:SoftwareAgent': 'noun_Robot_849764.svg',
  // Bot
  'vcard:AddressBook': 'noun_15695.svg',
  'trip:Trip': 'noun_581629.svg',
  'meeting:LongChat': 'noun_1689339.svg',
  'meeting:Meeting': 'noun_66617.svg',
  'meeting:Project': 'noun_1036577.svg',
  'ui:Form': 'noun_122196.svg',
  'rdfs:Class': 'class-rectangle.svg',
  // For RDF developers
  'rdf:Property': 'property-diamond.svg',
  'owl:Ontology': 'noun_classification_1479198.svg',
  'wf:Tracker': 'noun_122196.svg',
  'wf:Task': 'noun_17020_gray-tick.svg',
  'wf:Open': 'noun_17020_sans-tick.svg',
  'wf:Closed': 'noun_17020.svg'
};
/**
 * Returns the origin of the URI of a NamedNode
 */

exports.iconForClass = iconForClass;

function tempSite(x) {
  // use only while one in rdflib fails with origins 2019
  var str = x.uri.split('#')[0];
  var p = str.indexOf('//');
  if (p < 0) throw new Error('This URI does not have a web site part (origin)');
  var q = str.indexOf('/', p + 2);

  if (q < 0) {
    // no third slash?
    return str.slice(0) + '/'; // Add slash to a bare origin
  } else {
    return str.slice(0, q + 1);
  }
}
/**
 * Find an image for this thing as a class
 */


function findImageFromURI(x) {
  var iconDir = _iconBase.iconBase; // Special cases from URI scheme:

  if (typeof x !== 'string' && x.uri) {
    if (x.uri.split('/').length === 4 && !x.uri.split('/')[1] && !x.uri.split('/')[3]) {
      return iconDir + 'noun_15177.svg'; // App -- this is an origin
    } // Non-HTTP URI types imply types


    if (x.uri.startsWith('message:') || x.uri.startsWith('mid:')) {
      // message: is apple bug-- should be mid:
      return iconDir + 'noun_480183.svg'; // envelope  noun_567486
    }

    if (x.uri.startsWith('mailto:')) {
      return iconDir + 'noun_567486.svg'; // mailbox - an email desitination
    } // For HTTP(s) documents, we could look at the MIME type if we know it.


    if (x.uri.startsWith('https:') && x.uri.indexOf('#') < 0) {
      return tempSite(x) + 'favicon.ico'; // was x.site().uri + ...
      // Todo: make the document icon a fallback for if the favicon does not exist
      // todo: pick up a possible favicon for the web page itself from a link
      // was: return iconDir + 'noun_681601.svg' // document - under solid assumptions
    }

    return null;
  }

  return iconDir + 'noun_10636_grey.svg'; // Grey Circle -  some thing
}
/**
 * Find something we have as explicit image data for the thing
 * See also [[imagesOf]]
 * @param thing The thing for which we want to find an image
 * @returns The URL of a globe icon if thing equals `ns.foaf('Agent')`
 *          or `ns.rdf('Resource')`. Otherwise, it goes looking for
 *          triples in `store`,
 *          `(subject: thing), (predicate: see list below) (object: image-url)`
 *          to find any image linked from the thing with one of the following
 *          predicates (in order):
 *          * ns.sioc('avatar')
 *          * ns.foaf('img')
 *          * ns.vcard('logo')
 *          * ns.vcard('hasPhoto')
 *          * ns.vcard('photo')
 *          * ns.foaf('depiction')
 */


function findImage(thing) {
  var kb = store;
  var iconDir = _iconBase.iconBase;

  if (thing.sameTerm(_ns["default"].foaf('Agent')) || thing.sameTerm(_ns["default"].rdf('Resource'))) {
    return iconDir + 'noun_98053.svg'; // Globe
  }

  var image = kb.any(thing, _ns["default"].sioc('avatar')) || kb.any(thing, _ns["default"].foaf('img')) || kb.any(thing, _ns["default"].vcard('logo')) || kb.any(thing, _ns["default"].vcard('hasPhoto')) || kb.any(thing, _ns["default"].vcard('photo')) || kb.any(thing, _ns["default"].foaf('depiction'));
  return image ? image.uri : null;
}
/**
 * Do the best you can with the data available
 *
 * @return {Boolean} Are we happy with this icon?
 * Sets src AND STYLE of the image.
 */


function trySetImage(element, thing, iconForClassMap) {
  var kb = store;
  var explitImage = findImage(thing);

  if (explitImage) {
    element.setAttribute('src', explitImage);
    return true;
  } // This is one of the classes we know about - the class itself?


  var typeIcon = iconForClassMap[thing.uri];

  if (typeIcon) {
    element.setAttribute('src', typeIcon);
    element.style = _style2["default"].classIconStyle; // element.style.border = '0.1em solid green;'
    // element.style.backgroundColor = '#eeffee' // pale green

    return true;
  }

  var schemeIcon = findImageFromURI(thing);

  if (schemeIcon) {
    element.setAttribute('src', schemeIcon);
    return true; // happy with this -- don't look it up
  } // Do we have a generic icon for something in any class its in?


  var types = kb.findTypeURIs(thing);

  for (var typeURI in types) {
    if (iconForClassMap[typeURI]) {
      element.setAttribute('src', iconForClassMap[typeURI]);
      return false; // maybe we can do better
    }
  }

  element.setAttribute('src', _iconBase.iconBase + 'noun_10636_grey.svg'); // Grey Circle -  some thing

  return false; // we can do better
}
/**
 * ToDo: Also add icons for *properties* like  home, work, email, range, domain, comment,
 */


function setImage(element, thing) {
  // 20191230a
  var kb = store;
  var iconForClassMap = {};

  for (var k in iconForClass) {
    var pref = k.split(':')[0];
    var id = k.split(':')[1];

    var theClass = _ns["default"][pref](id);

    iconForClassMap[theClass.uri] = _rdflib.uri.join(iconForClass[k], _iconBase.iconBase);
  }

  var happy = trySetImage(element, thing, iconForClassMap);

  if (!happy && thing.uri) {
    if (!kb.fetcher) {
      throw new Error('kb has no fetcher');
    }

    kb.fetcher.nowOrWhenFetched(thing.doc(), undefined, function (ok) {
      if (ok) {
        trySetImage(element, thing, iconForClassMap);
      }
    });
  }
} // If a web page, then a favicon, with a fallback to ???
// See, e.g., http://stackoverflow.com/questions/980855/inputting-a-default-image


function faviconOrDefault(dom, x) {
  var image = dom.createElement('img');
  image.style = _style2["default"].iconStyle;

  var isOrigin = function isOrigin(x) {
    if (!x.uri) return false;
    var parts = x.uri.split('/');
    return parts.length === 3 || parts.length === 4 && parts[3] === '';
  };

  image.setAttribute('src', _iconBase.iconBase + (isOrigin(x) ? 'noun_15177.svg' : 'noun_681601.svg') // App symbol vs document
  );

  if (x.uri && x.uri.startsWith('https:') && x.uri.indexOf('#') < 0) {
    var res = dom.createElement('object'); // favico with a fallback of a default image if no favicon

    res.setAttribute('data', tempSite(x) + 'favicon.ico');
    res.setAttribute('type', 'image/x-icon');
    res.appendChild(image); // fallback

    return res;
  } else {
    setImage(image, x);
    return image;
  }
}
/**
 * Delete button with a check you really mean it
 * @@ Supress check if command key held down?
 */


function deleteButtonWithCheck(dom, container, noun, deleteFunction) {
  var minusIconURI = _iconBase.iconBase + 'noun_2188_red.svg'; // white minus in red #cc0000 circle
  // var delButton = dom.createElement('button')

  var img = dom.createElement('img');
  img.setAttribute('src', minusIconURI); //  plus sign

  img.setAttribute('style', 'margin: 0.2em; width: 1em; height:1em');
  img.title = 'Remove this ' + noun;
  var deleteButtonElt = img;
  container.appendChild(deleteButtonElt);
  container.setAttribute('class', 'hoverControl'); // See tabbedtab.css (sigh global CSS)

  deleteButtonElt.setAttribute('class', 'hoverControlHide'); // delButton.setAttribute('style', 'color: red; margin-right: 0.3em; foat:right; text-align:right')

  deleteButtonElt.addEventListener('click', function (_event) {
    container.removeChild(deleteButtonElt); // Ask -- are you sure?

    var cancelButtonElt = dom.createElement('button'); // cancelButton.textContent = 'cancel'

    cancelButtonElt.setAttribute('style', _style2["default"].buttonStyle);
    var img = cancelButtonElt.appendChild(dom.createElement('img'));
    img.setAttribute('src', cancelIconURI);
    img.setAttribute('style', _style2["default"].buttonStyle);
    container.appendChild(cancelButtonElt).addEventListener('click', function (_event) {
      container.removeChild(sureButtonElt);
      container.removeChild(cancelButtonElt);
      container.appendChild(deleteButtonElt);
    }, false);
    var sureButtonElt = dom.createElement('button');
    sureButtonElt.textContent = 'Delete ' + noun;
    sureButtonElt.setAttribute('style', _style2["default"].buttonStyle);
    container.appendChild(sureButtonElt).addEventListener('click', function (_event) {
      container.removeChild(sureButtonElt);
      container.removeChild(cancelButtonElt);
      deleteFunction();
    }, false);
  }, false);
  return deleteButtonElt;
}
/**
 * Get the button style, based on options.
 * See https://design.inrupt.com/atomic-core/?cat=Atoms#Buttons
 */


function getButtonStyle() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // default to primary color
  var color = options.buttonColor === 'Secondary' ? '#01c9ea' : '#7c4dff';
  var backgroundColor = color;
  var fontColor = '#ffffff';
  var borderColor = color; // default to primary color

  var hoverBackgroundColor = options.buttonColor === 'Secondary' ? '#37cde6' : '#9f7dff';
  var hoverFontColor = fontColor;

  if (options.needsBorder) {
    backgroundColor = '#ffffff';
    fontColor = color;
    borderColor = color;
    hoverBackgroundColor = color;
    hoverFontColor = backgroundColor;
  }

  return {
    'background-color': "".concat(backgroundColor),
    color: "".concat(fontColor),
    'font-family': 'Raleway, Roboto, sans-serif',
    'border-radius': '0.25em',
    'border-color': "".concat(borderColor),
    border: '1px solid',
    cursor: 'pointer',
    'font-size': '.8em',
    'text-decoration': 'none',
    padding: '0.5em 4em',
    transition: '0.25s all ease-in-out',
    outline: 'none',
    '&:hover': {
      'background-color': "".concat(hoverBackgroundColor),
      color: "".concat(hoverFontColor),
      transition: '0.25s all ease-in-out'
    }
  };
}
/*  Make a button
 *
 * @param dom - the DOM document object
 * @Param iconURI - the URI of the icon to use (if any)
 * @param text - the tooltip text or possibly button contents text
 * @param handler <function> - A handler to called when button is clicked
 *
 * @returns <dDomElement> - the button
 */


function button(dom, iconURI, text, handler) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    buttonColor: 'Primary',
    needsBorder: false
  };
  var button = dom.createElement('button');
  button.setAttribute('type', 'button'); // button.innerHTML = text  // later, user preferences may make text preferred for some

  if (iconURI) {
    var img = button.appendChild(dom.createElement('img'));
    img.setAttribute('src', iconURI);
    img.setAttribute('style', 'width: 2em; height: 2em;'); // trial and error. 2em disappears

    img.title = text;
    button.setAttribute('style', _style2["default"].buttonStyle);
  } else {
    button.textContent = text.toLocaleUpperCase();

    var _style = getButtonStyle(options);

    var _getClasses = (0, _jss.getClasses)(dom.head, {
      textButton: _style
    }),
        classes = _getClasses.classes;

    button.classList.add(classes.textButton);
  }

  if (handler) {
    button.addEventListener('click', handler, false);
  }

  return button;
}
/*  Make a cancel button
 *
 * @param dom - the DOM document object
 * @param handler <function> - A handler to called when button is clicked
 *
 * @returns <dDomElement> - the button
 */


function cancelButton(dom, handler) {
  return button(dom, cancelIconURI, 'Cancel', handler);
}
/*  Make a continue button
 *
 * @param dom - the DOM document object
 * @param handler <function> - A handler to called when button is clicked
 *
 * @returns <dDomElement> - the button
 */


function continueButton(dom, handler) {
  return button(dom, checkIconURI, 'Continue', handler);
}
/* Grab a name for a new thing
 *
 * Form to get the name of a new thing before we create it
 * @params theClass  Misspelt to avoid clashing with the JavaScript keyword
 * @returns: a promise of (a name or null if cancelled)
 */


function askName(dom, kb, container, predicate, theClass, noun) {
  // eslint-disable-next-line promise/param-names
  return new Promise(function (resolve, _reject) {
    var form = dom.createElement('div'); // form is broken as HTML behaviour can resurface on js error
    // classLabel = utils.label(ns.vcard('Individual'))

    predicate = predicate || _ns["default"].foaf('name'); // eg 'name' in user's language

    noun = noun || (theClass ? utils.label(theClass) : '  '); // eg 'folder' in users's language

    var prompt = noun + ' ' + utils.label(predicate) + ': ';
    form.appendChild(dom.createElement('p')).textContent = prompt;
    var namefield = dom.createElement('input');
    namefield.setAttribute('type', 'text');
    namefield.setAttribute('size', '100');
    namefield.setAttribute('maxLength', '2048'); // No arbitrary limits

    namefield.setAttribute('style', _style2["default"].textInputStyle);
    namefield.select(); // focus next user input

    form.appendChild(namefield);
    container.appendChild(form); // namefield.focus()

    function gotName() {
      form.parentNode.removeChild(form);
      resolve(namefield.value.trim());
    }

    namefield.addEventListener('keyup', function (e) {
      if (e.keyCode === 13) {
        gotName();
      }
    }, false);
    form.appendChild(dom.createElement('br'));
    form.appendChild(cancelButton(dom, function (_event) {
      form.parentNode.removeChild(form);
      resolve(null);
    }));
    form.appendChild(continueButton(dom, function (_event) {
      gotName();
    }));
    namefield.focus();
  }); // Promise
} // ////////////////////////////////////////////////////////////////

/**
 * A little link icon
 */


function linkIcon(dom, subject, iconURI) {
  var anchor = dom.createElement('a');
  anchor.setAttribute('href', subject.uri);

  if (subject.uri.startsWith('http')) {
    // If diff web page
    anchor.setAttribute('target', '_blank'); // open in a new tab or window
  } // as mailboxes and mail messages do not need new browser window


  var img = anchor.appendChild(dom.createElement('img'));
  img.setAttribute('src', iconURI || _iconBase.originalIconBase + 'go-to-this.png');
  img.setAttribute('style', 'margin: 0.3em;');
  return anchor;
}
/**
 * A TR to represent a draggable person, etc in a list
 *
 * pred is unused param at the moment
 */


var personTR = renderAsRow; // The legacy name is used in a lot of places

exports.personTR = personTR;

function renderAsRow(dom, pred, obj, options) {
  var tr = dom.createElement('tr');
  options = options || {}; // tr.predObj = [pred.uri, obj.uri]   moved to acl-control

  var td1 = tr.appendChild(dom.createElement('td'));
  var td2 = tr.appendChild(dom.createElement('td'));
  var td3 = tr.appendChild(dom.createElement('td')); // const image = td1.appendChild(dom.createElement('img'))

  var image = options.image || faviconOrDefault(dom, obj);
  td1.setAttribute('style', 'vertical-align: middle; width:2.5em; padding:0.5em; height: 2.5em;');
  td2.setAttribute('style', 'vertical-align: middle; text-align:left;');
  td3.setAttribute('style', 'vertical-align: middle; width:2em; padding:0.5em; height: 4em;');
  td1.appendChild(image);

  if (options.title) {
    td2.textContent = options.title;
  } else {
    setName(td2, obj); // This is async
  }

  if (options.deleteFunction) {
    deleteButtonWithCheck(dom, td3, options.noun || 'one', options.deleteFunction);
  }

  if (obj.uri) {
    // blank nodes need not apply
    if (options.link !== false) {
      var anchor = td3.appendChild(linkIcon(dom, obj));
      anchor.classList.add('HoverControlHide');
      td3.appendChild(dom.createElement('br'));
    }

    if (options.draggable !== false) {
      // default is on
      image.setAttribute('draggable', 'false'); // Stop the image being dragged instead - just the TR

      dragAndDrop.makeDraggable(tr, obj);
    }
  }

  ;
  tr.subject = obj;
  return tr;
}
/**
 * Refresh a DOM tree recursively
 */


function refreshTree(root) {
  if (root.refresh) {
    root.refresh();
    return;
  }

  for (var i = 0; i < root.children.length; i++) {
    refreshTree(root.children[i]);
  }
}
/**
 * Options argument for [[attachmentList]] function
 */


/**
 * Component that displays a list of resources, for instance
 * the attachments of a message, or the various documents related
 * to a meeting.
 * Accepts dropping URLs onto it to add attachments to it.
 */
function attachmentList(dom, subject, div) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // options = options || {}
  var deleteAttachment = function deleteAttachment(target) {
    if (!kb.updater) {
      throw new Error('kb has no updater');
    }

    kb.updater.update((0, _rdflib.st)(subject, predicate, target, doc), [], function (uri, ok, errorBody, _xhr) {
      if (ok) {
        refresh();
      } else {
        complain(undefined, 'Error deleting one: ' + errorBody);
      }
    });
  };

  function createNewRow(target) {
    var theTarget = target;
    var opt = {
      noun: noun
    };

    if (modify) {
      opt.deleteFunction = function () {
        deleteAttachment(theTarget);
      };
    }

    return personTR(dom, predicate, target, opt);
  }

  var refresh = function refresh() {
    var things = kb.each(subject, predicate);
    things.sort();
    utils.syncTableToArray(attachmentTable, things, createNewRow);
  };

  function droppedURIHandler(uris) {
    var ins = [];
    uris.forEach(function (u) {
      var target = (0, _rdflib.sym)(u); // Attachment needs text label to disinguish I think not icon.

      debug.log('Dropped on attachemnt ' + u); // icon was: iconBase + 'noun_25830.svg'

      ins.push((0, _rdflib.st)(subject, predicate, target, doc));
    });

    if (!kb.updater) {
      throw new Error('kb has no updater');
    }

    kb.updater.update([], ins, function (uri, ok, errorBody, _xhr) {
      if (ok) {
        refresh();
      } else {
        complain(undefined, 'Error adding one: ' + errorBody);
      }
    });
  }

  function droppedFileHandler(files) {
    var _options$uploadFolder, _options$uploadFolder2;

    (0, _dragAndDrop.uploadFiles)(kb.fetcher, files, (_options$uploadFolder = options.uploadFolder) === null || _options$uploadFolder === void 0 ? void 0 : _options$uploadFolder.uri, // Files
    (_options$uploadFolder2 = options.uploadFolder) === null || _options$uploadFolder2 === void 0 ? void 0 : _options$uploadFolder2.uri, // Pictures
    function (theFile, destURI) {
      var ins = [(0, _rdflib.st)(subject, predicate, kb.sym(destURI), doc)];

      if (!kb.updater) {
        throw new Error('kb has no updater');
      }

      kb.updater.update([], ins, function (uri, ok, errorBody, _xhr) {
        if (ok) {
          refresh();
        } else {
          complain(undefined, 'Error adding link to uploaded file: ' + errorBody);
        }
      });
    });
  }

  var doc = options.doc || subject.doc();
  if (options.modify === undefined) options.modify = true;
  var modify = options.modify;
  var promptIcon = options.promptIcon || _iconBase.iconBase + 'noun_748003.svg'; //    target
  // const promptIcon = options.promptIcon || (iconBase + 'noun_25830.svg') //  paperclip

  var predicate = options.predicate || _ns["default"].wf('attachment');

  var noun = options.noun || 'attachment';
  var kb = store;
  var attachmentOuter = div.appendChild(dom.createElement('table'));
  attachmentOuter.setAttribute('style', 'margin-top: 1em; margin-bottom: 1em;');
  var attachmentOne = attachmentOuter.appendChild(dom.createElement('tr'));
  var attachmentLeft = attachmentOne.appendChild(dom.createElement('td'));
  var attachmentRight = attachmentOne.appendChild(dom.createElement('td'));
  var attachmentTable = attachmentRight.appendChild(dom.createElement('table'));
  attachmentTable.appendChild(dom.createElement('tr')) // attachmentTableTop
  ;
  attachmentOuter.refresh = refresh; // Participate in downstream changes
  // ;(attachmentTable as any).refresh = refresh   <- outer should be best?

  refresh();

  if (modify) {
    // const buttonStyle = 'width; 2em; height: 2em; margin: 0.5em; padding: 0.1em;'
    var paperclip = button(dom, promptIcon, 'Drop attachments here'); // paperclip.style = buttonStyle // @@ needed?  default has white background

    attachmentLeft.appendChild(paperclip);
    var fhandler = options.uploadFolder ? droppedFileHandler : null;
    dragAndDrop.makeDropTarget(paperclip, droppedURIHandler, fhandler); // beware missing the wire of the paparclip!

    dragAndDrop.makeDropTarget(attachmentLeft, droppedURIHandler, fhandler); // just the outer won't do it

    if (options.uploadFolder) {
      // Addd an explicit file upload button as well
      var buttonDiv = fileUploadButtonDiv(dom, droppedFileHandler);
      attachmentLeft.appendChild(buttonDiv); // buttonDiv.children[1].style =  buttonStyle
    }
  }

  return attachmentOuter;
} // /////////////////////////////////////////////////////////////////////////////

/**
 * Event Handler for links within solid apps.
 *
 * Note that native links have constraints in Firefox, they
 * don't work with local files for instance (2011)
 */


function openHrefInOutlineMode(e) {
  e.preventDefault();
  e.stopPropagation();
  var target = utils.getTarget(e);
  var uri = target.getAttribute('href');
  if (!uri) return debug.log('openHrefInOutlineMode: No href found!\n');
  var dom = window.document;

  if (dom.outlineManager) {
    // @@ TODO Remove the use of document as a global object
    ;
    dom.outlineManager.GotoSubject(store.sym(uri), true, undefined, true, undefined);
  } else if (window && window.panes && window.panes.getOutliner) {
    // @@ TODO Remove the use of window as a global object
    ;
    window.panes.getOutliner().GotoSubject(store.sym(uri), true, undefined, true, undefined);
  } else {
    debug.log('ERROR: Can\'t access outline manager in this config');
  } // dom.outlineManager.GotoSubject(store.sym(uri), true, undefined, true, undefined)

}
/**
 * Make a URI in the Tabulator.org annotation store out of the URI of the thing to be annotated.
 *
 * @@ Todo: make it a personal preference.
 */


function defaultAnnotationStore(subject) {
  if (subject.uri === undefined) return undefined;
  var s = subject.uri;
  if (s.slice(0, 7) !== 'http://') return undefined;
  s = s.slice(7); // Remove

  var hash = s.indexOf('#');
  if (hash >= 0) s = s.slice(0, hash); // Strip trailing
  else {
      var slash = s.lastIndexOf('/');
      if (slash < 0) return undefined;
      s = s.slice(0, slash);
    }
  return store.sym('http://tabulator.org/wiki/annnotation/' + s);
}
/**
 * Retrieve all RDF class URIs from solid-ui's RDF store
 * @returns an object `ret` such that `Object.keys(ret)` is
 * the list of all class URIs.
 */


function allClassURIs() {
  var set = {};
  store.statementsMatching(undefined, _ns["default"].rdf('type'), undefined).forEach(function (st) {
    if (st.object.value) set[st.object.value] = true;
  });
  store.statementsMatching(undefined, _ns["default"].rdfs('subClassOf'), undefined).forEach(function (st) {
    if (st.object.value) set[st.object.value] = true;
    if (st.subject.value) set[st.subject.value] = true;
  });
  store.each(undefined, _ns["default"].rdf('type'), _ns["default"].rdfs('Class')).forEach(function (c) {
    if (c.value) set[c.value] = true;
  });
  return set;
}
/**
 * Figuring which properties we know about
 *
 * When the user inputs an RDF property, like for a form field
 * or when specifying the relationship between two arbitrary things,
 * then er can prompt them with properties the session knows about
 *
 * TODO: Look again by catching this somewhere. (On the kb?)
 * TODO: move to diff module? Not really a button.
 * @param {Store} kb The quadstore to be searched.
 */


function propertyTriage(kb) {
  var possibleProperties = {}; // if (possibleProperties === undefined) possibleProperties = {}
  // const kb = store

  var dp = {};
  var op = {};
  var no = 0;
  var nd = 0;
  var nu = 0;
  var pi = kb.predicateIndex; // One entry for each pred

  for (var p in pi) {
    var object = pi[p][0].object;

    if (object.termType === 'Literal') {
      dp[p] = true;
      nd++;
    } else {
      op[p] = true;
      no++;
    }
  } // If nothing discovered, then could be either:


  var ps = kb.each(undefined, _ns["default"].rdf('type'), _ns["default"].rdf('Property'));

  for (var i = 0; i < ps.length; i++) {
    var _p = ps[i].toNT();

    if (!op[_p] && !dp[_p]) {
      dp[_p] = true;
      op[_p] = true;
      nu++;
    }
  }

  possibleProperties.op = op;
  possibleProperties.dp = dp;
  (0, _log.info)("propertyTriage: ".concat(no, " non-lit, ").concat(nd, " literal. ").concat(nu, " unknown."));
  return possibleProperties;
}
/**
 * General purpose widgets
 */

/**
 * A button for jumping
 */


function linkButton(dom, object) {
  var b = dom.createElement('button');
  b.setAttribute('type', 'button');
  b.textContent = 'Goto ' + utils.label(object);
  b.addEventListener('click', function (_event) {
    // b.parentNode.removeChild(b)
    ;
    dom.outlineManager.GotoSubject(object, true, undefined, true, undefined);
  }, true);
  return b;
}
/**
 * A button to remove some other element from the page
 */


function removeButton(dom, element) {
  var b = dom.createElement('button');
  b.setAttribute('type', 'button');
  b.textContent = '✕'; // MULTIPLICATION X

  b.addEventListener('click', function (_event) {
    ;
    element.parentNode.removeChild(element);
  }, true);
  return b;
} //      Description text area
//
// Make a box to demand a description or display existing one
//
// @param dom - the document DOM for the user interface
// @param kb - the graph which is the knowledge base we are working with
// @param subject - a term, the subject of the statement(s) being edited.
// @param predicate - a term, the predicate of the statement(s) being edited
// @param store - The web document being edited
// @param callbackFunction - takes (boolean ok, string errorBody)
// /////////////////////////////////////// Random I/O widgets /////////////
// ////              Column Header Buttons
//
//  These are for selecting different modes, sources,styles, etc.
//

/*
buttons.headerButtons = function (dom, kb, name, words) {
    const box = dom.createElement('table')
    var i, word, s = '<tr>'
    box.setAttribute('style', 'width: 90%; height: 1.5em')
    for (i=0; i<words.length; i++) {
        s += '<td><input type="radio" name="' + name + '" id="' + words[i] + '" value='
    }
    box.innerHTML = s + '</tr>'

}
*/
// ////////////////////////////////////////////////////////////
//
//     selectorPanel
//
//  A vertical panel for selecting connections to left or right.
//
//   @param inverse means this is the object rather than the subject
//


function selectorPanel(dom, kb, type, predicate, inverse, possible, options, callbackFunction, linkCallback) {
  return selectorPanelRefresh(dom.createElement('div'), dom, kb, type, predicate, inverse, possible, options, callbackFunction, linkCallback);
}

function selectorPanelRefresh(list, dom, kb, type, predicate, inverse, possible, options, callbackFunction, linkCallback) {
  var style0 = 'border: 0.1em solid #ddd; border-bottom: none; width: 95%; height: 2em; padding: 0.5em;';
  var selected = null;
  list.innerHTML = '';

  var refreshItem = function refreshItem(box, x) {
    // Scope to hold item and x
    var item; // eslint-disable-next-line prefer-const

    var image;

    var setStyle = function setStyle() {
      var already = inverse ? kb.each(undefined, predicate, x) : kb.each(x, predicate);
      iconDiv.setAttribute('class', already.length === 0 ? 'hideTillHover' : ''); // See tabbedtab.css

      image.setAttribute('src', options.connectIcon || _iconBase.iconBase + 'noun_25830.svg');
      image.setAttribute('title', already.length ? already.length : 'attach');
    };

    var f = index.twoLine.widgetForClass(type); // eslint-disable-next-line prefer-const

    item = f(dom, x);
    item.setAttribute('style', style0);
    var nav = dom.createElement('div');
    nav.setAttribute('class', 'hideTillHover'); // See tabbedtab.css

    nav.setAttribute('style', 'float:right; width:10%');
    var a = dom.createElement('a');
    a.setAttribute('href', x.uri);
    a.setAttribute('style', 'float:right');
    nav.appendChild(a).textContent = '>';
    box.appendChild(nav);
    var iconDiv = dom.createElement('div');
    iconDiv.setAttribute('style', (inverse ? 'float:left;' : 'float:right;') + ' width:30px;');
    image = dom.createElement('img');
    setStyle();
    iconDiv.appendChild(image);
    box.appendChild(iconDiv);
    item.addEventListener('click', function (event) {
      if (selected === item) {
        // deselect
        item.setAttribute('style', style0);
        selected = null;
      } else {
        if (selected) selected.setAttribute('style', style0);
        item.setAttribute('style', style0 + 'background-color: #ccc; color:black;');
        selected = item;
      }

      callbackFunction(x, event, selected === item);
      setStyle();
    }, false);
    image.addEventListener('click', function (event) {
      linkCallback(x, event, inverse, setStyle);
    }, false);
    box.appendChild(item);
    return box;
  };

  for (var i = 0; i < possible.length; i++) {
    var box = dom.createElement('div');
    list.appendChild(box);
    refreshItem(box, possible[i]);
  }

  return list;
} // ###########################################################################
//
//      Small compact views of things
//


var index = {}; // ///////////////////////////////////////////////////////////////////////////
// We need these for anything which is a subject of an attachment.
//
// These should be moved to type-dependeent UI code. Related panes maybe

exports.index = index;

function twoLineDefault(dom, x) {
  // Default
  var box = dom.createElement('div');
  box.textContent = utils.label(x);
  return box;
}
/**
 * Find a function that can create a widget for a given class
 * @param c The RDF class for which we want a widget generator function
 */


function twoLineWidgetForClass(c) {
  var widget = index.twoLine[c.uri];
  var kb = store;
  if (widget) return widget;
  var sup = kb.findSuperClassesNT(c);

  for (var cl in sup) {
    widget = index.twoLine[kb.fromNT(cl).uri];
    if (widget) return widget;
  }

  return index.twoLine[''];
}
/**
 * Display a transaction
 * @param x Should have attributes through triples in store:
 *          * ns.qu('payee') -> a named node
 *          * ns.qu('date) -> a literal
 *          * ns.qu('amount') -> a literal
 */


function twoLineTransaction(dom, x) {
  var failed = '';

  var enc = function enc(p) {
    var y = store.any(x, _ns["default"].qu(p));
    if (!y) failed += '@@ No value for ' + p + '! ';
    return y ? utils.escapeForXML(y.value) : '?'; // @@@@
  };

  var box = dom.createElement('table');
  box.innerHTML = "\n      <tr>\n      <td colspan=\"2\"> ".concat(enc('payee'), "</td>\n      < /tr>\n      < tr >\n      <td>").concat(enc('date').slice(0, 10), "</td>\n      <td style = \"text-align: right;\">").concat(enc('amount'), "</td>\n      </tr>");

  if (failed) {
    box.innerHTML = "\n      <tr>\n        <td><a href=\"".concat(utils.escapeForXML(x.uri), "\">").concat(utils.escapeForXML(failed), "</a></td>\n      </tr>");
  }

  return box;
}
/**
 * Display a trip
 * @param x Should have attributes through triples in store:
 *          * ns.dc('title') -> a literal
 *          * ns.cal('dtstart') -> a literal
 *          * ns.cal('dtend') -> a literal
 */


function twoLineTrip(dom, x) {
  var enc = function enc(p) {
    var y = store.any(x, p);
    return y ? utils.escapeForXML(y.value) : '?';
  };

  var box = dom.createElement('table');
  box.innerHTML = "\n    <tr>\n      <td colspan=\"2\">".concat(enc(_ns["default"].dc('title')), "</td>\n    </tr>\n    <tr style=\"color: #777\">\n      <td>").concat(enc(_ns["default"].cal('dtstart')), "</td>\n      <td>").concat(enc(_ns["default"].cal('dtend')), "</td>\n    </tr>");
  return box;
}
/**
 * Stick a stylesheet link the document if not already there
 */


function addStyleSheet(dom, href) {
  var links = dom.querySelectorAll('link');

  for (var i = 0; i < links.length; i++) {
    if ((links[i].getAttribute('rel') || '') === 'stylesheet' && (links[i].getAttribute('href') || '') === href) {
      return;
    }
  }

  var link = dom.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', href);
  dom.getElementsByTagName('head')[0].appendChild(link);
} // Figure (or guess) whether this is an image, etc
//


function isAudio(file) {
  return isImage(file, 'audio');
}

function isVideo(file) {
  return isImage(file, 'video');
}
/**
 *
 */


function isImage(file, kind) {
  var dcCLasses = {
    audio: 'http://purl.org/dc/dcmitype/Sound',
    image: 'http://purl.org/dc/dcmitype/Image',
    video: 'http://purl.org/dc/dcmitype/MovingImage'
  };
  var what = kind || 'image'; // See https://github.com/linkeddata/rdflib.js/blob/e367d5088c/src/formula.ts#L554
  //

  var typeURIs = store.findTypeURIs(file); // See https://github.com/linkeddata/rdflib.js/blob/d5000f/src/utils-js.js#L14
  // e.g.'http://www.w3.org/ns/iana/media-types/audio'

  var prefix = _rdflib.Util.mediaTypeClass(what + '/*').uri.split('*')[0];

  for (var t in typeURIs) {
    if (t.startsWith(prefix)) return true;
  }

  if (dcCLasses[what] in typeURIs) return true;
  return false;
}
/**
 * File upload button
 * @param dom The DOM aka document
 * @param  droppedFileHandler Same handler function as drop, takes array of file objects
 * @returns {Element} - a div with a button and a inout in it
 * The input is hidden, as it is uglky - the user clicks on the nice icons and fires the input.
 */
// See https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications


function fileUploadButtonDiv(dom, droppedFileHandler) {
  var div = dom.createElement('div');
  var input = div.appendChild(dom.createElement('input'));
  input.setAttribute('type', 'file');
  input.setAttribute('multiple', 'true');
  input.addEventListener('change', function (event) {
    debug.log('File drop event: ', event);

    if (event.files) {
      droppedFileHandler(event.files);
    } else if (event.target && event.target.files) {
      droppedFileHandler(event.target.files);
    } else {
      alert('Sorry no files .. internal error?');
    }
  }, false);
  input.style = 'display:none';
  var buttonElt = div.appendChild(button(dom, _iconBase.iconBase + 'noun_Upload_76574_000000.svg', 'Upload files', function (_event) {
    input.click();
  }));
  dragAndDrop.makeDropTarget(buttonElt, null, droppedFileHandler); // Can also just drop on button

  return div;
}

exports.index = index = {
  line: {// Approx 80em
  },
  twoLine: {
    // Approx 40em * 2.4em
    '': twoLineDefault,
    'http://www.w3.org/2000/10/swap/pim/qif#Transaction': twoLineTransaction,
    'http://www.w3.org/ns/pim/trip#Trip': twoLineTrip,
    widgetForClass: twoLineWidgetForClass
  }
};
//# sourceMappingURL=buttons.js.map