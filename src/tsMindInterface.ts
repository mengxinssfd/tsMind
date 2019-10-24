/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 11:22
 * @Description:
 */
interface Node {

}

export interface TsMindInterface {
    node: Node

    init(): void

    draw(): void

    addNode(parentId, data: object): void

    removeNode(id): void

    getNode(id): void

    updateNode(id, data: object): void
}