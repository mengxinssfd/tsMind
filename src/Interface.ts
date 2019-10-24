/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:22
 * @Description:
 */

export enum Direct {
    top,
    bottom,
    left,
    right
}

export interface Node {
    id: string | number,
    content: string,
    isRoot?: boolean,
    render?: (node: Node, domNode: any) => void,
    children?: Node[],
    currentDom?: any,
    direct?: Direct
}

export interface Options {
    el: string | any,
    mode: "canvas" | "html",
    editable: boolean,
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