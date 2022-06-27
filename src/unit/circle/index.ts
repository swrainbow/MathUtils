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
        
    }

    center: Vector2 = new Vector2(ZERO, ZERO);

    radius: number = ZERO;

    constructor(center?: Vector2, radius?: number) {
        this.center = center || this.center;
        if(radius !== undefined) {
            this.radius = radius;
        }
    }

    setCenter(center: Vector2) {
        this.center.set(center.x, center.y);
        return this;
    }

    setRadius(radius: number) {
        this.radius = radius;
        return this;
    }

    clone() {
        return new Circle(this.center.clone(), this.radius);
    }

    translate(v: Vector2) {
        return new Circle(this.center.add(v), this.radius);
    }

    isPointOnCircle(point: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return Math.abs(Utils.Vector2.distance(point, this.center) - this.radius) <= tolerance;
    }

    isPointInsideCircle(point: Vector2, includeBorder: boolean = false, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const distance = Utils.Vector2.distance(point, this.center);
        return includeBorder ? distance <= this.radius + tolerance : distance < this.radius;
    }

    toPoints(length: number) {
        const points: Vector2[] = [];
        if(length > 2) {
        
        }
    }
}