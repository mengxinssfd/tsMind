"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interface_1 = require("./Interface");
const domOperator_1 = require("./domOperator");
const Expander_1 = require("./Expander");
class Node {
    constructor(node, options, nodes, wrapper, parent) {
        this.init(node, options, nodes, wrapper, parent);
    }
    init(node, options, nodes, wrapper, parent) {
        this.content = node.content;
        if (node.id in nodes) {
            console.error(`id: ${node.id} duplicate`);
            node.id = String(Date.now()).slice(-6);
        }
        this.id = node.id;
        this.isRoot = node.isRoot || !parent;
        this.expand = node.expand === undefined ? true : node.expand;
        this.render = node.render || null;
        if (parent) {
            this.parent = parent;
            if (["free", "left-right"].includes(options.direct)) {
                // 未设置方向时 以父元素的方向为准，父元素没有方向时默认右向
                this.direct = Interface_1.Direct[node.direct] || parent.direct || Interface_1.Direct.right;
            }
            else {
                this.direct = options.direct;
            }
        }
        this.parent = parent;
        this.layout = {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            totalHeight: 0,
            totalWidth: 0,
        };
        this.el = this.createNodeDom(wrapper);
        // 多少代子孙
        this.generation = this.isRoot ? 0 : parent.generation + 1;
        nodes[node.id] = this;
        if (node.children && node.children.length) {
            if (!this.isRoot) {
                // root不能收起第一排子元素
                this.expander = new Expander_1.Expander(this, wrapper);
            }
            this.children = node.children.map(item => {
                return new Node(item, options, nodes, wrapper, this);
            });
        }
    }
    createNodeDom(wrapper) {
        const dom = domOperator_1.DomOperator.createEl({
            attr: {
                class: [this.isRoot ? "root" : "", this.class].filter(i => !!i).join(" "),
                nodeid: this.id
            },
            tagName: Node.TAG_NAME
        });
        if (this.render) {
            this.render(this);
        }
        else {
            dom.innerText = this.content;
        }
        wrapper.appendChild(dom);
        console.log(dom.offsetHeight, dom.offsetWidth);
        return dom;
    }
    hasChild() {
        return !!this.children && !!this.children.length;
    }
    resetLayout() {
        this.layout = {
            width: this.layout.width,
            height: this.layout.height,
            x: 0,
            y: 0,
            totalHeight: 0,
            totalWidth: 0,
        };
        this.el.style.visibility = "hidden";
        // 不设置的话，会把node-wrapper撑开
        this.el.style.left = "0px";
        this.el.style.top = "0px";
        if (this.expander) {
            this.expander.resetLayout();
        }
        if (this.hasChild()) {
            this.children.forEach(node => {
                node.resetLayout();
            });
        }
    }
    setPosition() {
        const node = this;
        const dom = node.el;
        dom.style.left = node.layout.x + "px";
        dom.style.top = node.layout.y + "px";
        dom.style.visibility = "";
        if (node.hasChild()) {
            if (node.expander) {
                node.expander.setPosition();
                node.expander.show();
            }
            if (node.expand) {
                node.children.forEach(nd => {
                    nd.setPosition();
                });
            }
        }
    }
    changeStatus(isExpand) {
        if (isExpand === undefined)
            isExpand = !this.expand;
        this.expand = isExpand;
        if (this.expander)
            this.expander.changeStatus(isExpand);
    }
}
exports.Node = Node;
Node.TAG_NAME = "node";
