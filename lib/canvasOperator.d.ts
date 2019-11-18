import { Coord } from "./Interface";
export declare class CanvasOperator {
    static drawBezierLine(context: CanvasRenderingContext2D, line: {
        width: number;
        color: string;
    }, start: Coord, end: Coord, offsetX: number, offsetY: number): void;
}
