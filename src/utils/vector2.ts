import { Vector2  } from "../unit/vector2";

class Vector2Util {
    /**
     * 获取垂直于目标的左向量
     * @param vec the target vector
     * @returns 
     */
    static getLeftDirection(vec: Vector2) {
        const {x, y} = vec;
        return new Vector2(-y, x);
    }
    /**
     * 获取垂直于目标的右向量
     * @param vec 
     * @returns 
     */
    static getRightDirection(vec: Vector2) {
        const { x, y} = vec;
        return new Vector2(y, -x);
    }

    /**
     * 计算向量(v2 -> v1) 和 向量(v3->v1) 的叉积
     * @param v1 
     * @param v2 
     * @param v3 
     * @returns 
     */
    static cross3(v1: Vector2, v2: Vector2, v3: Vector2) {
        const v12 = v2.sub(v1);
        const v13 = v3.sub(v1);
        return v12.cross(v13);
    }

    /**
     * 计算向量(v2 -> v1) 和 向量(v3->v1) 的点积
     * @param v1 
     * @param v2 
     * @param v3 
     * @returns 
     */
    static dot3(v1: Vector2, v2: Vector2, v3: Vector2) {
        const v12 = v2.sub(v1);
        const v13 = v3.sub(v1);
        return v12.dot(v13);
    }

    /**
     * 获取两点间的距离
     * @param v1 
     * @param v2 
     * @returns 
     */
    static distance(v1: Vector2, v2: Vector2) {
        return v2.sub(v1).length;
    }

    /**
     * 计算V1 -> V2 的方向向量
     * @param v1 
     * @param v2 
     * @returns 
     */
    static direction(v1: Vector2, v2: Vector2) {
        return v2.sub(v1).normalize();
    }

    /**
     * 计算v1 v2的中心
     * @param v1 
     * @param v2 
     * @returns 
     */
    static center(v1: Vector2, v2: Vector2) {
        return this.interpolate(v1, v2, 0.5);
    }

    /**
     *  计算v1 到 V2的线性插值
     * @param v1 
     * @param v2 
     * @param alpha 
     * @returns 
     */
    static interpolate(v1: Vector2, v2: Vector2, alpha: number) {
        const direction = v2.sub(v1);
        return v1.add(direction.normalize().multiply(direction.length * alpha));
    }
}

export { Vector2Util }