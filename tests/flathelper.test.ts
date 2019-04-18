(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};
import { FlatQuestion } from "../src/flat_layout/flat_question"
import { TestHelper } from "../src/helper_test"
import { IPoint, IRect } from '../src/doc_controller';
//TODO
let fq = new FlatQuestion(null, null);

test("Test merge rects 2 count", () => {
    let rectKeys: string[] = Object.keys(TestHelper.defaultRect);
    let lessKeys = ['yTop', 'xLeft'];
    rectKeys.forEach((key: string) => {
        let firstRect: IRect = TestHelper.defaultRect;
        let secondRect: IRect = TestHelper.defaultRect;
        let assumeRect: IRect = TestHelper.defaultRect;
        (<any>firstRect)[key] += (lessKeys.indexOf(key) < 0) ? 10 : -10;
        (<any>assumeRect)[key] = (<any>firstRect)[key];
        let resultRect = fq.mergeRects(firstRect, secondRect);
        TestHelper.equalRect(expect, resultRect, assumeRect);
    })
});

test("Test create rect", () => {
    let parametres = {
        width: 0,
        height: 0
    }
    let point: IPoint = TestHelper.defaultPoint;
    for (let i = 0; i < 10; i++) {
        Object.keys(parametres).forEach((key: string) => {
            (<any>parametres)[key]++;
        })
        let assumeRect: IRect = {
            xLeft: point.xLeft,
            xRight: point.xLeft + parametres.width,
            yTop: point.yTop,
            yBot: point.yTop + parametres.height
        }
        TestHelper.equalRect(expect, fq.createRect(point, parametres.width, parametres.height), assumeRect);
    }
});

test("Test create point", () => {
    let rect: IRect = TestHelper.defaultRect;
    let isTop = true;
    let isLeft = true;
    let x = rect.xLeft;
    let y = rect.yTop;
    TestHelper.equalPoint(expect, fq.createPoint(rect, isLeft, isTop), { xLeft: x, yTop: y });
    isLeft = false;
    x = rect.xRight;
    TestHelper.equalPoint(expect, fq.createPoint(rect, isLeft, isTop), { xLeft: x, yTop: y });
    isTop = false;
    y = rect.yBot;
    TestHelper.equalPoint(expect, fq.createPoint(rect, isLeft, isTop), { xLeft: x, yTop: y });
    isLeft = true;
    x = rect.xLeft;
    TestHelper.equalPoint(expect, fq.createPoint(rect, isLeft, isTop), { xLeft: x, yTop: y });
});