/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:21
 * @Description:
 * @Tips: 谷歌canvas高度不能超过65535px 超过黑屏
 * @Tips: edge超过16358px不画线 火狐17290px
 */
import { LifeCircle, Operation, Options } from "./Interface";
import { Node, CustomNode } from "./Node";
interface widthAndHeight {
    width: number;
    height: number;
}
declare class TsMind implements Operation, LifeCircle {
    private nodeTree;
    private containerDom;
    private rootNodeDom;
    nodeWrapperLayout: {
        width: number;
        height: number;
        x: number;
        y: number;
    };
    private readonly options;
    private canvas;
    private context;
    private readonly nodes;
    constructor(options: Options);
    init(): void;
    layout(): void;
    reverseX(node: Node, width: number): void;
    setY(node: Node, offsetY: number): void;
    calcLeftAndRightSize(node: Node): widthAndHeight;
    calcLeftSize(node: Node): widthAndHeight;
    calcBottomSize(node: Node): widthAndHeight;
    calcRightSize(node: Node, root: Node, offsetX?: number): widthAndHeight;
    drawLines(): void;
    initNode(nodeTree: CustomNode): void;
    addNode(parentId: any, data: CustomNode): void;
    getNode(id: any): void;
    removeNode(id: any): void;
    updateNode(id: any, data: object): void;
    draw(): void;
    changeExpandStatus(nodeId: string, isExpand?: boolean): void;
    setData(nodeTree: CustomNode): void;
    clearCanvas(): void;
    destroy(): void;
}
export { TsMind };
