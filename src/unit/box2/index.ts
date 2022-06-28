import { SIX_DECIMAL_TOLERANCE, ZERO } from "../../const";
import { Utils } from "../../utils";
import { Vector2 } from "../vector2";
import { PointInfo } from "./interface";


class Box2 {

    static createByPoints(points: Vector2[]) {
        const { minX, minY, maxX, maxY } = points.reduce((box: PointInfo, point: Vector2) => {
            let { minX, minY, maxX, maxY } = box;
            const { x, y} = point;
            if(x < minX) {
                box.minX = x;
            }
            if(x > maxX) {
                box.maxX = x;
            }
            if( y < minY) {
                box.minY = y;
            }
            if( y > maxY) {
                box.maxY = y;
            }

            return box;
        }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity})


        return new Box2(new Vector2(minX, minY), new Vector2(maxX, maxY));
    }

    /**
     * 根据几何信息计算一个Box2
     * @param center 
     * @param size 
     */
    static createByGeometry(center: Vector2, size: Vector2) {
        const halfSize = size.divide(2);
        const min = center.sub(halfSize);
        const max = center.add(halfSize);
        return new Box2(min, max);
    }

    min: Vector2 = new Vector2(ZERO, ZERO);

    max: Vector2 = new Vector2(ZERO, ZERO);

    constructor();
    constructor(min: Vector2, max: Vector2);
    constructor() {
        const [min, max] = arguments;
        if(min && max) {
            this.min = min.clone();
            this.max = max.clone();
        }
    }

    setMin(min: Vector2) {
        this.min = min;
    }

    setMax(max: Vector2) {
        this.max = max;
    }

    get points() {
        const { x: minX, y: minY} = this.min;
        const { x: maxX, y: maxY} = this.max;

        return [
            new Vector2(minX, minY),
            new Vector2(maxX, minY),
            new Vector2(maxX, maxY),
            new Vector2(minX, maxY),
        ]
    }

    get size() {
        return Utils.Vector2.interpolate(this.min, this.max, 0.5);
    }

    get center() {
        return Utils.Vector2.interpolate(this.min, this.max, 0.5);
    }

    checkValid() {
        return this.max.x > this.min.x && this.max.y > this.min.y;
    }

    isPointInBox(point: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const maxX = this.max.x + tolerance;
        const maxY = this.max.y + tolerance;
        const minX = this.min.x - tolerance;
        const minY = this.min.y - tolerance;

        return point.x <= maxX && point.x >= minX && point.y <= maxY && point.y >= minY;
    }
}

export { Box2 }