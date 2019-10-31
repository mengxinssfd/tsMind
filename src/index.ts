/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:21
 * @Description:
 * @Tips: 谷歌canvas高度不能超过65535px 超过黑屏
 * @Tips: edge超过16358px不画线 火狐17290px
 */
import {Coord, CustomNode, Direct, LifeCircle, Node, Operation, Options} from "./Interface";
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
    private nodes: {
        [key: string]: Node,
    } = {};

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
        // canvas.style.width = width + "px";
        // canvas.style.height = height + "px";

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
        this.nodeWrapperLayout.x = Math.max(((el.offsetWidth || el.clientWidth) - nwLayout.width) / 2, 0);
        this.nodeWrapperLayout.y = Math.max(((el.offsetHeight || el.clientHeight) - nwLayout.height) / 2, 0);
        this.nodeWrapper.style.left = nwLayout.x + "px";
        this.nodeWrapper.style.top = nwLayout.y + "px";

        this.canvas.style.position = "absolute";
        this.canvas.style.left = nwLayout.x + "px";
        this.canvas.style.top = nwLayout.y + "px";
        this.canvas.width = nwLayout.width;
        this.canvas.height = nwLayout.height;
        // this.canvas.height = 65535;
        this.canvas.style.width = nwLayout.width + "px";
        this.canvas.style.height = nwLayout.height + "px";

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
        const parent = node.parent;
        const margin = this.options.margin;
        let height = node.currentDom.clientHeight;
        let width = node.currentDom.clientWidth;

        node.layout.width = width;
        node.layout.height = height;
        // node.layout.totalHeight = height;

        // if (node.content === "sub5555") debugger
        node.layout.x = node.isRoot ? this.options.margin : this.options.margin + node.parent.layout.x + node.parent.layout.width;
        if (node.children && node.children.length) {
            let childrenHeight = (node.children.length - 1) * this.options.margin;
            let childrenWidth = 0;
            node.children.forEach((nd, index) => {
                const {width: w, height: h} = this.getTotalHeight(nd);
                // 本身的totalHeight
                childrenWidth = Math.max(this.options.margin + w, childrenWidth);
                childrenHeight += h;
            });
            height = Math.max(height, childrenHeight);
            width += childrenWidth;
        } else {
            node.layout.y = this.nodeTree.layout.totalHeight + margin;
            node.layout.totalHeight = node.layout.height;
            let p = node.parent;
            const addHeight = Math.max(height, parent.layout.height) + margin;
            while (p) {
                p.layout.totalHeight += addHeight;
                p = p.parent;
            }
        }
        if (!node.isRoot) {
            const pChildLen = parent.children.length;
            // const marginHeight = this.options.margin * (pChildLen - 1);
            const firstChildLayout = parent.children[0].layout;
            const lastChildLayout = parent.children[pChildLen - 1].layout;
            parent.layout.y = ~~((lastChildLayout.y + lastChildLayout.height - firstChildLayout.y - parent.layout.height) / 2 + firstChildLayout.y);
        }
        return {height, width};
    }

    drawLines() {
        const nodes = this.nodes;
        const context = this.context;
        if (!this.nodeTree.children || !this.nodeTree.children.length) return;


        const drawLine = () => {
            for (let key in this.nodes) {
                const node = this.nodes[key];
                if (node.isRoot) continue;
                const parent = node.parent;
                const pCoord = {x: parent.layout.x, y: parent.layout.y};
                const coord = {x: node.layout.x, y: node.layout.y};
                let space = ~~(this.options.margin / 2);
                if (node.direct === Direct.right) {
                    pCoord.x = parent.layout.width + pCoord.x;
                    pCoord.y = ~~(parent.layout.height / 2) + pCoord.y;
                    coord.y = ~~(node.layout.height / 2) + coord.y;
                }
                this.drawBezierLine(context, pCoord, coord, space);
            }
        };

        drawLine();
    }

    drawBezierLine(context, start: Coord, end: Coord, space: number) {
        context.lineWidth = this.options.line.width;
        context.strokeStyle = this.options.line.color;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.bezierCurveTo(start.x + space, start.y, end.x - space, end.y, end.x, end.y);
        context.stroke();
    }

    drawDomNode() {
        const nodeTree = this.nodeTree;
        const nodeWrapper = DomOperator.createElement("nodes");
        DomOperator.addClass(nodeWrapper, "node-wrapper");
        this.nodeWrapper = nodeWrapper;
        this.el.appendChild(nodeWrapper);

        const createNodeDom = (node: Node, parent?: Node) => {
            if (node.id in this.nodes) {
                console.error(`id: ${node.id} duplicate`);
            } else {
                this.nodes[node.id] = node;
            }
            // const dom = DomOperator.createElement("node");
            // dom.setAttribute("nodeid", <string>node.id);
            // dom.style.visibility = "hidden";
            const dom = DomOperator.createEl({
                type: "node",
                attr: {
                    nodeid: node.id
                },
                style: {
                    visibility: "hidden"
                }
            });
            nodeWrapper.appendChild(dom);
            node.currentDom = dom;
            node.layout = {
                width: 0,
                height: 0,
                totalHeight: 0,
                totalWidth: 0,
                x: 0,
                y: 0
            };
            // 默认右向
            node.direct = Direct[node.direct] || Direct.right;
            // 默认展开
            node.expand = node.expand === undefined ? true : node.expand;
            if (parent !== undefined) {
                node.parent = parent;
            }
            // console.log(node.content, dom.clientWidth);
            if (node.isRoot) {
                DomOperator.addClass(dom, "root");
            }
            if (node.render) {
                node.render(node, dom);
            } else {
                dom.innerText = node.content;
            }
            if (node.children && node.children.length) {
                const expander = DomOperator.createElement("expander");
                dom.appendChild(expander);
                for (let child of node.children) {
                    createNodeDom(child, node);
                }
            }
        };

        createNodeDom(nodeTree);
    }

    addNode(parentId, data: CustomNode): void {
    }

    getNode(id): void {
    }

    removeNode(id): void {
    }

    updateNode(id, data: object): void {
    }

    draw(): void {
    }

    setData(node: CustomNode): void {
        this.nodeTree = node;
        this.drawDomNode();
        this.layout();
        this.drawLines();
        console.log(this.nodes);
    }

    destroy(): void {
    }


}

export {TsMind};