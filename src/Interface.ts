/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:22
 * @Description:
 */


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

export interface Node {
    id: string | number,
    content: string,
    isRoot?: boolean,
    render?: (node: Node, domNode: any) => void,
    children?: Node[],
    currentDom?: any,
    direct?: "top" | "bottom" | "left" | "right",
    parent?: Node,
    parentDom?: any,
    layout?: Layout
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
    setData(data: Node): void

    draw(): void

    addNode(parentId: string | number, data: object): void

    removeNode(id: number): void

    getNode(id: number): void

    updateNode(id: number, data: object): void

    destroy(): void

    drawDomNode()
}


export interface LifeCircle {

}