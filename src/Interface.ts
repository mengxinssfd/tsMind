/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:22
 * @Description:
 */
import {CustomNode} from "./Node";

export enum Direct {
    left = "left",
    right = "right",
    // top = "top",
    bottom = "bottom"
}

// 坐标
export interface Coord {
    x: number
    y: number
}

export interface Layout extends Coord {
    width: number
    height: number
    totalHeight: number // 包含子元素的高度
    totalWidth: number // 包含子元素的宽度
}





export interface Options {
    el: string | any,
    mode: "canvas" | "svg",
    editable: boolean,
    margin: number,
    direct?: Direct | "left" | "right" | "bottom" | "left-right" | "free", // 默认right
    line: {
        width: number,
        color: string
    }
}

export interface Operation {
    setData(data: CustomNode): void

    draw(): void

    addNode(parentId: string | number, data: CustomNode): void

    removeNode(id: number): void

    getNode(id: number): void

    updateNode(id: number, data: CustomNode): void

    destroy(): void

    setExpand(nodeId: string, isExpand?: boolean): void
}


export interface LifeCircle {

}

enum tes {
    A = "A",
    B = "B"
}

function t(p: tes) {
    console.log(p);
}

t(<tes>"A");
