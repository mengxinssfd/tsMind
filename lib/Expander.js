"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interface_1 = require("./Interface");
const domOperator_1 = require("./domOperator");
var STATE;
(function (STATE) {
    STATE["expand"] = "expand";
    STATE["ellipsis"] = "ellipsis";
})(STATE || (STATE = {}));
class Expander {
    constructor(node, wrapper) {
        this.x = 0;
        this.y = 0;
        this.status = node.expand ? STATE.expand : STATE.ellipsis;
        this.init(node, wrapper);
    }
    init(node, wrapper) {
        const expander = domOperator_1.DomOperator.createEl({
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
                        [Interface_1.Direct.left]: "left",
                        [Interface_1.Direct.right]: "right",
                        // [Direct.top]: "top",
                        [Interface_1.Direct.bottom]: "bottom"
                    })[node.direct]
                ].filter(i => !!i).join(" "),
            }
        });
        wrapper.appendChild(expander);
        this.el = expander;
    }
    resetLayout() {
        // this.el.style.visibility = "hidden";
        this.show(false);
        this.x = 0;
        this.y = 0;
        this.el.style.left = "0px";
        this.el.style.top = "0px";
    }
    setPosition() {
        this.el.style.left = this.x + "px";
        this.el.style.top = this.y + "px";
    }
    show(isShow = true) {
        this.el.style.visibility = isShow ? "" : "hidden";
    }
    changeStatus(isExpand) {
        if (isExpand === undefined)
            isExpand = this.status === STATE.expand;
        this.status = isExpand ? STATE.expand : STATE.ellipsis;
        if (isExpand) {
            domOperator_1.DomOperator.removeClass(this.el, STATE.ellipsis);
            domOperator_1.DomOperator.addClass(this.el, STATE.expand);
        }
        else {
            domOperator_1.DomOperator.removeClass(this.el, STATE.expand);
            domOperator_1.DomOperator.addClass(this.el, STATE.ellipsis);
        }
    }
}
exports.Expander = Expander;
Expander.TAG_NAME = "expander";
