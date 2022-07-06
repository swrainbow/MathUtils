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

    /**
     * 通过边界点构造一个圆弧
     * @param center 圆心
     * @param startPoint 圆弧起点
     * @param endPoint 圆弧终点
     * @param isClockwise 是否逆时针
     * @returns 
     */
    static createByBoundaryPoint(center: Vector2, startPoint: Vector2, endPoint: Vector2, isClockwise: boolean = CLOCKWISE) {
        const startRadian = Utils.Circle.getAngleByPoint(center, startPoint, isClockwise);
        const endRadian = Utils.Circle.getAngleByPoint(center, endPoint, isClockwise);
        const radius = Utils.Vector2.distance(startPoint, center);

        return new Arc(center, radius, startRadian, endRadian, isClockwise);
    }

    /**
     * 圆心
     * @default Vector2(0,0)
     */
    center: Vector2 = new Vector2(ZERO, ZERO);

    /**
     * 半径
     * @default 0
     */
    radius: number = ZERO;

    /**
     * 起始角
     * @default 0
     */
    startRadian: number = ZERO;
    /**
     * 终止角
     * @default 0
     */
    endRadian: number = ZERO;

    isClockwise: boolean = CLOCKWISE;

    /**
     * 
     * @param center 圆心
     * @param radius 半径
     * @param startRadian 起始角
     * @param endRadian 终止角
     * @param isClockwise 是否逆时针
     */
    constructor(center?: Vector2, radius?: number, startRadian?: number, endRadian?: number, isClockwise: boolean = CLOCKWISE) {
        this.center = center || this.center;
        this.radius = radius || this.radius;
        this.startRadian = startRadian || this.startRadian;
        this.endRadian = endRadian || this.endRadian;
        this.isClockwise = isClockwise;
    }

    /**
     * 设置圆弧圆心
     * @param center 
     * @returns 
     */
    setCenter(center: Vector2) {
        this.center.set(center);
        return this;
    }

    /**
     *  设置圆弧半径
     * @param radius 
     * @returns 
     */
    setRadius(radius: number) {
        this.radius = radius;
        return this;
    }

    /**
     * 设置圆弧的起始角
     * @param radian 
     */
    setStartRadian(radian: number) {
        this.startRadian = radian;
    }

    /**
     * 设置圆弧的终止角
     * @param radian 
     * @returns 
     */
    setEndRadian(radian: number) {
        this.endRadian = radian;
        return this;
    }

    /**
     * 设置圆弧的方向
     * @param value 
     * @returns 
     */
    setClockwise(value: boolean) {
        this.isClockwise = value;
        return this;
    }

    /**
     * 复制当前圆弧
     * @returns 
     */
    clone() {
        const { center, radius, startRadian: startRadian, endRadian: endRadian, isClockwise } = this;
        return new Arc(center.clone(), radius, startRadian, endRadian, isClockwise);
    }

    /**
     * 平移圆弧
     * @param v 
     * @returns 
     */
    translate(v: Vector2) {
        const { center, radius, startRadian: startRadian, endRadian: endRadian, isClockwise } = this;
        return new Arc(center.add(v), radius, startRadian, endRadian, isClockwise);
    }
    /**
     * 绕圆心旋转圆弧
     * @param radian 
     * @returns 
     */
    rotate(radian: number) {
        const { center, radius, startRadian: startRadian, endRadian: endRadian, isClockwise } = this;
        return new Arc(center.clone(), radius, startRadian + radian, endRadian + radian, isClockwise);
    }

    /**
     * 圆弧的开口弧度
     */
    get radian() {
        const diffRadian = this.endRadian - this.startRadian;
        return diffRadian < 0 ? TWO_PI + diffRadian : diffRadian;
    }

    /**
     * 均分圆弧的弧度
     */
    get midRadian() {
        return this.startRadian + this.radian / 2
    }

    /**
     * 圆弧起点
     */
    get startPoint() {
        const { center, radius, startRadian, isClockwise} = this;
        return Utils.Circle.getPointByAngle(center, radius, startRadian, isClockwise);
    }

    /**
     * 圆弧终点
     */
    get endPoint() {
        const { center, radius, startRadian, isClockwise} = this;
        return Utils.Circle.getPointByAngle(center, radius, this.endRadian, isClockwise);
    }

    /**
     *  圆弧弧周上的中点
     */
    get midPoint() {
        const { center, radius, midRadian, isClockwise } = this;
        return Utils.Circle.getPointByAngle(center, radius, midRadian, isClockwise);
    }


    /**
     * 判断点是否在圆弧上
     * @param point 
     * @param distanceTol 
     * @param angleTol 
     * @returns 
     */
    isPointOnArc(point: Vector2, distanceTol: number = SIX_DECIMAL_TOLERANCE, angleTol: number = SIX_DECIMAL_TOLERANCE) {
        const { center, radius, isClockwise } = this;
        if(Math.abs(Utils.Vector2.distance(point,center) - radius) <= distanceTol) {
            const angle = Utils.Circle.getAngleByPoint(center, point, isClockwise);
            return this.isAngleInsideArc(angle);
        }
    }

    /**
     * 判断点是否在圆弧内
     * @param point 
     * @param includeBorder 
     * @param distanceTol 
     * @param angleTol 
     * @returns 
     */
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

    /**
     * 判断角度是否在圆弧角度范围内
     */
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
        // 至少两个点才能表示圆弧
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