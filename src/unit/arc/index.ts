import { SIX_DECIMAL_TOLERANCE, TWO_PI, ZERO  } from "../../const";
import { Utils } from "../../utils";
import { Line2 } from "../line2";
import { Vector2 } from "../vector2";

const CLOCKWISE = false;
/**
 * 表示二位世界的圆弧
 */
class Arc {
    /**
     * 通过圆弧上不同的三点构成一个圆弧
     * @param startPoint 
     * @param arcPoint 起点
     * @param endPoint 弧上任意点
     * @param isClockwise 终点
     * @returns 
     */
    static createByThreePoint(startPoint: Vector2, arcPoint: Vector2, endPoint: Vector2, isClockwise: boolean = CLOCKWISE) {
        const l1 = new Line2(startPoint, arcPoint);
        const l2 = new Line2(arcPoint, endPoint);

        const diameter1 = Utils.Line2.calcPerpendicularThroughPoint(l1, l1.center);
        const diameter2 = Utils.Line2.calcPerpendicularThroughPoint(l2, l2.center);

        const center = Utils.Line2.lineIntersectLine(diameter1, diameter2);
        if(!center) {
            throw new Error('the points can not from an arc');
        }

        return Arc.createByBoundaryPoint(center, startPoint, endPoint, isClockwise);
    }

    static createByBoundaryPoint(center: Vector2, startPoint: Vector2, endPoint: Vector2, isClockwise: boolean = CLOCKWISE) {
        const startRadian = Utils.Circle.getAngleByPoint(center, startPoint, isClockwise);
        const endRadian = Utils.Circle.getAngleByPoint(center, endPoint, isClockwise);
        const radius = Utils.Vector2.distance(startPoint, center);

        return new Arc(center, radius, startRadian, endRadian, isClockwise);
    }

    center: Vector2 = new Vector2(ZERO, ZERO);

    radius: number = ZERO;

    startRadian: number = ZERO;

    endRadian: number = ZERO;

    isClockwise: boolean = CLOCKWISE;

    constructor(center?: Vector2, radius?: number, startRadian?: number, endRadian?: number, isClockwise: boolean = CLOCKWISE) {
        this.center = center || this.center;
        this.radius = radius || this.radius;
        this.startRadian = startRadian || this.startRadian;
        this.endRadian = endRadian || this.endRadian;
        this.isClockwise = isClockwise;
    }

    setCenter(center: Vector2) {
        this.center.set(center);
        return this;
    }

    setRadius(radius: number) {
        this.radius = radius;
        return this;
    }

    setStartRadian(radian: number) {
        this.startRadian = radian;
    }

    setEndRadian(radian: number) {
        this.endRadian = radian;
        return this;
    }

    setClockwise(value: boolean) {
        this.isClockwise = value;
        return this;
    }


    clone() {
        const { center, radius, startRadian: startRadian, endRadian: endRadian, isClockwise } = this;
        return new Arc(center.clone(), radius, startRadian, endRadian, isClockwise);
    }

    translate(v: Vector2) {
        const { center, radius, startRadian: startRadian, endRadian: endRadian, isClockwise } = this;
        return new Arc(center.add(v), radius, startRadian, endRadian, isClockwise);
    }

    rotate(radian: number) {
        const { center, radius, startRadian: startRadian, endRadian: endRadian, isClockwise } = this;
        return new Arc(center.clone(), radius, startRadian + radian, endRadian + radian, isClockwise);
    }

    get radian() {
        const diffRadian = this.endRadian - this.startRadian;
        return diffRadian < 0 ? TWO_PI + diffRadian : diffRadian;
    }

    get midRadian() {
        return this.startRadian + this.radian / 2
    }

    get startPoint() {
        const { center, radius, startRadian, isClockwise} = this;
        return Utils.Circle.getPointByAngle(center, radius, startRadian, isClockwise);
    }

    get endPoint() {
        const { center, radius, startRadian, isClockwise} = this;
        return Utils.Circle.getPointByAngle(center, radius, this.endRadian, isClockwise);
    }


    isPointOnArc(point: Vector2, distanceTol: number = SIX_DECIMAL_TOLERANCE, angleTol: number = SIX_DECIMAL_TOLERANCE) {
        const { center, radius, isClockwise } = this;
        if(Math.abs(Utils.Vector2.distance(point,center) - radius) <= distanceTol) {
            const angle = Utils.Circle.getAngleByPoint(center, point, isClockwise);
            return this.isAngleInsideArc(angle);
        }
    }

    isPointInsideArc(point: Vector2, includeBorder: boolean = false, distanceTol: number = SIX_DECIMAL_TOLERANCE, angleTol: number = SIX_DECIMAL_TOLERANCE) {
        const { center, radius, isClockwise} = this;
        const distance = Utils.Vector2.distance(point, center);
        const isInRange = includeBorder ? distance <= radius + distanceTol : distance < radius;
        if(isInRange) {
            const angle = Utils.Circle.getAngleByPoint(center, point, isClockwise);
            return this.isAngleInsideArc(angle);
        }
        return false;
    }

    
    isAngleInsideArc(angle: number, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const { startRadian, endRadian} = this;
        if(endRadian >= startRadian) {
            return angle >= startRadian - tolerance && angle <= endRadian + tolerance;
        }
        return angle >= startRadian - tolerance || angle <= endRadian + tolerance;
    }

    /**
     * 获取圆弧的散点集
     * @param length 
     */
    toPoints(length: number) {
        const points: Vector2[] = [];
        if(length > 1) {
            const step = this.radian / ( length - 1);
            for(let i = 0; i < length; i++) {
                const angle = this.startRadian + step * i;
                points.push(Utils.Circle.getPointByAngle(this.center, this.radius, angle, this.isClockwise))
            }
        }

        return points;
    }
}

export { Arc }