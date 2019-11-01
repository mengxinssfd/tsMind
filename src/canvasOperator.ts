import {Coord} from "./Interface";

export class CanvasOperator {
    static drawBezierLine(context: any, line: { width: number, color: string }, start: Coord, end: Coord, space: number) {
        context.lineWidth = line.width;
        context.strokeStyle = line.color;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.bezierCurveTo(start.x + space, start.y, end.x - space, end.y, end.x, end.y);
        context.stroke();
    }
}