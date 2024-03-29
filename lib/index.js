"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:21
 * @Description:
 * @Tips: 谷歌canvas高度不能超过65535px 超过黑屏
 * @Tips: edge超过16358px不画线 火狐17290px
 */
const Interface_1 = require("./Interface");
const domOperator_1 = require("./domOperator");
const canvasOperator_1 = require("./canvasOperator");
const Node_1 = require("./Node");
const Expander_1 = require("./Expander");
class TsMind {
    constructor(options) {
        this.nodeWrapperLayout = {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };
        this.options = options;
        const direct = this.options.direct;
        if (direct) {
            this.options.direct = Interface_1.Direct[direct] || direct;
        }
        else {
            this.options.direct = Interface_1.Direct.right;
        }
        this.nodes = {};
        this.init();
    }
    init() {
        let containerDom = this.options.el;
        if (!domOperator_1.DomOperator.isDom(containerDom)) {
            containerDom = document.querySelector(containerDom);
        }
        this.containerDom = containerDom;
        containerDom.style.position = "relative";
        const canvas = this.canvas = domOperator_1.DomOperator.createElement("canvas");
        containerDom.appendChild(canvas);
        this.context = canvas.getContext("2d");
    }
    layout() {
        const node = this.nodeTree;
        // const {height, width} = node.children[0].direct === Direct.right ? this.getTotalHeight(node) : this.getLeftTotalHeight(node, node);
        let hw;
        switch (this.options.direct) {
            case Interface_1.Direct.right:
                hw = this.calcRightSize(node, node);
                break;
            case Interface_1.Direct.left:
                hw = this.calcLeftSize(node);
                break;
            case Interface_1.Direct.bottom:
                hw = this.calcBottomSize(node);
                break;
            case "free":
                break;
            case "left-right":
                hw = this.calcLeftAndRightSize(node);
                break;
        }
        let { height, width } = hw;
        const nwLayout = this.nodeWrapperLayout;
        nwLayout.width = width + this.options.margin * 2;
        nwLayout.height = height + this.options.margin * 2;
        this.rootNodeDom.style.width = nwLayout.width + "px";
        this.rootNodeDom.style.height = nwLayout.height + "px";
        // container的宽高和位置
        const el = this.containerDom;
        this.nodeWrapperLayout.x = Math.max(((el.offsetWidth || el.clientWidth) - nwLayout.width) / 2, 0);
        this.nodeWrapperLayout.y = Math.max(((el.offsetHeight || el.clientHeight) - nwLayout.height) / 2, 0);
        this.rootNodeDom.style.left = nwLayout.x + "px";
        this.rootNodeDom.style.top = nwLayout.y + "px";
        this.canvas.style.position = "absolute";
        this.canvas.style.left = nwLayout.x + "px";
        this.canvas.style.top = nwLayout.y + "px";
        this.canvas.width = nwLayout.width;
        this.canvas.height = nwLayout.height;
        // this.canvas.height = 65535;
        this.canvas.style.width = nwLayout.width + "px";
        this.canvas.style.height = nwLayout.height + "px";
        // this.setPosition(this.nodeTree);
        node.setPosition();
    }
    // 反转x
    reverseX(node, width) {
        const margin = this.options.margin * 2;
        node.layout.x = width - node.layout.x - node.layout.width + margin;
        if (node.expander) {
            node.expander.x = width - node.expander.x + margin;
        }
        if (node.children && node.children.length) {
            node.children.forEach(nd => {
                this.reverseX(nd, width);
            });
        }
    }
    setY(node, offsetY) {
        node.layout.y = node.layout.y + offsetY;
        if (node.expander) {
            node.expander.y = node.expander.y + offsetY;
        }
        if (node.children && node.children.length) {
            node.children.forEach(nd => {
                this.setY(nd, offsetY);
            });
        }
    }
    // 计算左右扩展大小
    calcLeftAndRightSize(node) {
        const margin = this.options.margin;
        const root = this.nodeTree;
        let hw = { width: 0, height: 0 };
        // 分为上下左右 4个数组
        const obj = node.children.reduce((obj, item) => {
            const direct = item.direct;
            if (obj[direct]) {
                obj[direct].push(item);
            }
            else {
                obj[direct] = [item];
            }
            return obj;
        }, {});
        let { [Interface_1.Direct.left]: left, [Interface_1.Direct.right]: right, [Interface_1.Direct.bottom]: bottom } = obj;
        root.layout.width = root.el.offsetWidth | root.el.clientWidth;
        root.layout.height = root.el.offsetHeight | root.el.clientHeight;
        if (left) {
            const offsetX = margin + root.layout.width;
            hw = left.reduce((oj, item, index) => {
                item.layout.totalHeight = oj.height + (index ? margin : 0);
                const { width, height } = this.calcRightSize(item, item, offsetX);
                oj.width = Math.max(oj.width, width);
                oj.height += height;
                return oj;
            }, { width: 0, height: 0 });
            hw.height += (left.length - 1) * margin;
            hw.width = hw.width + margin + root.layout.width;
            left.forEach(item => this.reverseX(item, hw.width));
            const first = left[0].layout;
            const last = left[left.length - 1].layout;
            root.layout.y = ~~((last.y + last.height - first.y - root.layout.height) / 2 + first.y);
            root.layout.totalWidth = Math.max(hw.width, root.layout.width);
            root.layout.totalHeight = hw.height;
            root.layout.x = root.layout.totalWidth - root.layout.width + margin;
        }
        if (right) {
            const offsetX = margin + (left && left.length ? hw.width : root.layout.width);
            root.layout.x = offsetX - root.layout.width;
            let rightHw = right.reduce((oj, item, index) => {
                item.layout.totalHeight = oj.height + (index ? margin : 0);
                const { width, height } = this.calcRightSize(item, item, offsetX);
                oj.width = Math.max(oj.width, width);
                oj.height += height;
                return oj;
            }, { width: 0, height: 0 });
            (hw.height > rightHw.height ? right : left).forEach(item => {
                this.setY(item, Math.abs(hw.height - rightHw.height) / 2);
            });
            hw.width += rightHw.width + offsetX - hw.width;
            hw.height = Math.max(rightHw.height, hw.height);
            root.layout.totalWidth = hw.width;
            root.layout.totalHeight = hw.height;
        }
        return hw;
    }
    calcLeftSize(node) {
        const { width, height } = this.calcRightSize(node, node);
        this.reverseX(node, width);
        return { width, height };
    }
    calcBottomSize(node) {
        const getBottom = (node, root) => {
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
            }
            else {
                layout.y = margin;
            }
            if (node.children && node.children.length && node.expand) {
                let childrenHeight = 0;
                let childrenWidth = (node.children.length - 1) * margin;
                node.children.forEach((nd) => {
                    const { width: totalWidth, height: totalHeight } = getBottom(nd, root);
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
            }
            else {
                layout.totalHeight = height;
                layout.totalWidth = width;
                layout.x = root.layout.totalWidth + margin;
                root.layout.totalWidth += width + margin;
            }
            if (node.expander) {
                node.expander.x = node.layout.x + node.layout.width / 2;
                node.expander.y = node.layout.y + node.layout.height;
            }
            return { width, height };
        };
        return getBottom(node, node);
    }
    calcRightSize(node, root, offsetX = 0) {
        const parent = node.parent;
        const margin = this.options.margin;
        let height = node.el.clientHeight || node.el.offsetHeight;
        let width = node.el.clientWidth || node.el.offsetWidth;
        node.layout.width = width;
        node.layout.height = height;
        // node.layout.totalHeight = height;
        // if (node.content === "sub5555") debugger
        node.layout.x = node === root ? offsetX + margin : (margin + node.parent.layout.x + node.parent.layout.width);
        if (node.expander)
            node.expander.x = node.layout.x + node.layout.width;
        if (node.children && node.children.length && node.expand) {
            let childrenHeight = (node.children.length - 1) * this.options.margin;
            let childrenWidth = 0;
            node.children.forEach((nd) => {
                const { width: totalWidth, height: totalHeight } = this.calcRightSize(nd, root);
                childrenHeight += totalHeight;
                childrenWidth = Math.max(childrenWidth, totalWidth + margin);
            });
            // childrenWidth = maxChildWidth + maxWidth + margin;
            height = Math.max(height, childrenHeight);
            width += childrenWidth;
        }
        else {
            node.layout.y = root.layout.totalHeight + margin;
            if (node.expander)
                node.expander.y = node.layout.y + node.layout.height / 2;
            node.layout.totalHeight = node.layout.height;
            let p = node.parent;
            if (p) {
                // 全部父节点高度加上此节点高度
                const addHeight = Math.max(height, parent.layout.height) + margin;
                while (p) {
                    p.layout.totalHeight += addHeight;
                    p = p === root ? null : p.parent;
                }
            }
        }
        if (node !== root) {
            const pChildLen = parent.children.length;
            // const marginHeight = this.options.margin * (pChildLen - 1);
            const firstChildLayout = parent.children[0].layout;
            const lastChildLayout = parent.children[pChildLen - 1].layout;
            parent.layout.y = ~~((lastChildLayout.y + lastChildLayout.height - firstChildLayout.y - parent.layout.height) / 2 + firstChildLayout.y);
            if (parent.expander)
                parent.expander.y = parent.layout.y + parent.layout.height / 2;
        }
        return { height, width };
    }
    drawLines() {
        const context = this.context;
        if (!this.nodeTree.children || !this.nodeTree.children.length || !this.nodeTree.expand)
            return;
        const drawLine = (node) => {
            if (node.children && node.children.length && node.expand) {
                node.children.forEach(nd => drawLine(nd));
            }
            if (!node.isRoot) {
                const parent = node.parent;
                const pCoord = { x: parent.layout.x, y: parent.layout.y };
                const coord = { x: node.layout.x, y: node.layout.y };
                // 间距
                const offset = ~~(this.options.margin / 2);
                let offsetX = offset;
                let offsetY = 0;
                // 右向
                switch (node.direct) {
                    case Interface_1.Direct.left:
                        offsetX = -offset;
                        coord.x = node.layout.x + node.layout.width;
                        pCoord.y = ~~(parent.layout.height / 2) + pCoord.y;
                        coord.y = ~~(node.layout.height / 2) + coord.y;
                        break;
                    case Interface_1.Direct.right:
                        pCoord.x = parent.layout.width + pCoord.x;
                        pCoord.y = ~~(parent.layout.height / 2) + pCoord.y;
                        coord.y = ~~(node.layout.height / 2) + coord.y;
                        break;
                    case Interface_1.Direct.bottom:
                        offsetY = offset;
                        offsetX = 0;
                        pCoord.x = ~~(parent.layout.width / 2) + pCoord.x;
                        pCoord.y = parent.layout.height + pCoord.y;
                        coord.x = node.layout.x + ~~(node.layout.width / 2);
                        break;
                }
                // pCoord.y = ~~(parent.layout.height / 2) + pCoord.y;
                // coord.y = ~~(node.layout.height / 2) + coord.y;
                canvasOperator_1.CanvasOperator.drawBezierLine(context, {
                    width: this.options.line.width,
                    color: this.options.line.color
                }, pCoord, coord, offsetX, offsetY);
            }
        };
        drawLine(this.nodeTree);
    }
    initNode(nodeTree) {
        const nodeWrapper = domOperator_1.DomOperator.createElement("nodes");
        domOperator_1.DomOperator.addClass(nodeWrapper, "node-wrapper");
        this.rootNodeDom = nodeWrapper;
        this.containerDom.appendChild(nodeWrapper);
        this.containerDom.addEventListener("click", (e) => {
            e = e || window.event;
            const target = e.target;
            if (target.nodeName === Expander_1.Expander.TAG_NAME.toUpperCase()) {
                const nodeId = target.getAttribute("nodeid");
                this.changeExpandStatus(nodeId);
            }
        });
        this.nodeTree = new Node_1.Node(nodeTree, this.options, this.nodes, nodeWrapper, null);
    }
    addNode(parentId, data) {
    }
    getNode(id) {
    }
    removeNode(id) {
    }
    updateNode(id, data) {
    }
    draw() {
    }
    changeExpandStatus(nodeId, isExpand) {
        const target = this.nodes[nodeId];
        target.changeStatus();
        this.clearCanvas();
        this.nodeTree.resetLayout();
        this.layout();
        this.drawLines();
    }
    setData(nodeTree) {
        this.clearCanvas();
        this.initNode(nodeTree);
        this.layout();
        this.drawLines();
    }
    clearCanvas() {
        if (!this.nodeTree || !this.nodeTree.layout)
            return;
        const { width, height } = this.nodeTree.layout;
        this.context.clearRect(0, 0, width, height);
    }
    destroy() {
    }
}
exports.default = TsMind;
