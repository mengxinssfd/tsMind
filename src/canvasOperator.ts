import {Coord} from "./Interface";

export class CanvasOperator {
    static drawBezierLine(context: CanvasRenderingContext2D, line: { width: number, color: string }, start: Coord, end: Coord, offsetX: number, offsetY: number) {
        context.lineWidth = line.width;
        context.strokeStyle = line.color;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.bezierCurveTo(start.x + offsetX, start.y + offsetY, end.x - offsetX, end.y - offsetY, end.x, end.y);
        context.stroke();
    }
}