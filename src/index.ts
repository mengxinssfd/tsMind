/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:21
 * @Description:
 * @Tips: 谷歌canvas高度不能超过65535px 超过黑屏
 * @Tips: edge超过16358px不画线 火狐17290px
 */
import {Direct, LifeCircle, Operation, Options} from "./Interface";
import {DomOperator} from "./domOperator";
import {CanvasOperator} from "./canvasOperator";
import {Node, CustomNode} from "./Node";

interface widthAndHeight {
    width: number,
    height: number
}

class TsMind implements Operation, LifeCircle {
    private nodeTree: Node;
    private el: HTMLElement;
    private nodeWrapper: HTMLElement;
    nodeWrapperLayout = {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    };
    private readonly options: Options;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private readonly nodes: {
        [key: string]: Node,
    };

    constructor(options: Options) {
        this.options = options;
        const direct = this.options.direct;
        if (direct) {
            this.options.direct = Direct[direct] || direct;
        } else {
            this.options.direct = Direct.right;
        }
        this.nodes = {};
        this.init();
    }

    init() {
        let el = this.options.el;
        el = DomOperator.isDom(el) ? el : document.querySelector(el);
        this.el = el;

        el.style.position = "relative";

        const canvas = this.canvas = <HTMLCanvasElement>DomOperator.createElement("canvas");
        el.appendChild(canvas);

        this.context = canvas.getContext("2d");
    }

    layout() {
        const node = this.nodeTree;

        // const {height, width} = node.children[0].direct === Direct.right ? this.getTotalHeight(node) : this.getLeftTotalHeight(node, node);

        this.getTotalSize(node);

        let hw: { height: number, width: number };
        switch (this.options.direct) {
            case Direct.right:
                hw = this.getRightTotalSize(node);
                break;
            case Direct.left:
                hw = this.getLeftTotalSize(node);
                break;
            case Direct.bottom:
                hw = this.getBottomTotalSize(node);
                break;
            case "free":
                hw = this.getTotalSize(node);
                break;
            case "left-right":
                break;
        }

        let {height, width} = hw;
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
            node.layout = {...node.layout, totalHeight: 0, totalWidth: 0, x: 0, y: 0};
            node.el.style.visibility = "hidden";
            // 不设置的话，会把node-wrapper撑开
            node.el.style.left = "0px";
            node.el.style.top = "0px";
            const expander = node.expander;
            if (expander) {
                expander.el.style.visibility = "hidden";
                expander.y = 0;
                expander.x = 0;
                expander.el.style.left = "0px";
                expander.el.style.top = "0px";
            }
        }
    }

    getTotalSize(node: Node): widthAndHeight {
        let hw: widthAndHeight;
        // 分为上下左右 4个数组
        const obj = node.children.reduce((obj: { [key: string]: Array<Node> }, item) => {
            const direct = item.direct;
            if (obj[direct]) {
                obj[direct].push(item);
            } else {
                obj[direct] = [item];
            }
            return obj;
        }, {});

        console.log(obj);
        /*const {[Direct.left]: left, [Direct.right]: right, [Direct.bottom]: bottom} = obj;
        if (left) {
            hw = left.reduce((oj: widthAndHeight, item) => {
                const {width, height} = this.getBottomTotalSize(item);
                oj.width += width;
                oj.height = Math.max(oj.height, height);
                return oj;
            }, {width: 0, height: 0});
        }*/
        return hw;
    }

    getLeftTotalSize(node: Node): widthAndHeight {
        const {width, height} = this.getRightTotalSize(node);

        // 反转x
        const setX = (node: Node) => {
            const margin = this.options.margin * 2;
            node.layout.x = width - node.layout.x - node.layout.width + margin;

            if (node.expander) {
                node.expander.x = width - node.expander.x + margin;
            }
            if (node.children && node.children.length) {
                node.children.forEach(nd => {
                    setX(nd);
                });
            }
        };
        setX(node);
        return {width, height};
    }

    getBottomTotalSize(node: Node): widthAndHeight {
        const getBottom = (node: Node, root: Node): widthAndHeight => {
            const el = node.el;
            const layout = node.layout;
            let width = el.offsetWidth || el.clientWidth;
            let height = el.offsetHeight || el.clientHeight;
            console.log(el.offsetHeight, el.clientHeight);
            const margin = this.options.margin;
            const parent = node.parent;

            layout.width = width;
            layout.height = height;

            if (parent) {
                layout.y = parent.layout.y + parent.layout.height + margin;
            } else {
                layout.y = margin;
            }
            if (node.children && node.children.length && node.expand) {
                let childrenHeight = 0;
                let childrenWidth = (node.children.length - 1) * margin;
                node.children.forEach((nd) => {
                    const {width: totalWidth, height: totalHeight} = getBottom(nd, root);
                    childrenWidth += totalWidth;
                    childrenHeight = Math.max(childrenHeight, totalHeight + margin);
                });
                width = Math.max(width, childrenWidth);
                height += childrenHeight;
                layout.totalWidth = width;
                layout.totalHeight = height;
                const firstChild = node.children[0].layout;
                const lastChild = node.children[node.children.length - 1].layout;
                layout.x = (lastChild.width + lastChild.x - firstChild.x) / 2 + firstChild.x - layout.width / 2;
            } else {
                layout.totalHeight = height;
                layout.totalWidth = width;
                layout.x = root.layout.totalWidth + margin;
                root.layout.totalWidth += width + margin;
            }

            if (node.expander) {
                node.expander.x = node.layout.x + node.layout.width / 2;
                node.expander.y = node.layout.y + node.layout.height;
            }

            return {width, height};
        };

        return getBottom(node, node);
    }

    getRightTotalSize(node: Node): widthAndHeight {
        const parent = node.parent;
        const margin = this.options.margin;
        let height = node.el.clientHeight || node.el.offsetHeight;
        let width = node.el.clientWidth || node.el.offsetWidth;

        node.layout.width = width;
        node.layout.height = height;
        // node.layout.totalHeight = height;

        // if (node.content === "sub5555") debugger
        node.layout.x = node.isRoot ? this.options.margin : this.options.margin + node.parent.layout.x + node.parent.layout.width;
        if (node.expander) node.expander.x = node.layout.x + node.layout.width;
        if (node.children && node.children.length && node.expand) {
            let childrenHeight = (node.children.length - 1) * this.options.margin;
            let childrenWidth = 0;
            node.children.forEach((nd) => {
                const {width: totalWidth, height: totalHeight} = this.getRightTotalSize(nd);

                childrenHeight += totalHeight;
                childrenWidth = Math.max(childrenWidth, totalWidth + margin);
            });

            // childrenWidth = maxChildWidth + maxWidth + margin;

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
            if (parent.expander) parent.expander.y = parent.layout.y + parent.layout.height / 2;
        }

        return {height, width};
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
                let offsetX = ~~(this.options.margin / 2);
                let offsetY = 0;
                // 右向

                switch (node.direct) {
                    case Direct.left:
                        offsetX = -offsetX;
                        coord.x = node.layout.x + node.layout.width;
                        pCoord.y = ~~(parent.layout.height / 2) + pCoord.y;
                        coord.y = ~~(node.layout.height / 2) + coord.y;
                        break;
                    case Direct.right:
                        pCoord.x = parent.layout.width + pCoord.x;
                        pCoord.y = ~~(parent.layout.height / 2) + pCoord.y;
                        coord.y = ~~(node.layout.height / 2) + coord.y;
                        break;
                    case Direct.bottom:
                        offsetY = offsetX;
                        offsetX = 0;
                        pCoord.x = ~~(parent.layout.width / 2) + pCoord.x;
                        pCoord.y = parent.layout.height + pCoord.y;
                        coord.x = node.layout.x + ~~(node.layout.width / 2);
                        break;
                }
                // pCoord.y = ~~(parent.layout.height / 2) + pCoord.y;
                // coord.y = ~~(node.layout.height / 2) + coord.y;

                CanvasOperator.drawBezierLine(context, {
                    width: this.options.line.width,
                    color: this.options.line.color
                }, pCoord, coord, offsetX, offsetY);
            }
        };

        drawLine(this.nodeTree);
    }

    createDomNode(nodeTree: CustomNode) {
        console.time("tttt");
        const nodeWrapper = DomOperator.createElement("nodes");
        DomOperator.addClass(nodeWrapper, "node-wrapper");
        this.nodeWrapper = nodeWrapper;
        this.el.appendChild(nodeWrapper);

        this.nodeTree = new Node(nodeTree, this.options, this.nodes, nodeWrapper, null);

        console.timeEnd("tttt");
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

    setData(nodeTree: CustomNode): void {
        this.clearCanvas();
        this.createDomNode(nodeTree);
        this.layout();
        this.drawLines();
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