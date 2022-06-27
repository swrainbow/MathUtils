import { IVec2 } from "./interface";
import { ZERO, ONE, MAX, MIN, TWO_PI, SIX_DECIMAL_TOLERANCE } from '../../const';
import { Matrix3 } from "../matrix3";
import { NumberUtil } from "../../common/number";


class Vector2 {
    static readonly ZERO = new Vector2(ZERO, ZERO);

    static readonly ONE = new Vector2(ONE, ONE);

    static readonly MAX = new Vector2(MAX, MAX);

    static readonly MIN = new Vector2(MIN, MIN);

    static X_DIRECTION = new Vector2(ONE, ZERO);

    static Y_DIRECTION = new Vector2(ZERO, ONE);

    x: number = ZERO;
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

    set(x: number, y: number): Vector2;
    set(point: Partial<IVec2>): Vector2;
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

    setX(x: number) {
        this.x = x;
        return this;
    }

    setY(y: number) {
        this.y = y;
        return this;
    }

    copy(v: Vector2) {
        return this.set(v)
    }

    clone() {
        return new Vector2(this);
    }

    get length() {
        return Math.sqrt(this.lengthSq)
    }

    get lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    get angle() {
        const radian = Math.atan2(this.y, this.x);
        return radian < 0 ? radian + TWO_PI : radian;
    }

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

    inverse() {
        const x = this.x === 0?0: -this.x;
        const y = this.y === 0?0: -this.y;
        return new Vector2(x, y);
    }

    normalize() {
        return this.clone().divide(this.length || 1);
    }

    dot(v: Vector2) {
        return this.x * v.x + this.y *v.y;
    }

    cross(v: Vector2) {
        return this.x * v.y - this.y * v.x;
    }

    equals(v: Vector2) {
        return this.x === v.x && this.y === v.y;
    }

    isParallel(v: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return NumberUtil.isEquql(this.cross(v), 0, tolerance);
    }
    
    isOrthogonal(v: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        return NumberUtil.isEquql(this.dot(v), 0, tolerance);
    }

    rotate(angle: number, v: Vector2) {
        const x = this.x - v.x;
        const y = this.y - v.y;

        const x_prime = v.x + ((x * Math.cos(angle)) - (y*Math.sin(angle)));
        const y_prime = v.y + ((x * Math.cos(angle)) - (y*Math.sin(angle)));

        return new Vector2(x_prime, y_prime);
    }
}

export {IVec2, Vector2};