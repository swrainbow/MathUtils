import { SIX_DECIMAL_TOLERANCE, TWO_PI, ZERO } from "../../const";
import { Utils } from "../../utils";
import { Line2 } from "../line2";
import { Vector2 } from "../vector2";


class Circle {

    /**
     * 通过不重复的三个点构造一个圆
     * @param p1 
     * @param p2 
     * @param p3 
     */
    static createByThreePoint(p1: Vector2, p2: Vector2, p3: Vector2) {
        const l1 = new Line2(p1, p2);
        const l2 = new Line2(p2, p3);
        const diameter1 = Utils.Line2.calcPerpendicularThroughPoint(l1, l1.center);
        const diameter2 = Utils.Line2.calcPerpendicularThroughPoint(l2, l2.center);
        const center = Utils.Line2.lineIntersectLine(diameter1, diameter2);
        if(!center) {
            throw new Error('The points can not from a circle');
        }
        const radius = Utils.Vector2.distance(center, p1);
        return new Circle(center, radius);
    }

    /**
     * 圆心
     */
    center: Vector2 = new Vector2(ZERO, ZERO);

    /**
     * 半径
     */
    radius: number = ZERO;

    /**
     * 
     * @param center 圆心
     * @param radius 半径
     */
    constructor(center?: Vector2, radius?: number) {
        this.center = center || this.center;
        if(radius !== undefined) {
            this.radius = radius;
        }
    }

    /**
     * 设置圆心
     * @param center 圆心
     * @returns 
     */
    setCenter(center: Vector2) {
        this.center.set(center.x, center.y);
        return this;
    }

    /**
     * 设置半径
     * @param radius 
     * @returns 
     */
    setRadius(radius: number) {
        this.radius = radius;
        return this;
    }

    /**
     * 复制当前 Circle
     * @returns 
     */
    clone() {
        return new Circle(this.center.clone(), this.radius);
    }

    /**
     * 平移圆
     * @param v 
     * @returns 
     */
    translate(v: Vector2) {
        return new Circle(this.center.add(v), this.radius);
    }

    /**
     *  点是否在圆上
     * @param point 
     * @param tolerance 
     * @returns 
     */
    isPointOnCircle(point: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return Math.abs(Utils.Vector2.distance(point, this.center) - this.radius) <= tolerance;
    }

    /**
     * 点是否在园内
     * @param point 
     * @param includeBorder 
     * @param tolerance 
     * @returns 
     */
    isPointInsideCircle(point: Vector2, includeBorder: boolean = false, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const distance = Utils.Vector2.distance(point, this.center);
        return includeBorder ? distance <= this.radius + tolerance : distance < this.radius;
    }

    /**
     * 获取圆周的散点集
     * @param length 
     */
    toPoints(length: number) {
        const points: Vector2[] = [];
        if(length > 2) {
        
        }
    }
}

export { Circle }