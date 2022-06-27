import { Line2, LineSide } from "../unit/line2";
import { Vector2 } from "../unit/vector2";


class Line2Util {
    static isLineIntersectLine(line1: Line2, line2: Line2) {
        return !line1.isParallel(line2)
    }

    static isLineIntersectSegment(line: Line2, segment: Line2) {
        if(line.isParallel(segment)) {
            return false;
        }

        const startSide = line.getSide(segment.start);
        const endSide = line.getSide(segment.end);
        return (startSide === LineSide.On || endSide === LineSide.On) || startSide !== endSide
    }

    static isSegmentIntersectSegment(segment1: Line2, segment2: Line2) {
        const startSide1 = segment2.getSide(segment1.start);
        const endSide1 = segment2.getSide(segment1.end);
        const startSide2 = segment1.getSide(segment1.start);
        const endSide2 = segment1.getSide(segment1.end);

        if(startSide1 === LineSide.On && segment2.isPointOnSegment(segment1.start) ||
           endSide1 === LineSide.On && segment2.isPointOnSegment(segment1.end) ||
           startSide2 === LineSide.On && segment1.isPointOnSegment(segment2.start) ||
           endSide2 === LineSide.On && segment1.isPointOnSegment(segment2.end)) {
               return true;
        }
        return startSide1 !== endSide1 && startSide2 !== endSide2;
    }

    static lineIntersectLine(line1: Line2, line2: Line2) {
        const {x: x0, y: y0} = line1.start;
        const {x: x1, y: y1} = line1.end;

        const {x: x2, y: y2} = line2.start;
        const {x: x3, y: y3} = line2.end;

        const a1 = y1 - y0;
        const b1 = x0 - x1;
        const c1 = x1*y0 - x0*y1;

        const a2 = y3 - y2;
        const b2 = x2 - x3;
        const c2 = x3*y2 - x2*y3;

        const result = a1*b2 - a2 * b1;
        if(result === 0) {
            return undefined;
        }

        const x = (b1*c2 - b2*c1) / result;
        const y = (a2*c1 - a1*c2) / result;

        return new Vector2(x, y);
    }

    static lineIntersectSegment(line: Line2, segment: Line2) {
        const point = this.lineIntersectLine(line, segment);
        if(point) {
            if(segment.isPointOnSegment(point)) {
                return point;
            }
        }
    }

    static segmentIntersectSegment(segment1: Line2, segment2: Line2) {
        const point = this.lineIntersectLine(segment1, segment2);
        if(point) {
            if(segment1.isPointOnSegment(point) && segment2.isPointOnSegment(point)) {
                return point;
            }
        }
    }

    static calcPerpendicularThroughPoint(line: Line2, point: Vector2) {
        const verticalDir = line.getSide(point) === LineSide.Right ? line.rightDirection : line.leftDirection;
        return new Line2(point, point.add(verticalDir.multiply(10)))
    }
}

export { Line2Util}