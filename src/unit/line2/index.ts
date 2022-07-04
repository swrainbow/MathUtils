import { NumberUtil } from '../../common/number';
import { SIX_DECIMAL_TOLERANCE, ZERO } from '../../const';
import { Utils } from '../../utils';
import { Vector2 } from '../vector2'
import { LineSide } from './interface';

/**
 * 表示二维世界的一条线
 */
class Line2 {
    /**
     * 线的起点
     */
    start: Vector2 = new Vector2(ZERO, ZERO);

    /**
     * 线的终点
     */
    end: Vector2 = new Vector2(ZERO, ZERO);


    constructor();
    /**
     * 
     * @param start Starting point of line or segment
     * @param end Ending point of line or segment
     */
    constructor(start: Vector2, end: Vector2);
    constructor() {
        const [p1, p2] = arguments;
        if(p1 && p2) {
            this.set(p1, p2);
        }
    }

    /**
     *  设置起点和终点 
     * sets the start and the end of line
     * @param start Starting point of line or segment
     * @param end Ending point of line or segment
     * @returns 当前实例
     */
    set(start: Vector2, end: Vector2) {
        if(start.equals(end)) {
            throw new Error(`The Start point(${start.x}, ${start.y}) and the end point (${end.x},${end.y} are the same and cannot from a line})`);
        }
        this.start = start.clone();
        this.end = end.clone();
        return this;
    }

    /**
     * 设置起点
     * Sets the start of the line
     * @param point 
     * @returns 当前实例
     */
    setStart(point: Vector2) {
        if(point.equals(this.end)) {
            throw new Error(`The Start point(${point.x}, ${point.y}) and the end point (${this.end.x},${this.end.y} are the same and cannot from a line})`);
        }
        this.start = point.clone();
        return this;
    }

    /**
     * 设置终点
     * @param point 
     * @returns 
     */
    setEnd(point: Vector2) {
        if(point.equals(this.start)) {
            throw new Error(`The Start point(${point.x}, ${point.y}) and the end point (${this.start.x},${this.start.y} are the same and cannot from a line})`);
        }
        this.end = point.clone();
        return this;
    }

    /**
     * 线段长度
     */
    get length() {
        return this.end.sub(this.start).length;
    }

    /**
     * 线段长度的平方
     */
    get lengthSq() {
        return this.end.sub(this.start).lengthSq;
    }

    /**
     * 线的方向 起点 -> 终点
     */
    get direction() {
        return this.end.sub(this.start).normalize();
    }

    /**
     * 线的方向角
     */
    get angle() {
        return this.direction.angle;
    }

    /**
     * 线段的中点
     */
    get center() {
        return this.interpolate(0.5);
    }

    /**
     * 线的正交左方向
     */
    get leftDirection() {
        return Utils.Vector2.getLeftDirection(this.direction);
    }

    /**
     * 线的正交右方向
     */
    get rightDirection() {
        return Utils.Vector2.getRightDirection(this.direction);
    }

    /**
     *  平移线
     * @param v the vector the translation
     * @returns A new Line
     */
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

    /**
     * 点是否在线上
     * @param point 
     * @param tolerance 
     * @returns 
     */
    isPointOnLine(point: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return this.getDistance(point) <= tolerance;
    }

    /**
     * 获取点在线上的投影点
     * @param point target point 
     * @param isSegment 是否线段
     * @param useSegmentEnd 当投影超出线段时， 是否使用线段端点作为投影点
     * @returns 
     */
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

    /**
     * 获取点到线的距离
     * @param point 
     * @param isSegment 
     * @returns 
     */
    getDistance(point: Vector2, isSegment: boolean = false) {
        const projection = this.getProjectPoint(point, isSegment, true);
        return Utils.Vector2.distance(point, projection);
    }
    /**
     * 和 line 是否平行
     * @param line 
     * @returns 
     */
    isParallel(line: Line2) {
        return this.direction.isParallel(line.direction);
    }

    /**
     * 和 line 是否正交
     * @param line 
     * @returns 
     */
    isOrthogonal(line: Line2) {
        return this.direction.isOrthogonal(line.direction);
    }

    /**
     * 是否水平线
     * @returns 
     */
    isHorizontal() {
        return this.direction.equals(Vector2.X_DIRECTION) || this.direction.equals(Vector2.X_DIRECTION.inverse());
    }

    /**
     * 
     * @returns 是否竖直线
     */
    isVertical() {
        return this.direction.equals(Vector2.Y_DIRECTION) || this.direction.equals(Vector2.Y_DIRECTION.inverse());
    }

    /**
     * ｜a||b|cosY = ab -> |b|cosY / |a| = ab / a^2
     * 计算点在线上的比例
     * @param point 
     * @param isSegment 
     * @returns 
     */
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

    /**
     * 根据线性比例计算线上一点
     * @param alpha 
     * @returns 
     */
    interpolate(alpha: number) {
        return this.start.add(this.direction.multiply(this.length * alpha))
    }
}

export { Line2, LineSide}