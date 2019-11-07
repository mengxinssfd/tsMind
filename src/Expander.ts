import {Coord, Direct} from "./Interface";
import {Node} from "./Node";
import {DomOperator} from "./domOperator";

enum STATE {expand = "expand", ellipsis = "ellipsis"}

export class Expander implements Coord {
    static TAG_NAME = "expander";
    public x: number = 0;
    public y: number = 0;
    public status: STATE;
    el: HTMLElement;


    constructor(node: Node, wrapper: HTMLElement) {
        this.status = node.expand ? STATE.expand : STATE.ellipsis;
        this.init(node, wrapper);
    }

    private init(node, wrapper) {
        const expander = DomOperator.createEl({
            tagName: Expander.TAG_NAME,
            style: {
                visibility: "hidden"
            },
            attr: {
                nodeid: node.id,
                class: [
                    "expander",
                    (node.expand ? STATE.expand : STATE.ellipsis),
                    ({
                        [Direct.left]: "left",
                        [Direct.right]: "right",
                        // [Direct.top]: "top",
                        [Direct.bottom]: "bottom"
                    })[node.direct]
                ].filter(i => !!i).join(" "),
            }
        });
        wrapper.appendChild(expander);
        this.el = expander;
    }

    public resetLayout() {
        // this.el.style.visibility = "hidden";
        this.show(false);
        this.x = 0;
        this.y = 0;
        this.el.style.left = "0px";
        this.el.style.top = "0px";
    }

    public setPosition() {
        this.el.style.left = this.x + "px";
        this.el.style.top = this.y + "px";
    }

    public show(isShow = true) {
        this.el.style.visibility = isShow ? "" : "hidden";
    }

    public changeStatus(isExpand?: boolean) {
        if (isExpand === undefined) isExpand = this.status === STATE.expand;
        this.status = isExpand ? STATE.expand : STATE.ellipsis;
        if (isExpand) {
            DomOperator.removeClass(this.el, STATE.ellipsis);
            DomOperator.addClass(this.el, STATE.expand);
        } else {
            DomOperator.removeClass(this.el, STATE.expand);
            DomOperator.addClass(this.el, STATE.ellipsis);
        }
    }
}