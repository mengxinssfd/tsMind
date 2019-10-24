/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:21
 * @Description:
 */
import {Operation, DomOperate, LifeCircle, Node, Options} from "./Interface";

class TsMind implements Operation, DomOperate, LifeCircle {
    private nodes: Node;
    private el: any;
    private readonly options: Options;
    private canvas: any;
    private context: any;

    createElement: (nodeName: string) => any;

    isDom: (target: any) => boolean;

    constructor(options: Options) {
        this.options = options;
        this.init();
    }

    addNode(parentId, data: object): void {
    }

    getNode(id): void {
    }

    removeNode(id): void {
    }

    updateNode(id, data: object): void {
    }

    draw(): void {
    }

    init(): void {
        let el = this.options.el;
        el = this.isDom(el) ? el : document.querySelector(el);
        this.el = el;

        this.canvas = this.createElement("canvas");
        this.context = this.canvas.getContext("2d");
    }

    setData(node: Node): void {
        this.nodes = node;
    }

    destroy(): void {
    }


}

// 混入到TsMind
applyMixins(TsMind, [DomOperate]);

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

export {TsMind};