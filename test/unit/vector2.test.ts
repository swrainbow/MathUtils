import { Matrix3 } from "../../src/unit/matrix3";
import { Vector2 } from "../../src/unit/vector2";


test('Vector2', ()=> {
    const v1 = new Vector2();
    expect(v1.x).toBe(0);

    const v2 = new Vector2(100, 100);
    expect(v2.x).toBe(100)
})