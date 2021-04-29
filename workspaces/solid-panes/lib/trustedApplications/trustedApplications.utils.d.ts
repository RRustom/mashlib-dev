import { IndexedFormula, NamedNode, Literal, Statement } from 'rdflib';
import { Namespaces } from 'solid-namespace';
export declare function getStatementsToDelete(origin: NamedNode | Literal, person: NamedNode, kb: IndexedFormula, ns: Namespaces): Statement<import("rdflib/lib/types").SubjectType, import("rdflib/lib/types").PredicateType, import("rdflib/lib/types").ObjectType, import("rdflib/lib/types").GraphType>[];
export declare function getStatementsToAdd(origin: NamedNode, nodeName: string, modes: string[], person: NamedNode, ns: Namespaces): Statement<import("rdflib/lib/types").SubjectType, import("rdflib/lib/types").PredicateType, import("rdflib/lib/types").ObjectType, import("rdflib/lib/types").GraphType>[];
export declare function generateRandomString(): string;
//# sourceMappingURL=trustedApplications.utils.d.ts.map