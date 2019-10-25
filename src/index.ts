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
    private nodeWrapper: any;
    nodeWrapperLayout = {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    };
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

    layout() {
        const node = this.nodeTree;
        const {height, width} = this.getTotalHeight(node);
        const nwLayout = this.nodeWrapperLayout;
        nwLayout.width = width + this.options.margin * 2;
        nwLayout.height = height + this.options.margin * 2;

        this.nodeWrapper.style.width = nwLayout.width + "px";
        this.nodeWrapper.style.height = nwLayout.height + "px";

        const el = this.el;
        this.nodeWrapperLayout.x = ((el.offsetWidth || el.clientWidth) - nwLayout.width) / 2;
        this.nodeWrapperLayout.y = ((el.offsetHeight || el.clientHeight) - nwLayout.height) / 2;
        this.nodeWrapper.style.left = nwLayout.x + "px";
        this.nodeWrapper.style.top = nwLayout.y + "px";

        console.log("hhhhhhhhhhhhhhhh", width, height, node);
        this.setPosition(this.nodeTree);
    }

    setPosition(node) {
        const dom = node.currentDom;
        dom.style.left = node.layout.x + "px";
        dom.style.top = node.layout.y + "px";
        dom.style.visibility = "";
        if (node.children) {
            node.children.forEach(nd => {
                this.setPosition(nd);
            });
        }
    }

    getTotalHeight(node: Node): { width: number, height: number } {
        let height = node.currentDom.clientHeight;
        let width = node.currentDom.clientWidth;

        node.layout.width = width;
        node.layout.height = height;
        // node.layout.totalHeight = height;

        node.layout.x = node.isRoot ? this.options.margin : this.options.margin + node.parent.layout.x + node.parent.layout.width;
        if (node.children && node.children.length) {
            let childrenHeight = (node.children.length - 1) * this.options.margin;
            let childrenWidth = 0;
            node.children.forEach((nd, index) => {
                const {width: w, height: h} = this.getTotalHeight(nd);
                node.layout.totalHeight += h + nd.layout.y;
                childrenHeight += h;
                childrenWidth = Math.max(this.options.margin + w, childrenWidth);
            });
            // node.layout.y = (childrenHeight - node.layout.height) / 2 + this.options.margin;
            height = Math.max(height, childrenHeight);
            width += childrenWidth;
        }
        if (!node.isRoot) {
            const parent = node.parent;
            node.layout.y = parent.layout.totalHeight + this.options.margin;
            parent.layout.y = (parent.layout.totalHeight - parent.layout.height) / 2 + this.options.margin;
        }

        return {height, width};
    }

    drawDomNode() {
        const nodeTree = this.nodeTree;
        const nodeWrapper = DomOperator.createElement("nodes");
        DomOperator.addClass(nodeWrapper, "node-wrapper");
        this.nodeWrapper = nodeWrapper;
        this.el.appendChild(nodeWrapper);

        function createNodeDom(node: Node, parent?: Node) {
            const dom = DomOperator.createElement("node");
            nodeWrapper.appendChild(dom);
            dom.setAttribute("nodeid", <string>node.id);
            dom.style.visibility = "hidden";
            node.currentDom = dom;
            node.layout = {
                width: 0,
                height: 0,
                totalHeight: 0,
                x: 0,
                y: 0
            };
            if (parent !== undefined) {
                node.parent = parent;
            }
            console.log(node.content, dom.clientWidth);
            if (node.isRoot) {
                DomOperator.addClass(dom, "root");
            }
            if (node.render) {
                node.render(node, dom);
            } else {
                dom.innerText = node.content;
            }
            if (node.children && node.children.length) {
                for (let child of node.children) {
                    createNodeDom(child, node);
                }
            }
        }


        createNodeDom(nodeTree);
        this.layout();
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