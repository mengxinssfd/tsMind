/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:21
 * @Description:
 */
import {Operation, LifeCircle, Node, Options} from "./Interface";
import {DomOperator} from "./domOperator";

class TsMind implements Operation, LifeCircle {
    private nodeTree: Node;
    private el: any;
    private readonly options: Options;
    private canvas: any;
    private context: any;

    constructor(options: Options) {
        this.options = options;
        this.init();
    }

    init() {
        let el = this.options.el;
        el = DomOperator.isDom(el) ? el : document.querySelector(el);
        this.el = el;

        el.style.position = "relative";

        const height = el.clientHeight || el.offsetHeight;
        const width = el.clientWidth || el.offsetWidth;

        const canvas = this.canvas = DomOperator.createElement("canvas");
        el.appendChild(canvas);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        const context = this.context = this.canvas.getContext("2d");
    }

    drawDomNode() {
        const nodeTree = this.nodeTree;

        function createNodeDom(node) {
            const dom = DomOperator.createElement("node");
            dom.setAttribute("nodeid", node.id);
            node.currentDom = dom;
            if (node.render) {
                node.render(node, dom);
            } else {
                dom.innerText = node.content;
            }
            if (node.children && node.children.length) {

                for (let child of node.children) {
                    dom.appendChild(createNodeDom(child));
                }
            }
            return dom;
        }

        const domTree = createNodeDom(nodeTree);
        this.el.appendChild(domTree);
        console.log(domTree);
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


    setData(node: Node): void {
        this.nodeTree = node;
        this.drawDomNode();
    }

    destroy(): void {
    }


}

export {TsMind};