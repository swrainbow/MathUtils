import { SIX_DECIMAL_TOLERANCE  } from "../../const";
import { Vector2Util } from "../../utils/vector2";
import { Line2, LineSide } from "../line2";
import { Vector2 } from "../vector2";

class Triangle2 {
    
    /**
     * 三角形的顶点数据
     */
    points: Vector2[] = [];

    constructor(points: Vector2[] = []) {
        this.points = [...points];
    }

    setPoints(points: Vector2[]) {
        this.points = [...points];
        return this;
    }

    setPoint(point: Vector2, index: 0 | 1 | 2) {
        this.points[index] = point;
        return this;
    }

    clone() {
        return new Triangle2(this.points.map(p => p.clone()));
    }

    getArea() {
        const [a, b, c] = this.points;
        return Vector2Util.cross3(a, b, c) / 2;
    }

    getCentroid() {
        const [a, b, c] = this.points;
        const x = (a.x + b.x + c.x) / 3;
        const y = (a.y + b.y + c.y) / 3;
        return new Vector2(x, y);
    }

    getEdges() {
        const length = this.points.length;
        return this.points.map((pi, i)=> {
            const j = i === length ? 0 : i + 1;
            const pj = this.points[j];
            return new Line2(pi, pj);
        })
    }

    isPointInsideTriangle(point: Vector2, includeEdge: boolean = true, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        /**
         * cross 点和三角形每一条边方向相同
         */
        const edges = this.getEdges();
        let lastSide: LineSide;
        for(let i = 0; i < edges.length; i++) {
            const side = edges[i].getSide(point, tolerance);
            if(side === LineSide.On) {
                return includeEdge;
            }
            if(lastSide === void 0) {
                lastSide = side;
            }
            if(side != lastSide) {
                return false;
            }
        }

        return true;
    }
}

export { Triangle2 }