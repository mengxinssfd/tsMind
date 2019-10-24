export class DomOperator {
    static createElement(nodeName: string): any {
        return document.createElement(nodeName);
    }

    static isDom = (typeof HTMLElement === 'object') ?
        function (target) {
            return target instanceof HTMLElement;
        } :
        function (target) {
            return target && typeof target === 'object' && target.nodeType === 1 && typeof target.nodeName === 'string';
        };
}