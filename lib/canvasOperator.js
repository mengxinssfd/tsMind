"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CanvasOperator {
    static drawBezierLine(context, line, start, end, offsetX, offsetY) {
        context.lineWidth = line.width;
        context.strokeStyle = line.color;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.bezierCurveTo(start.x + offsetX, start.y + offsetY, end.x - offsetX, end.y - offsetY, end.x, end.y);
        context.stroke();
    }
}
exports.CanvasOperator = CanvasOperator;
