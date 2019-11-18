import { Direct, Layout, Options } from "./Interface";
import { Expander } from "./Expander";
export interface CustomNode {
    id: string | number;
    content: string;
    isRoot?: boolean;
    render?: (node: Node) => void;
    children?: CustomNode[];
    direct?: Direct | "left" | "right" | "bottom";
    expand?: boolean;
    class?: string;
}
export declare class Node implements CustomNode {
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
    generation: number;
    static TAG_NAME: string;
    constructor(node: CustomNode, options: Options, nodes: {
        [key: string]: Node;
    }, wrapper: HTMLElement, parent: Node | null);
    private init;
    private createNodeDom;
    hasChild(): boolean;
    resetLayout(): void;
    setPosition(): void;
    changeStatus(isExpand?: boolean): void;
}
