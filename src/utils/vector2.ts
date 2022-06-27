import { Vector2  } from "../unit/vector2";

class Vector2Util {
    static getLeftDirection(vec: Vector2) {
        const {x, y} = vec;
        return new Vector2(-y, x);
    }
    static getRightDirection(vec: Vector2) {
        const { x, y} = vec;
        return new Vector2(y, -x);
    }

    static cross3(v1: Vector2, v2: Vector2, v3: Vector2) {
        const v12 = v2.sub(v1);
        const v13 = v3.sub(v1);
        return v12.cross(v13);
    }

    static dot3(v1: Vector2, v2: Vector2, v3: Vector2) {
        const v12 = v2.sub(v1);
        const v13 = v3.sub(v1);
        return v12.dot(v13);
    }

    static distance(v1: Vector2, v2: Vector2) {
        return v2.sub(v1).length;
    }

    static direction(v1: Vector2, v2: Vector2) {
        return v2.sub(v1).normalize();
    }

    static center(v1: Vector2, v2: Vector2) {
        return this.interpolate(v1, v2, 0.5);
    }

    static interpolate(v1: Vector2, v2: Vector2, alpha: number) {
        const direction = v2.sub(v1);
        return v1.add(direction.normalize().multiply(direction.length * alpha));
    }
}

export { Vector2Util }