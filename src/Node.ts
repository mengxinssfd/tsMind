import {Coord, Direct, Layout, Options} from "./Interface";
import {DomOperator} from "./domOperator";

interface Expander extends Coord {
    el?: HTMLElement
}

// 接收数据时的node类型
export interface CustomNode {
    id: string | number,
    content: string,
    isRoot?: boolean,
    render?: (node: Node) => void,
    children?: CustomNode[],
    direct?: Direct | "left" | "right" | "bottom",
    expand?: boolean,
    class?: string,
}

export class Node implements CustomNode {
    content: string;
    direct: Direct | "left" | "right" | "bottom";
    expand: boolean;
    id: string | number;
    isRoot: boolean;
    render?: (node: Node) => void;
    children: Node[];
    class?: string;

    parent?: Node;
    layout: Layout;
    el: HTMLElement;
    expander?: Expander;
    generation: number; // 多少代子孙
    constructor(node: CustomNode, options: Options, nodes: { [key: string]: Node }, wrapper: HTMLElement, parent: Node | null) {
        this.init(node, options, nodes, wrapper, parent);
    }

    private init(node: CustomNode, options: Options, nodes: { [key: string]: Node }, wrapper: HTMLElement, parent: Node | null) {
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
            if (options.direct === "free") {
                // 未设置方向时 以父元素的方向为准，父元素没有方向时默认右向
                this.direct = Direct[node.direct] || parent.direct || Direct.right;
            } else {
                this.direct = <Direct>options.direct;
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
                this.expander = {el: this.createExpander(wrapper), x: 0, y: 0};
            }
            this.children = node.children.map(item => {
                return new Node(item, options, nodes, wrapper, this);
            });
        }
    }

    public resetLayout() {
        this.layout = {
            width: this.layout.width,
            height: this.layout.height,
            x: 0,
            y: 0,
            totalHeight: 0,
            totalWidth: 0,
        };
        this.el.style.left = "0px";
        this.el.style.top = "0px";
    }

    public resetExpander() {
        this.expander.x = 0;
        this.expander.y = 0;
        this.expander.el.style.left = "0px";
        this.expander.el.style.top = "0px";
    }

    private createExpander(wrapper: HTMLElement): HTMLElement {
        const expander = DomOperator.createEl({
            type: "expander",
            style: {
                visibility: "hidden"
            },
            attr: {
                nodeid: this.id,
                class: [
                    "expander",
                    (this.expand ? "expand" : ""),
                    ({
                        [Direct.left]: "left",
                        [Direct.right]: "right",
                        // [Direct.top]: "top",
                        [Direct.bottom]: "bottom"
                    })[this.direct]
                ].filter(i => !!i).join(" "),
            }
        });
        wrapper.appendChild(expander);
        return expander;
    }

    private createNodeDom(wrapper: HTMLElement) {
        const dom = DomOperator.createEl({
            attr: {
                class: [this.isRoot ? "root" : "", this.class].filter(i => !!i).join(" ")
            },
            type: "node"
        });
        if (this.render) {
            this.render(this);
        } else {
            dom.innerText = this.content;
        }
        wrapper.appendChild(dom);
        return dom;
    }

}