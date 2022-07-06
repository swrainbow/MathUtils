import { IVec2 } from "./interface";
import { ZERO, ONE, MAX, MIN, TWO_PI, SIX_DECIMAL_TOLERANCE } from '../../const';
import { Matrix3 } from "../matrix3";
import { NumberUtil } from "../../common/number";

/**
 * 表示一个二维向量
 */
class Vector2 {
    /**
     * Vector(0, 0)
     */
    static readonly ZERO = new Vector2(ZERO, ZERO);

    /**
     * Vector(1, 1)
     */
    static readonly ONE = new Vector2(ONE, ONE);

    /**
     * Vector(Infinity, Infinity)
     */
    static readonly MAX = new Vector2(MAX, MAX);

    /**
     * Vector(-Infinity, -Infinity)
     */
    static readonly MIN = new Vector2(MIN, MIN);

    /**
     * X轴正方向
     */
    static X_DIRECTION = new Vector2(ONE, ZERO);

    /**
     * Y 轴正方向
     */
    static Y_DIRECTION = new Vector2(ZERO, ONE);

    /**
     * 向量的 x值
     * @default 0
     */
    x: number = ZERO;

    /**
     *  向量的 y值
     * @default 0
     */
    y: number = ZERO;


    constructor(x: number, y: number);
    constructor(point: Partial<IVec2>);
    constructor();
    constructor() {
        const [p1, p2] = arguments;
        if(p1) {
            this.set(p1, p1)
        }
    }
    /**
     * 设置向量的值
     * @param x 
     * @param y 
     */
    set(x: number, y: number): Vector2;
    /**
     * 设置向量的值
     * @param point 
     */
    set(point: Partial<IVec2>): Vector2;
    /**
     * 设置向量的值
     * @param value 向量的X 和 Y值
     */
    set(value: number): Vector2;
    set() {
        if(typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
            this.x = arguments[0];
            this.y = arguments[1];
        }else if(typeof arguments[0] === 'number') {
            this.x = arguments[0];
            this.y = arguments[0];
        }else if(typeof arguments[0] === 'object') {
            const {x, y} = arguments[0];
            this.x = x === undefined ? this.x : x;
            this.y = y === undefined ? this.y : y;
        }


        return this;
    }

    /**
     * 设置向量X的值
     * @param x 
     * @returns 
     */
    setX(x: number) {
        this.x = x;
        return this;
    }

    /**
     * 设置向量的y值
     * @param y 
     * @returns 
     */
    setY(y: number) {
        this.y = y;
        return this;
    }

    /**
     * 将向量V的值拷贝给当前向量
     * @param v 
     * @returns 
     */
    copy(v: Vector2) {
        return this.set(v)
    }

    /**
     * 复制当前向量
     * @returns 
     */
    clone() {
        return new Vector2(this);
    }

    /**
     * 向量的长度
     */
    get length() {
        return Math.sqrt(this.lengthSq)
    }

    /**
     * 向量长度的平方
     */
    get lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     *  向量的角度
     * 弧度制  [ 0, 2 * PI] 逆时针为正
     */
    get angle() {
        const radian = Math.atan2(this.y, this.x);
        return radian < 0 ? radian + TWO_PI : radian;
    }

    /**
     * 向量加法
     * @param {(number | Vector2)} value a scalar or a vector2
     * return A new Vector2
     */
    add(value: number): Vector2;
    add(value: Partial<IVec2>): Vector2;
    add() {
        const value = arguments[0];
        const {x, y} =  this;
        if(typeof value === 'number') {
            return new Vector2(x + value, y + value);
        }else if(typeof value === 'object') {
            const vx = value.x || ZERO;
            const vy = value.y || ZERO;
            return new Vector2(x + vx, y + vy);
        }
        return this.clone();
    }

    /**
     * 向量减法
     * @param {(number | Vector2)} value a scalar or a vector2
     * return A new Vector2
     */
    sub(value: number): Vector2;
    sub(value: Partial<IVec2>): Vector2;
    sub() {
        const value = arguments[0];
        const {x, y} =  this;
        if(typeof value === 'number') {
            return new Vector2(x - value, y - value);
        }else if(typeof value === 'object') {
            const vx = value.x || ZERO;
            const vy = value.y || ZERO;
            return new Vector2(x - vx, y - vy);
        }
        return this.clone();
    }

    /**
     * 向量乘法
     * @param {(number | Vector2)} value a scalar or a vector2
     * return A new Vector2
     */
    multiply(value: number): Vector2;
    multiply(value: Partial<IVec2>): Vector2;
    multiply() {
        const value = arguments[0];
        const {x, y} =  this;
        if(typeof value === 'number') {
            return new Vector2(x * value, y * value);
        }else if(typeof value === 'object') {
            const vx = value.x || 1;
            const vy = value.y || 1;
            return new Vector2(x * vx, y * vy);
        }
        return this.clone();
    }

    /**
     * 向量除法
     * @param {(number | Vector2)} value a scalar or a vector2
     * return A new Vector2
     */
    divide(value: number): Vector2;
    divide(value: Partial<IVec2>): Vector2;
    divide() {
        const value = arguments[0];
        const {x, y} =  this;
        if(typeof value === 'number') {
            return new Vector2(x / value, y / value);
        }else if(typeof value === 'object') {
            const vx = value.x || 1;
            const vy = value.y || 1;
            return new Vector2(x / vx, y / vy);
        }
        return this.clone();
    }

    /**
     * 对当前向量应用矩阵 矩阵左乘！
     * @param matrix 
     * @returns 
     */
    applyMatrix3(matrix: Matrix3) {
        const [
            m11,m12,m13,
            m21,m22,m23,
        ] = matrix.toArray();

        const {x, y} = this;

        const vx = m11*x + m12*y + m13;
        const vy = m21*x + m22*y + m23;

        return new Vector2(vx, vy);
    }

    /**
     * 逆向量
     * @returns 
     */
    inverse() {
        const x = this.x === 0?0: -this.x;
        const y = this.y === 0?0: -this.y;
        return new Vector2(x, y);
    }

    /**
     * 单位向量
     * @returns 
     */
    normalize() {
        return this.clone().divide(this.length || 1);
    }

    /**
     * 点乘
     * @param v 
     * @returns 
     */
    dot(v: Vector2) {
        return this.x * v.x + this.y *v.y;
    }

    /**
     * 叉乘
     * @param v 
     * @returns 
     */
    cross(v: Vector2) {
        return this.x * v.y - this.y * v.x;
    }

    /**
     * 两个向量是否相等
     * @param v 
     * @returns 
     */
    equals(v: Vector2) {
        return this.x === v.x && this.y === v.y;
    }

    /**
     * 两个向量是否平行
     * @param v 
     * @param tolerance 
     * @returns 
     */
    isParallel(v: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return NumberUtil.isEquql(this.cross(v), 0, tolerance);
    }
    
    /**
     * 
     * @param v 两个向量是否正交
     * @param tolerance 
     * @returns 
     */
    isOrthogonal(v: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return NumberUtil.isEquql(this.dot(v), 0, tolerance);
    }

    /**
     * 向量绕轴旋转 先平移原点再旋转
     * @param angle 
     * @param v 
     * @returns 
     */
    rotate(angle: number, v: Vector2) {
        const x = this.x - v.x;
        const y = this.y - v.y;

        const x_prime = v.x + ((x * Math.cos(angle)) - (y*Math.sin(angle)));
        const y_prime = v.y + ((x * Math.cos(angle)) - (y*Math.sin(angle)));

        return new Vector2(x_prime, y_prime);
    }
}

export {IVec2, Vector2};