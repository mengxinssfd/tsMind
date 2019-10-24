/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:22
 * @Description:
 */

export interface Node {
    id: string | number,
    content: string,
    render?: (node: Node) => void,
    children?: Node[]
}

export interface Options {
    el: string | any,
    mode: "canvas" | "html",
    editable: boolean,
    line: {
        width: number,
        color: string
    }
}

export interface Operation {
    setData(data: Node): void

    draw(): void

    addNode(parentId: string | number, data: object): void

    removeNode(id: number): void

    getNode(id: number): void

    updateNode(id: number, data: object): void

    destroy(): void
}

export class DomOperate {
    createElement(nodeName: string): any {
        return document.createElement(nodeName);
    }

    isDom = (typeof HTMLElement === 'object') ?
        function (target) {
            return target instanceof HTMLElement;
        } :
        function (target) {
            return target && typeof target === 'object' && target.nodeType === 1 && typeof target.nodeName === 'string';
        };
}

export interface LifeCircle {

}