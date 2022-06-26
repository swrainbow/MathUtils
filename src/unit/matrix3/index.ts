import { Vector2 } from '../vector2'

const MATRIX3_SIZE = 9;


class Matrix3 {
    static readonly Zero = new Matrix3(
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
    );

    static readonly Identity = new Matrix3(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    )

    static multiplyMatrices(matrices: Matrix3[]) {
        return matrices.reduce((a, b) => a.multiply(b), Matrix3.Identity);
    }


    static preMultiplyMatrices(matrices: Matrix3[]) {
        return matrices.reduce((a, b) => a.preMultiply(b), Matrix3.Identity);
    }

    private static product(a: Matrix3, b: Matrix3) {
        const [
            a11, a12, a13,
            a21, a22, a23,
            a31, a32, a33,
        ] = a.elements;
        const [
            b11, b12, b13,
            b21, b22, b23,
            b31, b32, b33,
        ] = b.elements;

        const m11 = a11 * b11 + a12 * b21 + a13 * b31;
        const m12 = a11 * b12 + a12 * b22 + a13 * b32;
        const m13 = a11 * b13 + a12 * b23 + a13 * b33;
        const m21 = a21 * b11 + a22 * b21 + a23 * b31;
        const m22 = a21 * b12 + a22 * b22 + a23 * b32;
        const m23 = a21 * b13 + a22 * b23 + a23 * b33;
        const m31 = a31 * b11 + a32 * b21 + a33 * b31;
        const m32 = a31 * b12 + a32 * b22 + a33 * b32;
        const m33 = a31 * b13 + a32 * b23 + a33 * b33;

        return [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33,
        ];
    }

    private elements: number[] = [];

    constructor(
        m11: number = 1, m12: number = 0, m13: number = 0,
        m21: number = 0, m22: number = 1, m23: number = 0,
        m31: number = 0, m32: number = 0, m33: number = 1
    ) {
        this.elements = [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33,
        ];
    }

    set(m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number,
    ) {
        this.elements = [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33,
        ];
        return this;
    }

    fromArray(elements: number[], offset: number = 0) {
        const length = elements.length - offset < MATRIX3_SIZE ? elements.length - offset:MATRIX3_SIZE;
        for(let i = 0; i < length; i++) {
            const result = elements[i + offset];
            if(typeof result === 'number') {
                this.elements[i] = elements[i + offset];
            }
        }

        return this;
    }

    toArray() {
        return [...this.elements];
    }

    fromTranslate(v: Vector2) {
        this.set(
            1, 0, v.x,
            0, 1, v.y,
            0, 0, 1,
        )

        return this;
    }

    fromScale(v: Vector2) {
        this.set(
            v.x, 0, 0,
            0, v.y, 0,
            0, 0, 1,
        )

        return this;
    }

    fromRotate(radian: number) {
        const c = Math.cos(radian);
        const s = Math.sin(radian);

        this.set(
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        )
    }

    copy(m: Matrix3) {
        return this.fromArray(m.toArray());
    }

    clone() {
        return new Matrix3().fromArray(this.toArray());
    }

    multiply(m: Matrix3): Matrix3 {
        return new Matrix3().fromArray(Matrix3.product(m, this));
    }

    preMultiply(m: Matrix3) {
        return new Matrix3().fromArray(Matrix3.product(m, this));
    }

    multiplyScalar(v: number) {
        const arr: number[] = [];

        const te = this.elements;
        arr[0] = te[0] * v; arr[1] = te[1] * v; arr[2] = te[2] * v;
        arr[3] = te[3] * v; arr[4] = te[4] * v; arr[5] = te[5] * v;
        arr[6] = te[6] * v; arr[7] = te[7] * v; arr[8] = te[8] * v;

        return new Matrix3().fromArray(arr);
    }

    transpose() {
        const arr: number[] = [];

        const te = this.elements;
        arr[0] = te[0]; arr[1] = te[3]; arr[2] = te[6];
        arr[3] = te[1]; arr[4] = te[4]; arr[5] = te[7];
        arr[6] = te[2]; arr[7] = te[5]; arr[8] = te[8];

        return new Matrix3().fromArray(arr);
    }

    invert() {
        const determinant = this.determinant();
        if (determinant === 0) {
            throw new Error("The matrix determinant is zero");
        }

        const [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33,
        ] = this.elements;

        const d = 1 / this.determinant();

        const n11 = (m22 * m33 - m32 * m23) * d;
        const n12 = -(m12 * m33 - m32 * m13) * d;
        const n13 = (m12 * m23 - m22 * m13) * d;
        const n21 = -(m21 * m33 - m31 * m23) * d;
        const n22 = (m11 * m33 - m31 * m13) * d;
        const n23 = -(m11 * m23 - m21 * m13) * d;
        const n31 = (m21 * m32 - m31 * m22) * d;
        const n32 = -(m11 * m32 - m31 * m12) * d;
        const n33 = (m11 * m22 - m21 * m12) * d;

        return new Matrix3(
            n11, n12, n13,
            n21, n22, n23,
            n31, n32, n33,
        );
    }

    determinant() {
        const [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33,
        ] = this.elements;

        return m11 * (m22 * m33 - m32 * m23)
            - m12 * (m21 * m33 - m31 * m23)
            + m13 * (m21 * m32 - m31 * m22);
    }

    applyTranslate(v: Vector2) {
        const [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33,
        ] = this.elements;
        const { x, y } = v;

        const arr: number[] = [];
        arr[0] = m11 + m31 * x;
        arr[1] = m12 + m32 * x;
        arr[2] = m13 + m33 * x;
        arr[3] = m21 + m31 * y;
        arr[4] = m22 + m32 * y;
        arr[5] = m23 + m33 * y;
        arr[6] = m31;
        arr[7] = m32;
        arr[8] = m33;

        return new Matrix3().fromArray(arr);
    }







}

export { Matrix3 }