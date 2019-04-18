(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};
import { FlatQuestion } from "../src/flat_layout/flat_question"
import { TestHelper } from "../src/helper_test"
import { IRect, IDocOptions, IPoint } from '../src/docController';
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
        (<any>assumeRect)[key] = firstRect[key];
        let resultRect = fq.mergeRects(firstRect, secondRect);
        TestHelper.equalRect(expect, assumeRect, resultRect);
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
        TestHelper.equalRect(expect, assumeRect, fq.createRect(point, parametres.width, parametres.height));
    }
});

test("Test measure text", () => {

});