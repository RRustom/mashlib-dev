"use strict";

/*   Social Pane
 **
 **  This outline pane provides social network functions
 **  Using for example the FOAF ontology.
 **  Goal:  A *distributed* version of facebook, advogato, etc etc
 **  - Similarly easy user interface, but data storage distributed
 **  - Read and write both user-private (address book) and public data clearly
 **  -- todo: use common code to get username and load profile and set 'me'
 */
var UI = require('solid-ui');

var $rdf = require('rdflib');

module.exports = {
  icon: UI.icons.originalIconBase + 'foaf/foafTiny.gif',
  name: 'social',
  label: function label(subject, context) {
    var kb = context.session.store;
    var types = kb.findTypeURIs(subject);

    if (types[UI.ns.foaf('Person').uri] || types[UI.ns.vcard('Individual').uri]) {
      return 'Friends';
    }

    return null;
  },
  render: function render(s, context) {
    var dom = context.dom;

    var common = function common(x, y) {
      // Find common members of two lists
      var both = [];

      for (var i = 0; i < x.length; i++) {
        for (var j = 0; j < y.length; j++) {
          if (y[j].sameTerm(x[i])) {
            both.push(y[j]);
            break;
          }
        }
      }

      return both;
    };

    var people = function people(n) {
      var res = ' ';
      res += n || 'no';
      if (n === 1) return res + ' person';
      return res + ' people';
    };

    var say = function say(str) {
      console.log(str);
      var p = dom.createElement('p');
      p.textContent = str;
      tips.appendChild(p);
    };

    var link = function link(contents, uri) {
      if (!uri) return contents;
      var a = dom.createElement('a');
      a.setAttribute('href', uri);
      a.appendChild(contents);
      return a;
    };

    var text = function text(str) {
      return dom.createTextNode(str);
    };

    var buildCheckboxForm = function buildCheckboxForm(lab, statement, state) {
      var f = dom.createElement('form');
      var input = dom.createElement('input');
      f.appendChild(input);
      var tx = dom.createTextNode(lab);
      tx.className = 'question';
      f.appendChild(tx);
      input.setAttribute('type', 'checkbox');

      var boxHandler = function boxHandler(_e) {
        tx.className = 'pendingedit'; // alert('Should be greyed out')

        if (this.checked) {
          // Add link
          try {
            outliner.UserInput.sparqler.insert_statement(statement, function (uri, success, errorBody) {
              tx.className = 'question';

              if (!success) {
                UI.log.alert(null, 'Message', 'Error occurs while inserting ' + statement + '\n\n' + errorBody);
                input.checked = false; // rollback UI

                return;
              }

              kb.add(statement.subject, statement.predicate, statement.object, statement.why);
            });
          } catch (e) {
            UI.log.error('Data write fails:' + e);
            UI.log.alert('Data write fails:' + e);
            input.checked = false; // rollback UI

            tx.className = 'question';
          }
        } else {
          // Remove link
          try {
            outliner.UserInput.sparqler.delete_statement(statement, function (uri, success, errorBody) {
              tx.className = 'question';

              if (!success) {
                UI.log.alert('Error occurs while deleting ' + statement + '\n\n' + errorBody);
                this.checked = true; // Rollback UI
              } else {
                kb.removeMany(statement.subject, statement.predicate, statement.object, statement.why);
              }
            });
          } catch (e) {
            UI.log.alert('Delete fails:' + e);
            this.checked = true; // Rollback UI
            // return
          }
        }
      };

      input.checked = state;
      input.addEventListener('click', boxHandler, false);
      return f;
    };

    var oneFriend = function oneFriend(friend, _confirmed) {
      return UI.widgets.personTR(dom, UI.ns.foaf('knows'), friend, {});
    }; // ////////// Body of render():


    var outliner = context.getOutliner(dom);
    var kb = context.session.store;
    var div = dom.createElement('div');
    div.setAttribute('class', 'socialPane');
    var foaf = UI.ns.foaf;
    var vcard = UI.ns.vcard; // extracted from tabbedtab.css 2017-03-21

    var navBlockStyle = 'background-color: #eee; width: 25%; border: 0; padding: 0.5em; margin: 0;';
    var mainBlockStyle = 'background-color: #fff; color: #000; width: 46%; margin: 0; border-left: 1px solid #ccc; border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 0;';
    var foafPicStyle = ' width: 100% ; border: none; margin: 0; padding: 0;';
    var structure = div.appendChild(dom.createElement('table'));
    var tr = structure.appendChild(dom.createElement('tr'));
    var left = tr.appendChild(dom.createElement('td'));
    var middle = tr.appendChild(dom.createElement('td'));
    var right = tr.appendChild(dom.createElement('td'));
    var tools = left;
    tools.style.cssText = navBlockStyle;
    var mainTable = middle.appendChild(dom.createElement('table'));
    mainTable.style.cssText = mainBlockStyle;
    var tips = right;
    tips.style.cssText = navBlockStyle; // Image top left

    var src = kb.any(s, foaf('img')) || kb.any(s, foaf('depiction'));

    if (src) {
      var img = dom.createElement('IMG');
      img.setAttribute('src', src.uri); // w640 h480
      // img.className = 'foafPic'

      img.style.cssText = foafPicStyle;
      tools.appendChild(img);
    }

    var name = kb.anyValue(s, foaf('name')) || '???';
    var h3 = dom.createElement('H3');
    h3.appendChild(dom.createTextNode(name));
    var me = UI.authn.currentUser();
    var meUri = me ? me.uri : null; // @@ Add: event handler to redraw the stuff below when me changes.

    var loginOutButton = UI.authn.loginStatusBox(dom, function (webIdUri) {
      me = kb.sym(webIdUri); // @@ To be written:   redraw as a function the new me
      // @@ refresh the sidebars

      UI.widgets.refreshTree(div); // this refreshes the middle at least
    });
    tips.appendChild(loginOutButton);
    var thisIsYou = me && kb.sameThings(me, s);
    var knows = foaf('knows'); //        var givenName = kb.sym('http://www.w3.org/2000/10/swap/pim/contact#givenName')

    var familiar = kb.anyValue(s, foaf('givenname')) || kb.anyValue(s, foaf('firstName')) || kb.anyValue(s, foaf('nick')) || kb.anyValue(s, foaf('name')) || kb.anyValue(s, vcard('fn'));
    var friends = kb.each(s, knows); // Do I have a public profile document?

    var profile = null; // This could be  SPARQL { ?me foaf:primaryTopic [ a foaf:PersonalProfileDocument ] }

    var editable = false;

    if (me) {
      // The definition of FAF personal profile document is ..
      var works = kb.each(undefined, foaf('primaryTopic'), me); // having me as primary topic

      var message = '';

      for (var i = 0; i < works.length; i++) {
        if (kb.whether(works[i], UI.ns.rdf('type'), foaf('PersonalProfileDocument'))) {
          editable = outliner.UserInput.sparqler.editable(works[i].uri, kb);

          if (!editable) {
            message += 'Your profile <' + UI.utils.escapeForXML(works[i].uri) + '> is not remotely editable.';
          } else {
            profile = works[i];
            break;
          }
        }
      }

      if (!profile) {
        say(message + "\nI couldn't find your editable personal profile document.");
      } else {
        say('Editing your profile ' + profile + '.'); // Do I have an EDITABLE profile?

        editable = outliner.UserInput.sparqler.editable(profile.uri, kb);
      }

      if (thisIsYou) {// This is about me
        // pass... @@
      } else {
        // This is about someone else
        // My relationship with this person
        h3 = dom.createElement('h3');
        h3.appendChild(dom.createTextNode('You and ' + familiar));
        tools.appendChild(h3);
        var cme = kb.canon(me);
        var incoming = kb.whether(s, knows, cme);
        var outgoing = false;
        var outgoingSt = kb.statementsMatching(cme, knows, s);

        if (outgoingSt.length) {
          outgoing = true;
          if (!profile) profile = outgoingSt[0].why;
        }

        var _tr = dom.createElement('tr');

        tools.appendChild(_tr);

        var youAndThem = function youAndThem() {
          _tr.appendChild(link(text('You'), meUri));

          _tr.appendChild(text(' and '));

          _tr.appendChild(link(text(familiar), s.uri));
        };

        if (!incoming) {
          if (!outgoing) {
            youAndThem();

            _tr.appendChild(text(' have not said you know each other.'));
          } else {
            _tr.appendChild(link(text('You'), meUri));

            _tr.appendChild(text(' know '));

            _tr.appendChild(link(text(familiar), s.uri));

            _tr.appendChild(text(' (unconfirmed)'));
          }
        } else {
          if (!outgoing) {
            _tr.appendChild(link(text(familiar), s.uri));

            _tr.appendChild(text(' knows '));

            _tr.appendChild(link(text('you'), meUri));

            _tr.appendChild(text(' (unconfirmed).')); // @@


            _tr.appendChild(text(' confirm you know '));

            _tr.appendChild(link(text(familiar), s.uri));

            _tr.appendChild(text('.'));
          } else {
            youAndThem();

            _tr.appendChild(text(' say you know each other.'));
          }
        }

        if (editable) {
          var f = buildCheckboxForm('You know ' + familiar, new UI.rdf.Statement(me, knows, s, profile), outgoing);
          tools.appendChild(f);
        } // editable
        // //////////////// Mutual friends


        if (friends) {
          var myFriends = kb.each(me, foaf('knows'));

          if (myFriends.length) {
            var mutualFriends = common(friends, myFriends);

            var _tr3 = dom.createElement('tr');

            tools.appendChild(_tr3);

            _tr3.appendChild(dom.createTextNode('You' + (familiar ? ' and ' + familiar : '') + ' know' + people(mutualFriends.length) + ' found in common'));

            if (mutualFriends) {
              for (var _i = 0; _i < mutualFriends.length; _i++) {
                _tr3.appendChild(dom.createTextNode(',  ' + UI.utils.label(mutualFriends[_i])));
              }
            }
          }

          var _tr2 = dom.createElement('tr');

          tools.appendChild(_tr2);
        } // friends

      } // About someone else

    } // me is defined
    // End of you and s
    // div.appendChild(dom.createTextNode(plural(friends.length, 'acquaintance') +'. '))
    // /////////////////////////////////////////////  Main block
    //
    // Should: Find the intersection and difference sets
    // List all x such that s knows x.


    UI.widgets.attachmentList(dom, s, mainTable, {
      doc: profile,
      modify: !!editable,
      predicate: foaf('knows'),
      noun: 'friend'
    }); // Figure out which are reciprocated:
    // @@ Does not look up profiles
    // Does distinguish reciprocated from unreciprocated friendships
    //

    function triageFriends(s) {
      outgoing = kb.each(s, foaf('knows'));
      incoming = kb.each(undefined, foaf('knows'), s); // @@ have to load the friends

      var confirmed = [];
      var unconfirmed = [];
      var requests = [];

      for (var _i2 = 0; _i2 < outgoing.length; _i2++) {
        var friend = outgoing[_i2];
        var found = false;

        for (var j = 0; j < incoming.length; j++) {
          if (incoming[j].sameTerm(friend)) {
            found = true;
            break;
          }
        }

        if (found) confirmed.push(friend);else unconfirmed.push(friend);
      } // outgoing


      for (var _i3 = 0; _i3 < incoming.length; _i3++) {
        var _friend = incoming[_i3]; // var lab = UI.utils.label(friend)

        var _found = false;

        for (var _j = 0; _j < outgoing.length; _j++) {
          if (outgoing[_j].sameTerm(_friend)) {
            _found = true;
            break;
          }
        }

        if (!_found) requests.push(_friend);
      } // incoming


      var cases = [['Acquaintances', outgoing], ['Mentioned as acquaintances by: ', requests]];

      for (var _i4 = 0; _i4 < cases.length; _i4++) {
        var thisCase = cases[_i4];
        var _friends = thisCase[1];
        if (_friends.length === 0) continue; // Skip empty sections (sure?)

        var _h = dom.createElement('h3');

        _h.textContent = thisCase[0];
        var htr = dom.createElement('tr');
        htr.appendChild(_h);
        mainTable.appendChild(htr);
        var items = [];

        for (var j9 = 0; j9 < _friends.length; j9++) {
          items.push([UI.utils.label(_friends[j9]), _friends[j9]]);
        }

        items.sort();
        var last = null;
        var fr;

        for (var j7 = 0; j7 < items.length; j7++) {
          fr = items[j7][1];
          if (fr.sameTerm(last)) continue; // unique

          last = fr;

          if (UI.utils.label(fr) !== '...') {
            // This check is to avoid bnodes with no labels attached
            // appearing in the friends list with "..." - Oshani
            mainTable.appendChild(oneFriend(fr));
          }
        }
      }
    }

    if ($rdf.keepThisCodeForLaterButDisableFerossConstantConditionPolice) {
      triageFriends(s);
    } // //////////////////////////////////// Basic info on left


    h3 = dom.createElement('h3');
    h3.appendChild(dom.createTextNode('Basic Information'));
    tools.appendChild(h3); // For each home page like thing make a label which will
    // make sense and add the domain (like "w3.org blog") if there are more than one of the same type
    //

    var preds = [UI.ns.foaf('homepage'), UI.ns.foaf('weblog'), UI.ns.foaf('workplaceHomepage'), UI.ns.foaf('schoolHomepage')];

    for (var i6 = 0; i6 < preds.length; i6++) {
      var pred = preds[i6];
      var sts = kb.statementsMatching(s, pred);

      if (sts.length === 0) {// if (editable) say("No home page set. Use the blue + icon at the bottom of the main view to add information.")
      } else {
        var uris = [];

        for (var j5 = 0; j5 < sts.length; j5++) {
          var st = sts[j5];
          if (st.object.uri) uris.push(st.object.uri); // Ignore if not symbol
        }

        uris.sort();
        var last2 = '';
        var lab2;

        for (var k = 0; k < uris.length; k++) {
          var uri = uris[k];
          if (uri === last2) continue; // uniques only

          last2 = uri;
          var hostlabel = '';
          lab2 = UI.utils.label(pred);

          if (uris.length > 1) {
            var l = uri.indexOf('//');

            if (l > 0) {
              var r = uri.indexOf('/', l + 2);
              var r2 = uri.lastIndexOf('.', r);
              if (r2 > 0) r = r2;
              hostlabel = uri.slice(l + 2, r);
            }
          }

          if (hostlabel) lab2 = hostlabel + ' ' + lab2; // disambiguate

          var t = dom.createTextNode(lab2);
          var a = dom.createElement('a');
          a.appendChild(t);
          a.setAttribute('href', uri);
          var d = dom.createElement('div'); // d.className = 'social_linkButton'

          d.style.cssText = 'width: 80%; background-color: #fff; border: solid 0.05em #ccc;  margin-top: 0.1em; margin-bottom: 0.1em; padding: 0.1em; text-align: center;';
          d.appendChild(a);
          tools.appendChild(d);
        }
      }
    }

    var preds2 = [UI.ns.foaf('openid'), UI.ns.foaf('nick')];

    for (var i2 = 0; i2 < preds2.length; i2++) {
      var _pred2 = preds2[i2];
      var sts2 = kb.statementsMatching(s, _pred2);

      if (sts2.length === 0) {// if (editable) say("No home page set. Use the blue + icon at the bottom of the main view to add information.")
      } else {
        outliner.appendPropertyTRs(tools, sts2, false, function (_pred) {
          return true;
        });
      }
    }

    return div;
  } // render()

}; //
// ends
//# sourceMappingURL=socialPane.js.map