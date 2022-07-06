import { Line2, LineSide } from "../unit/line2";
import { Vector2 } from "../unit/vector2";


class Line2Util {
    /**
     * 两条直线是否相交
     * @param line1 straight line1
     * @param line2 straight line2
     * @returns 
     */
    static isLineIntersectLine(line1: Line2, line2: Line2) {
        return !line1.isParallel(line2)
    }

    /**
     * 直线 line 和 线段 segment 是否相交
     * @param line straight line
     * @param segment segement line
     * @returns 
     */
    static isLineIntersectSegment(line: Line2, segment: Line2) {
        if(line.isParallel(segment)) {
            return false;
        }
        // 判断 segment 的端点是否在直线的两侧， 或在直线上
        const startSide = line.getSide(segment.start);
        const endSide = line.getSide(segment.end);
        return (startSide === LineSide.On || endSide === LineSide.On) || startSide !== endSide
    }

    /**
     * 两条线段是否相交
     * @param segment1 
     * @param segment2 
     * @returns 
     */
    static isSegmentIntersectSegment(segment1: Line2, segment2: Line2) {
        // 判断 每条线段都分别跨越了另一条线段所在的直线， 即两个端点分别在该直线两侧
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

    /**
     * 求两条直线的交点
     * @param line1 
     * @param line2 
     * @returns 
     */
    static lineIntersectLine(line1: Line2, line2: Line2) {
        // {x: x0, y: y0} {x: x1, y: y1} 是line1上的两个点
        const {x: x0, y: y0} = line1.start;
        const {x: x1, y: y1} = line1.end;
        // {x: x2, y: y2} {x: x3, y: y3} 是line2上的两个点
        const {x: x2, y: y2} = line2.start;
        const {x: x3, y: y3} = line2.end;

        /**
         * 计算直线一般式
         * Ax + By + C = 0
         * 
         * 配置一：
         * A = y2 - y1;
         * B = x1 - x2;
         * C = x2 * y1 - x1 * y2;
         * 
         * 配置二：
         * A = y1 - y2;
         * B = x2 - x1;
         * C = x1 * y2 - x2 * y1
         */
        const a1 = y1 - y0;
        const b1 = x0 - x1;
        const c1 = x1*y0 - x0*y1;

        const a2 = y3 - y2;
        const b2 = x2 - x3;
        const c2 = x3*y2 - x2*y3;

        // A1*B2 = B1*A2 主要就是斜率
        const result = a1*b2 - a2 * b1;
        if(result === 0) {
            return undefined;
        }

        const x = (b1*c2 - b2*c1) / result;
        const y = (a2*c1 - a1*c2) / result;

        return new Vector2(x, y);
    }

    /**
     * 求直线和和线段的交点
     * @param line 
     * @param segment 
     * @returns 
     */
    static lineIntersectSegment(line: Line2, segment: Line2) {
        const point = this.lineIntersectLine(line, segment);
        if(point) {
            if(segment.isPointOnSegment(point)) {
                return point;
            }
        }
        return null;
    }

    /**
     * 求两条线段的交点
     * @param segment1 
     * @param segment2 
     * @returns 
     */
    static segmentIntersectSegment(segment1: Line2, segment2: Line2) {
        const point = this.lineIntersectLine(segment1, segment2);
        if(point) {
            if(segment1.isPointOnSegment(point) && segment2.isPointOnSegment(point)) {
                return point;
            }
        }
        return null;
    }

    /**
     * 计算通过point的line 的 垂线
     * @param line 
     * @param point 
     * @returns 
     */
    static calcPerpendicularThroughPoint(line: Line2, point: Vector2) {
        const verticalDir = line.getSide(point) === LineSide.Right ? line.rightDirection : line.leftDirection;
        return new Line2(point, point.add(verticalDir.multiply(10)))
    }
}

export { Line2Util}