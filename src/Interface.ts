/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:22
 * @Description:
 */

export enum Direct {
    left = "left",
    right = "right",
    top = "top",
    bottom = "bottom"
}

// 坐标
export interface Coord {
    x: number
    y: number
}

interface Layout extends Coord {
    width: number
    height: number
    totalHeight: number // 包含子元素的高度
    totalWidth: number // 包含子元素的宽度
}

// 接收数据时的node类型
export interface CustomNode {
    id: string | number,
    content: string,
    isRoot?: boolean,
    render?: (node: Node, domNode: any) => void,
    children?: Node[],
    direct?: Direct,
    expand?: boolean,
}

// node私有的属性，外部设置数据的时候不能传过来
export interface Node extends CustomNode {
    parent?: Node,
    layout?: Layout,
    currentDom?: any,
    // parentDom?: any,
}

export interface Options {
    el: string | any,
    mode: "canvas" | "html",
    editable: boolean,
    margin: number,
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

    drawDomNode()
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