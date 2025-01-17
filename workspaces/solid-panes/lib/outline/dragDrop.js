"use strict";

/* istanbul ignore file */

/**
    This is for outliner features that only work in the extension version, say drag and drop.
    I am always happy creating new files.
                                                             2007.07.11  kennyluck
    2017: Todo: Repace the old Firefox specific code with HTML5 standard code - timbl
**/
// Firefox internals:

/* global Components TransferData TransferDataSet FlavourSet nsTransferable transferUtils */
// #includedIn chrome://tabulator/tabulator.xul
// #require_once chrome://global/nsDragAndDrop.js

/* alert(gBrowser);alert(gBrowser.tagName)
if (!tabulator_gBrowser) {
    var tabulator_wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
               .getService(Components.interfaces.nsIWindowMediator)
    var tabulator_gBrowser = tabulator_wm.getMostRecentWindow("navigator:browser")
}
*/

/* 2007: adapted from dragAndDrop UI Library */
var UI = require('solid-ui');

var $rdf = require('rdflib');

var dragAndDrop = module.exports = {};
dragAndDrop.util = {};

dragAndDrop.util.Event = function () {
  var listeners = [];
  return {
    on: function on(el, sType, fn, obj, fnId
    /* ,override */
    ) {
      var wrappedFn = function wrappedFn(e) {
        return fn.call(obj, e, obj);
      };

      el.addEventListener(sType, wrappedFn, false);
      var li = [el, sType, fnId, wrappedFn];
      listeners.push(li);
    },
    off: function off(el, sType, fnId) {
      // removeListener, fnId to identify a function
      var index = this._getCacheIndex(el, sType, fnId);

      if (index === -1) return false;
      var cacheItem = listeners[index];
      el.removeEventListener(sType, cacheItem[this.WFN], false);
      delete listeners[index][this.WFN];
      delete listeners[index][this.FN];
      listeners.splice(index, 1);
      return true;
    },
    EL: 0,
    TYPE: 1,
    FNID: 2,
    WFN: 3,
    _getCacheIndex: function _getCacheIndex(el, sType, fnId) {
      for (var i = 0, len = listeners.length; i < len; ++i) {
        var li = listeners[i];

        if (li && li[this.FNID] === fnId && li[this.EL] === el && li[this.TYPE] === sType) {
          return i;
        }
      }

      return -1;
    }
  };
}();

dragAndDrop.util.DDExternalProxy = function DDExternalProxy(el) {
  this.initTarget(el); // dragAndDrop.util.Event.on(this.el, "mousedown", this.handleMouseDown, this, 'dragMouseDown'/*, true*/)
}; // dragAndDrop.util.DDExternalProxy extends dragAndDrop.utilDDProxy


dragAndDrop.util.DDExternalProxy.prototype = {
  initTarget: function initTarget(el) {
    // create a local reference to the drag and drop manager
    this.DDM = dragAndDrop.util.DDM; // set the el

    this.el = el;
    /*
    // We don't want to register this as the handle with the manager
    // so we just set the id rather than calling the setter.
    this.handleElId = id
     Event.onAvailable(id, this.handleOnAvailable, this, true)
    */
    // the linked element is the element that gets dragged by default
    // this.setDragElId(id)
    // by default, clicked anchors will not start drag operations.
    // @TODO what else should be here?  Probably form fields.
    // this.invalidHandleTypes = { A: "A" }
    // this.invalidHandleIds = {}
    // this.invalidHandleClasses = []
    // this.applyConfig()
  },
  b4StartDrag: function b4StartDrag(x, y) {
    // show the drag frame
    // this.logger.log("start drag show frame, x: " + x + ", y: " + y)
    // alert("test startDrag")
    TabulatorOutlinerObserver.onDragStart(x, y, this.el); // this.showFrame(x, y)
  },
  b4Drag: function b4Drag(_e) {// this.setDragElPos(dragAndDrop.util.Event.getPageX(e),
    //                    dragAndDrop.util.Event.getPageY(e))
  },
  handleMouseDown: function handleMouseDown(e, _oDD) {
    var button = e.which || e.button;
    if (button > 1) return; // firing the mousedown events prior to calculating positions
    // this.b4MouseDown(e)
    // this.onMouseDown(e)
    // this.DDM.refreshCache(this.groups)
    // var self = this
    // setTimeout( function() { self.DDM.refreshCache(self.groups); }, 0)
    // Only process the event if we really clicked within the linked
    // element.  The reason we make this check is that in the case that
    // another element was moved between the clicked element and the
    // cursor in the time between the mousedown and mouseup events. When
    // this happens, the element gets the next mousedown event
    // regardless of where on the screen it happened.
    // var pt = new dragAndDrop.util.Point(Event.getPageX(e), Event.getPageY(e))
    // if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this) )  {
    //        this.logger.log("Click was not over the element: " + this.id)
    // } else {
    //    if (this.clickValidator(e)) {
    // set the initial element position
    // this.setStartPosition()
    // start tracking mousemove distance and mousedown time to
    // determine when to start the actual drag

    this.DDM.handleMouseDown(e, this); // this mousedown is mine
    // this.DDM.stopEvent(e)
    //    } else {
    // this.logger.log("clickValidator returned false, drag not initiated")
    //    }
    // }
  }
};

dragAndDrop.util.DDM = function DDM() {
  return {
    handleMouseDown: function handleMouseDown(e, oDD) {
      // this.currentTarget = dragAndDrop.util.Event.getTarget(e)
      this.dragCurrent = oDD;
      var el = oDD.el; // track start position

      this.startX = e.pageX;
      this.startY = e.pageY;
      this.deltaX = this.startX - el.offsetLeft;
      this.deltaY = this.startY - el.offsetTop;
      this.dragThreshMet = false; // this.clickTimeout = setTimeout(
      //        function() {
      //            var DDM = dragAndDrop.util.DDM
      //            DDM.startDrag(DDM.startX, DDM.startY)
      //        },
      //        this.clickTimeThresh )
      // dragAndDrop.util.Event.on(el,'mousemove',this.handleMouseMove,this,'dragMouseMove')
      // dragAndDrop.util.Event.on(el,'mouseup'  ,this.handleMouseUp  ,this,'dragMouseUp')
    },
    handleMouseMove: function handleMouseMove(e) {
      // dragAndDrop.log("handlemousemove")
      if (!this.dragCurrent) {
        // dragAndDrop.log("no current drag obj")
        return true;
      } // var button = e.which || e.button
      // dragAndDrop.log("which: " + e.which + ", button: "+ e.button)
      // check for IE mouseup outside of page boundary


      if (dragAndDrop.util.Event.isIE && !e.button) {
        dragAndDrop.log('button failure', 'info', 'DragDropMgr');
        this.stopEvent(e);
        return this.handleMouseUp(e);
      }

      if (!this.dragThreshMet) {
        var diffX = Math.abs(this.startX - e.pageX);
        var diffY = Math.abs(this.startY - e.pageY); // dragAndDrop.log("diffX: " + diffX + "diffY: " + diffY)

        if (diffX > this.clickPixelThresh || diffY > this.clickPixelThresh) {
          // dragAndDrop.log("pixel threshold met", "info", "DragDropMgr")
          this.startDrag(this.startX, this.startY);
        }
      }

      if (this.dragThreshMet) {// this.dragCurrent.b4Drag(e)
        // this.dragCurrent.onDrag(e)
        // this.fireEvents(e, false)
      }

      e.preventDefault(); // this.stopEvent(e)

      return true;
    },
    handleMouseUp: function handleMouseUp(e) {
      if (!this.dragCurrent) return; // Error...

      dragAndDrop.util.Event.off(this.dragCurrent.el, 'mousemove', 'dragMouseMove'); // there are two mouseup for unknown reason...

      dragAndDrop.util.Event.off(this.dragCurrent.el, 'mouseup', 'dragMouseUp');
      dragAndDrop.util.Event.off(this.dragCurrent.el, 'mouseup', 'dragMouseUp'); // have to do this as attribute ondragdrop does not recognize any dragdrop event
      // initialized inside <tabbrowser> (strange, I think)

      if (this.dragThreshMet) {
        TabulatorOutlinerObserver.onDropInside(e.target);
        this.dragThreshMet = false;
      }

      this.dragCurrent = null;
    },
    startDrag: function startDrag(x, y) {
      // dragAndDrop.log("firing drag start events", "info", "DragDropMgr")
      // clearTimeout(this.clickTimeout)
      if (this.dragCurrent) {
        this.dragCurrent.b4StartDrag(x, y); // this.dragCurrent.startDrag(x, y)
      }

      this.dragThreshMet = true;
    },
    clickPixelThresh: 3
  };
}(); // ToDos
// 1.Recover normal funtionality
// 2.Investigate into Gecko drag and drop
// 3.Cross Tag Drag And Drop
// 4.Firefox native rdf store


var TabulatorOutlinerObserver = {
  onDrop: function onDrop(e, aXferData, _dragSession) {
    var selection = UI.utils.ancestor(UI.utils.ancestor(e.originalTarget, 'TABLE').parentNode, 'TABLE').outline.selection;
    var contentType = aXferData.flavour.contentType;
    var url = transferUtils.retrieveURLFromData(aXferData.data, contentType);
    if (!url) return;

    if (contentType === 'application/x-moz-file') {
      if (aXferData.data.fileSize === 0) {
        var templateDoc = $rdf.sym('chrome://tabulator/content/internalKnowledge.n3#defaultNew');
        UI.store.copyTo(templateDoc, $rdf.sym(url));
        /*
        function WriteToFileRepresentedBy (subject){
          var outputFormulaTerm=kb.any(subject,OWL('unionOf'))
          var theClass =  kb.constructor.SuperClass
          var outputFormula= theClass.instances[kb.the(outputFormulaTerm,tabont('accesskey')).value]
        }
        */
      }
    }

    var targetTd = selection[0];
    var table = UI.utils.ancestor(UI.utils.ancestor(targetTd, 'TABLE').parentNode, 'TABLE');
    var thisOutline = table.outline;
    thisOutline.UserInput.insertTermTo(targetTd, $rdf.sym(url));
  },
  onDragEnter: function onDragEnter(e, _dragSession) {
    // enter or exit something
    try {
      var selection = UI.utils.ancestor(UI.utils.ancestor(e.originalTarget, 'TABLE').parentNode, 'TABLE').outline.selection;
    } catch (e) {
      /* because e.orginalTarget is not defined */
      return;
    }

    for (var targetTd = e.originalTarget; targetTd; targetTd = targetTd.parentNode) {
      if (targetTd.tabulatorSelect) {
        if (selection[0]) {
          try {
            selection[0].tabulatorDeselect();
          } catch (e) {
            throw new Error(selection[0] + ' causes ' + e);
          }

          dragAndDrop.util.Event.off(targetTd, 'mouseup', 'dragMouseUp');
        }

        targetTd.tabulatorSelect(); // dragAndDrop.util.Event.on(targetTd,'mouseup',this.DDM.handleMouseUp,this.DDM,'dragMouseUp')

        break;
      }
    }
  },
  onDragExit: function onDragExit(_e, _dragSession) {// if (e.originalTarget.tabulatorDeselect) e.originalTarget.tabulatorDeselect()
  },
  onDropInside: function onDropInside(targetTd) {
    // a special case that you draganddrop totally inside a <tabbrowser>
    // var selection = ancestor(ancestor(targetTd,'TABLE').parentNode,'TABLE').outline.selection
    // var targetTd=selection[0]
    var table = targetTd.ownerDocument.getElementById('outline'); // var table=ancestor(ancestor(targetTd,'TABLE').parentNode,'TABLE')

    var thisOutline = table.outline;
    thisOutline.UserInput.insertTermTo(targetTd, UI.utils.getAbout(UI.store, this.dragTarget));
  },
  onDragStart: function onDragStart(x, y, td) {
    /* seeAlso nsDragAndDrop.js::nsDragAndDrop.startDrag */
    // ToDo for myself: understand the connections in firefox, x, screenX
    this.dragTarget = td;
    var kDSIID = Components.interfaces.nsIDragService;
    var dragAction = {
      action: kDSIID.DRAGDROP_ACTION_COPY + kDSIID.DRAGDROP_ACTION_MOVE + kDSIID.DRAGDROP_ACTION_LINK
    }; // alert(td.ownerDocument.getBoxObjectFor(td))
    // alert(td.ownerDocument.getBoxObjectFor(td).screenX)

    var tdBox = td.ownerDocument.getBoxObjectFor(td); // nsIBoxObject

    var region = Components.classes['@mozilla.org/gfx/region;1'].createInstance(Components.interfaces.nsIScriptableRegion);
    region.init(); // this is important

    region.unionRect(tdBox.screenX, tdBox.screenY, tdBox.width, tdBox.height);
    var transferDataSet = {
      data: null
    };
    var term = UI.Util.getTerm(td);

    switch (term.termType) {
      case 'NamedNode':
        transferDataSet.data = this.URItoTransferDataSet(term.uri);
        break;

      case 'BlankNode':
        transferDataSet.data = this.URItoTransferDataSet(term.toNT());
        break;

      case 'Literal':
        transferDataSet.data = this.URItoTransferDataSet(term.value);
        break;
    }

    transferDataSet = transferDataSet.data; // quite confusing, anyway...

    var transArray = Components.classes['@mozilla.org/supports-array;1'].createInstance(Components.interfaces.nsISupportsArray);
    var trans = nsTransferable.set(transferDataSet.dataList[0]);
    transArray.AppendElement(trans.QueryInterface(Components.interfaces.nsISupports));
    this.mDragService.invokeDragSession(td, transArray, region, dragAction.action);
  },

  /*
  onDragStart: function(aEvent,aXferData,aDragAction){
      var dragTarget=ancestor(aEvent.target,'TD')
      //var nt=dragTarget.getAttribute('about')
      //ToDo:text terms
      var term=getAbout(kb,dragTarget)
      aXferData.data = this.URItoTransferDataSet(term.uri)
      alert("start")
  },
  */
  getSupportedFlavours: function getSupportedFlavours() {
    var flavourSet = new FlavourSet(); // flavourSet.appendFlavour("text/rdfitem")
    // flavourSet.appendFlavour("moz/rdfitem")

    flavourSet.appendFlavour('text/x-moz-url');
    flavourSet.appendFlavour('text/unicode');
    flavourSet.appendFlavour('application/x-moz-file', 'nsIFile');
    return flavourSet;
  },
  URItoTransferDataSet: function URItoTransferDataSet(uri) {
    var dataSet = new TransferDataSet();
    var data = new TransferData();
    data.addDataForFlavour('text/x-moz-url', uri);
    data.addDataForFlavour('text/unicode', uri);
    dataSet.push(data);
    return dataSet;
  },
  _mDS: null,
  get_mDragService: function get_mDragService() {
    // some syntax I don't understand -- was get mDragService()
    if (!this._mDS) {
      var kDSContractID = '@mozilla.org/widget/dragservice;1';
      var kDSIID = Components.interfaces.nsIDragService;
      this._mDS = Components.classes[kDSContractID].getService(kDSIID);
    }

    return this._mDS;
  },
  DDM: dragAndDrop.util.DDM
};
/*
var ondraging=false; //global variable indicating whether ondraging (better choice?)
var testGlobal = function test(e){alert(e.originalTarget);e.originalTarget.className='selected';e.preventDefault();}
var activateDrag = function (e){
   if (!ondraging){
       alert('activate test')
       ondraging=true
   }
}
*/
// tabulator_gBrowser.setAttribute('ondragdrop','testGlobal(event)')
// tabulator_gBrowser.setAttribute('ondragenter','activateDrag(event)')
// gBrowser.addEventListener('dragdrop',test,true)
//# sourceMappingURL=dragDrop.js.map