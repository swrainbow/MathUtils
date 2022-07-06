import { SIX_DECIMAL_TOLERANCE  } from "../const";

class NumberUtil {
    static readonly TOLERANCE = SIX_DECIMAL_TOLERANCE;

    static isEquql(v1: number, v2: number, tolerance = NumberUtil.TOLERANCE) {
        return Math.abs(v1-v2) < tolerance;
    }

    /**
     * 获取相反数
     * @param value
     * @returns 
     */
    static getOppositeNumber(value: number) {
        return value === 0 ? 0 : -value;
    }

    /**
     * 将有符号的 Zero 转化为无符号
     * @param value 
     * @returns 
     */
    static unSignedZero(value: number) {
        // return value === 0 ? 0: value
        return value >>> 0;
    }
}

export { NumberUtil }