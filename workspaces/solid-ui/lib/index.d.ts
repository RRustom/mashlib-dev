/**
 * Provides a Solid client helper object (which exposes various static modules).
 * @module solidUi.js
 * @main solidUi.js
 */
/**
 * @class SolidUi
 * @static
 */
import * as rdf from 'rdflib';
import ns from './ns';
import { acl, aclControl } from './acl/index';
import { authn } from './authn/index';
import { create } from './create/index';
import icons from './iconBase';
import * as log from './log';
import { matrix } from './matrix/index';
import { media } from './media/index';
import messageArea from './messageArea';
import { infiniteMessageArea } from './chat/infinite';
import * as pad from './pad';
import * as participation from './participation';
import preferences from './preferences';
import { solidLogicSingleton } from './logic';
import style from './style';
import table from './table';
import * as tabs from './tabs';
import utils from './utils';
import widgets from './widgets';
import versionInfo from './versionInfo';
import { initHeader } from './header';
declare const dom: Document | null;
declare const store: import("solid-logic").LiveStore;
export { ns, rdf, acl, aclControl, authn, create, dom, icons, log, matrix, media, messageArea, infiniteMessageArea, pad, participation, preferences, solidLogicSingleton, store, style, table, tabs, utils, widgets, versionInfo, initHeader };
//# sourceMappingURL=index.d.ts.map