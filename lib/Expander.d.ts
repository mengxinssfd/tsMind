import { Coord } from "./Interface";
import { Node } from "./Node";
declare enum STATE {
    expand = "expand",
    ellipsis = "ellipsis"
}
export declare class Expander implements Coord {
    static TAG_NAME: string;
    x: number;
    y: number;
    status: STATE;
    el: HTMLElement;
    constructor(node: Node, wrapper: HTMLElement);
    private init;
    resetLayout(): void;
    setPosition(): void;
    show(isShow?: boolean): void;
    changeStatus(isExpand?: boolean): void;
}
export {};
