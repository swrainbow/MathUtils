import { SIX_DECIMAL_TOLERANCE } from "../const";
import { Arc } from "../unit/arc";
import { Circle } from "../unit/circle";
import { Line2 } from "../unit/line2";
import { Vector2Util } from "./vector2";

class Intersection {


    /**
     * 判断直线是否和园相交
     * @param line 直线
     * @param circle 圆
     * @param tolerance 误差
     * @returns 
     */
    static isLineIntersectCircle(line: Line2, circle: Circle, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const length = line.getDistance(circle.center);
        return length <= circle.radius + tolerance;
    }


    /**
     * 判断直线是否和圆（不含圆周） 相交
     * @param line 
     * @param circle 
     * @param tolerance 
     * @returns 
     */
    static isLineIntersectCircleWithoutBorder(line: Line2, circle: Circle, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const length = line.getDistance(circle.center);
        return length < circle.radius + tolerance;
    }

    /**
     * 判断线段是否和圆相交
     * @param segment 线段
     * @param circle 圆
     * @param tolerance 误差
     * @returns 
     */
    static isSegmentIntersectCircle(segment: Line2, circle: Circle, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const length = segment.getDistance(circle.center, true);
        return length <= circle.radius + tolerance;
    }


    /**
     * 判断线段是否和圆 (不含圆周)相交
     * @param segment 线段
     * @param circle 圆
     * @param tolerance 误差
     * @returns 
     */
    static isSegmentIntersectCircleWithoutBorder(segment: Line2, circle: Circle, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const length = segment.getDistance(circle.center, true);
        return length < circle.radius + tolerance;
    }

    static isCircleIntersectCircle(c1: Circle, c2: Circle, includeTangent: boolean = true, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const distance = Vector2Util.distance(c1.center, c2.center);
        return includeTangent ? distance <= c1.radius + c2.radius + tolerance : distance < c1.radius + c2.radius + tolerance;
    }

}

export { Intersection }