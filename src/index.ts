/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:21
 * @Description:
 * @Tips: 谷歌canvas高度不能超过65535px 超过黑屏
 * @Tips: edge超过16358px不画线 火狐17290px
 */
import {CustomNode, Direct, LifeCircle, Node, Operation, Options} from "./Interface";
import {DomOperator} from "./domOperator";
import {CanvasOperator} from "./canvasOperator";

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

        // const {height, width} = this.getTotalHeight(node);
        const {height, width} = this.getLeftTotalHeight(node, node);

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

    resetLayout() {
        for (let nodesKey in this.nodes) {
            const node = this.nodes[nodesKey];
            node.layout = {width: 0, height: 0, totalHeight: 0, totalWidth: 0, x: 0, y: 0};
            node.el.style.visibility = "hidden";
            node.el.style.left = "0px";
            node.el.style.top = "0px";
            const expander = node.expander;
            if (expander) {
                expander.y = 0;
                expander.x = 0;
                expander.el.style.left = "0px";
                expander.el.style.top = "0px";
                expander.el.style.visibility = "hidden";
            }
        }
    }

    setPosition(node: Node) {
        const dom = node.el;
        dom.style.left = node.layout.x + "px";
        dom.style.top = node.layout.y + "px";
        dom.style.visibility = "";
        if (node.children) {
            const expander = node.expander;
            if (expander) {
                expander.el.style.left = expander.x + "px";
                expander.el.style.top = expander.y + "px";
                expander.el.style.visibility = "";
            }
            if (node.expand) {
                node.children.forEach(nd => {
                    this.setPosition(nd);
                });
            }
        }
    }

    getLeftTotalHeight(node: Node, root: Node): { width: number, height: number } {
        const parent = node.parent;
        const margin = this.options.margin;
        let height = node.el.clientHeight;
        let width = node.el.clientWidth;

        node.layout.width = width;
        node.layout.height = height;
        // node.layout.totalHeight = height;

        // node.layout.x = node.isRoot ? this.options.margin : this.options.margin + node.parent.layout.x + node.parent.layout.width;
        if (node.children && node.children.length && node.expand) {
            let childrenHeight = (node.children.length - 1) * this.options.margin;
            let childrenWidth = 0;
            node.children.forEach((nd, index) => {
                const {width: w, height: h} = this.getLeftTotalHeight(nd, root);
                // 本身的totalHeight
                childrenWidth = Math.max(margin + w, childrenWidth);
                childrenHeight += h;
            });
            node.layout.x = childrenWidth + margin;

            // TODO 左侧扩展margin不对
            const childX = node.layout.x - margin;
            node.children.forEach(nd => {
                nd.layout.x = childX - nd.layout.width;
                if (nd.expander) nd.expander.x = nd.layout.x;
            });
            height = Math.max(height, childrenHeight);
            width += childrenWidth;
        } else {
            node.layout.y = root.layout.totalHeight + margin;
            if (node.expander) node.expander.y = node.layout.y + node.layout.height / 2;
            node.layout.totalWidth = width;
            node.layout.totalHeight = node.layout.height;
            let p = parent;
            if (p) {
                // 父节点全部高度加上此节点高度
                const addHeight = Math.max(height, parent.layout.height) + margin;
                const addWidth = Math.max(width + margin + parent.layout.width, parent.layout.totalWidth);
                while (p) {
                    p.layout.totalHeight += addHeight;
                    p.layout.totalWidth = addWidth;
                    p = p.parent;
                }
            }
        }
        // if (node.expander) node.expander.x = node.layout.x;
        if (!node.isRoot) {
            const pChildLen = parent.children.length;
            // const marginHeight = this.options.margin * (pChildLen - 1);
            const firstChildLayout = parent.children[0].layout;
            const lastChildLayout = parent.children[pChildLen - 1].layout;
            parent.layout.y = ~~((lastChildLayout.y + lastChildLayout.height - firstChildLayout.y - parent.layout.height) / 2 + firstChildLayout.y);
            if (!parent.isRoot) parent.expander.y = parent.layout.y + parent.layout.height / 2;
        }

        return {height, width};
    }

    getTotalHeight(node: Node): { width: number, height: number } {
        const parent = node.parent;
        const margin = this.options.margin;
        let height = node.el.clientHeight;
        let width = node.el.clientWidth;

        node.layout.width = width;
        node.layout.height = height;
        // node.layout.totalHeight = height;

        // if (node.content === "sub5555") debugger
        node.layout.x = node.isRoot ? this.options.margin : this.options.margin + node.parent.layout.x + node.parent.layout.width;
        if (node.expander) node.expander.x = node.layout.x + node.layout.width;
        if (node.children && node.children.length && node.expand) {
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
            if (node.expander) node.expander.y = node.layout.y + node.layout.height / 2;
            node.layout.totalHeight = node.layout.height;
            let p = node.parent;
            if (p) {
                // 父节点全部高度加上此节点高度
                const addHeight = Math.max(height, parent.layout.height) + margin;
                while (p) {
                    p.layout.totalHeight += addHeight;
                    p = p.parent;
                }
            }
        }
        if (!node.isRoot) {
            const pChildLen = parent.children.length;
            // const marginHeight = this.options.margin * (pChildLen - 1);
            const firstChildLayout = parent.children[0].layout;
            const lastChildLayout = parent.children[pChildLen - 1].layout;
            parent.layout.y = ~~((lastChildLayout.y + lastChildLayout.height - firstChildLayout.y - parent.layout.height) / 2 + firstChildLayout.y);
            parent.expander.y = parent.layout.y + parent.layout.height / 2;
        }

        return {height, width};
    }

    drawLines() {
        const context = this.context;
        if (!this.nodeTree.children || !this.nodeTree.children.length || !this.nodeTree.expand) return;


        const drawLine = (node: Node) => {
            if (node.children && node.children.length && node.expand) {
                node.children.forEach(nd => drawLine(nd));
            }
            if (!node.isRoot) {
                const parent = node.parent;
                const pCoord = {x: parent.layout.x, y: parent.layout.y};
                const coord = {x: node.layout.x, y: node.layout.y};
                // 间距
                let space = ~~(this.options.margin / 2);
                // 右向

                switch (node.direct) {
                    case Direct.left:
                        space = -space;
                        coord.x = node.layout.x + node.layout.width;
                        break;
                    case Direct.right:
                        pCoord.x = parent.layout.width + pCoord.x;
                        break;
                }
                pCoord.y = ~~(parent.layout.height / 2) + pCoord.y;
                coord.y = ~~(node.layout.height / 2) + coord.y;

                CanvasOperator.drawBezierLine(context, {
                    width: this.options.line.width,
                    color: this.options.line.color
                }, pCoord, coord, space);
            }
        };

        drawLine(this.nodeTree);
    }


    createDomNode() {
        const nodeTree = this.nodeTree;
        const nodeWrapper = DomOperator.createElement("nodes");
        DomOperator.addClass(nodeWrapper, "node-wrapper");
        this.nodeWrapper = nodeWrapper;
        this.el.appendChild(nodeWrapper);

        const createDom = (node: Node, parent?: Node) => {
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
            node.el = dom;
            node.layout = {width: 0, height: 0, totalHeight: 0, totalWidth: 0, x: 0, y: 0};

            // 默认展开
            node.expand = node.expand === undefined ? true : node.expand;
            if (parent !== undefined) {
                node.parent = parent;
                // 未设置方向时 以父元素的方向为准，父元素没有方向时默认右向
                node.direct = Direct[node.direct] || parent.direct || Direct.right;
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
                if (!node.isRoot) {
                    const expander = DomOperator.createEl({
                        type: "expander",
                        style: {
                            visibility: "hidden"
                        },
                        attr: {
                            nodeid: node.id,
                            class: [
                                "expander",
                                (node.expand ? " expand" : ""),
                                ({
                                    [Direct.left]: "left",
                                    [Direct.right]: "right",
                                    [Direct.top]: "top",
                                    [Direct.bottom]: "bottom"
                                })[node.direct]
                            ].filter(i => !!i).join(" "),
                        },
                        on: {
                            click: (e) => {
                                this.setExpand(<string>node.id);
                            }
                        }
                    });
                    node.expander = {el: expander, x: 0, y: 0};
                    nodeWrapper.appendChild(expander);
                }
                for (let child of node.children) {
                    createDom(child, node);
                }
            }
        };

        createDom(nodeTree);
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

    setExpand(nodeId: string, isExpand?: boolean) {
        const target = this.nodes[nodeId];
        if (isExpand === undefined) isExpand = !target.expand;
        target.expand = isExpand;
        const el = target.expander.el;
        isExpand ?
            DomOperator.addClass(el, "expand")
            : DomOperator.removeClass(el, "expand");
        this.clearCanvas();
        this.resetLayout();
        this.layout();
        this.drawLines();
    }

    setData(node: CustomNode): void {
        this.clearCanvas();
        this.nodeTree = node;
        this.createDomNode();
        this.layout();
        this.drawLines();
        console.log(this.nodes);
    }

    clearCanvas() {
        if (!this.nodeTree || !this.nodeTree.layout) return;
        const {width, height} = this.nodeTree.layout;
        this.context.clearRect(0, 0, width, height);
    }

    destroy(): void {
    }


}

export {TsMind};