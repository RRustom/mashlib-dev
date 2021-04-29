import { NamedNode } from 'rdflib';
export declare function createApplicationTable(subject: NamedNode): HTMLTableElement;
export declare function createContainer<K extends keyof HTMLElementTagNameMap>(elementName: K, children: HTMLElement[], attributes?: {}, eventListeners?: {}, onCreated?: null): HTMLElementTagNameMap[K];
export declare function createText<K extends keyof HTMLElementTagNameMap>(elementName: K, textContent: string | null, attributes?: {}, eventListeners?: {}, onCreated?: null): HTMLElementTagNameMap[K];
//# sourceMappingURL=trustedApplications.dom.d.ts.map