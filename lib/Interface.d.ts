/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:22
 * @Description:
 */
import { CustomNode } from "./Node";
export declare enum Direct {
    left = "left",
    right = "right",
    bottom = "bottom"
}
export interface Coord {
    x: number;
    y: number;
}
export interface Layout extends Coord {
    width: number;
    height: number;
    totalHeight: number;
    totalWidth: number;
}
export interface Options {
    el: string | HTMLElement;
    mode: "canvas" | "svg";
    editable: boolean;
    margin: number;
    direct?: Direct | "left" | "right" | "bottom" | "left-right" | "free";
    line: {
        width: number;
        color: string;
    };
}
export interface Operation {
    setData(data: CustomNode): void;
    draw(): void;
    addNode(parentId: string | number, data: CustomNode): void;
    removeNode(id: number): void;
    getNode(id: number): void;
    updateNode(id: number, data: CustomNode): void;
    destroy(): void;
    changeExpandStatus(nodeId: string, isExpand?: boolean): void;
}
export interface LifeCircle {
}
