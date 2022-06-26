import { SIX_DECIMAL_TOLERANCE  } from "../const";

class NumberUtil {
    static readonly TOLERANCE = SIX_DECIMAL_TOLERANCE;

    static isEquql(v1: number, v2: number, tolerance = NumberUtil.TOLERANCE) {
        return Math.abs(v1-v2) < tolerance;
    }

    static getOppositeNumber(value: number) {
        return value === 0 ? 0 : -value;
    }

    static unSignedZero(value: number) {
        return value >>> 0;
    }
}

export { NumberUtil }