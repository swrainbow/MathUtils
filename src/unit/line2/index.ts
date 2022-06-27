import { NumberUtil } from '../../common/number';
import { SIX_DECIMAL_TOLERANCE, ZERO } from '../../const';
import { Utils } from '../../utils';
import { Vector2 } from '../vector2'
import { LineSide } from './interface';


class Line2 {
    start: Vector2 = new Vector2(ZERO, ZERO);

    end: Vector2 = new Vector2(ZERO, ZERO);


    constructor();
    constructor(start: Vector2, end: Vector2);
    constructor() {
        const [p1, p2] = arguments;
        if(p1 && p2) {
            this.set(p1, p2);
        }
    }

    set(start: Vector2, end: Vector2) {
        if(start.equals(end)) {
            throw new Error(`The Start point(${start.x}, ${start.y}) and the end point (${end.x},${end.y} are the same and cannot from a line})`);
        }
        this.start = start.clone();
        this.end = end.clone();
        return this;
    }

    setStart(point: Vector2) {
        if(point.equals(this.end)) {
            throw new Error(`The Start point(${point.x}, ${point.y}) and the end point (${this.end.x},${this.end.y} are the same and cannot from a line})`);
        }
        this.start = point.clone();
        return this;
    }

    setEnd(point: Vector2) {
        if(point.equals(this.start)) {
            throw new Error(`The Start point(${point.x}, ${point.y}) and the end point (${this.start.x},${this.start.y} are the same and cannot from a line})`);
        }
        this.end = point.clone();
        return this;
    }

    get length() {
        return this.end.sub(this.start).length;
    }

    get lengthSq() {
        return this.end.sub(this.start).lengthSq;
    }

    get direction() {
        return this.end.sub(this.start).normalize();
    }

    get angle() {
        return this.direction.angle;
    }

    get center() {
        return this.interpolate(0.5);
    }

    get leftDirection() {
        return Utils.Vector2.getLeftDirection(this.direction);
    }

    get rightDirection() {
        return Utils.Vector2.getRightDirection(this.direction);
    }

    translate(v: Vector2) {
        const { start , end } = this;
        return new Line2(start.add(v), end.add(v));
    }

    /**
     * 获取点在线段的那一侧
     * @param point 
     * @param tolerance 
     */
    getSide(point: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const product = Utils.Vector2.cross3(this.start, this.end, point);
        if(NumberUtil.isEquql(product, 0, tolerance)) {
            return LineSide.On;
        }else if(product > 0) {
            return LineSide.Left;
        }
        return LineSide.Right;
    }

    /**
     * 点是否在线段上
     */
    isPointOnSegment(point: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return this.getDistance(point, true) <= tolerance;
    }

    isPointOnLine(point: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return this.getDistance(point) <= tolerance;
    }

    getProjectPoint(point: Vector2, isSegment: boolean = false, useSegmentEnd: boolean = false): Vector2 | undefined {
        const alpha = this.getAlpha(point);
        if(isSegment) {
            if(alpha < 0) {
                return useSegmentEnd ? this.start.clone() : undefined;
            }else if(alpha > 1) {
                return useSegmentEnd ? this.end.clone():undefined;
            }
        }

        return this.interpolate(alpha);
    }

    getDistance(point: Vector2, isSegment: boolean = false) {
        const projection = this.getProjectPoint(point, isSegment, true);
        return Utils.Vector2.distance(point, projection);
    }

    isParallel(line: Line2) {
        return this.direction.isParallel(line.direction);
    }

    isOrthogonal(line: Line2) {
        return this.direction.isOrthogonal(line.direction);
    }

    isHorizontal() {
        return this.direction.equals(Vector2.X_DIRECTION) || this.direction.equals(Vector2.X_DIRECTION.inverse());
    }

    isVertical() {
        return this.direction.equals(Vector2.Y_DIRECTION) || this.direction.equals(Vector2.Y_DIRECTION.inverse());
    }

    getAlpha(point: Vector2, isSegment = false) {
        const alpha = Utils.Vector2.dot3(this.start, this.end, point) / this.lengthSq;
        if(isSegment) {
            if(alpha > 1) {
                return 1;
            }else if(alpha < 0) {
                return 0;
            }
        }
        return alpha;
    }

    interpolate(alpha: number) {
        return this.start.add(this.direction.multiply(this.length * alpha))
    }
}

export { Line2, LineSide}