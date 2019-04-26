(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { IPoint, IRect, IDocOptions, DocController } from '../src/doc_controller';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';

test('Merge rects 2 count', () => {
    let rectKeys: string[] = Object.keys(TestHelper.defaultRect);
    let lessKeys = ['yTop', 'xLeft'];
    rectKeys.forEach((key: string) => {
        let firstRect: IRect = TestHelper.defaultRect;
        let secondRect: IRect = TestHelper.defaultRect;
        let assumeRect: IRect = TestHelper.defaultRect;
        (<any>firstRect)[key] += (lessKeys.indexOf(key) < 0) ? 10 : -10;
        (<any>assumeRect)[key] = (<any>firstRect)[key];
        let resultRect = SurveyHelper.mergeRects(firstRect, secondRect);
        TestHelper.equalRect(expect, resultRect, assumeRect);
    })
});
test('Create rect', () => {
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
        TestHelper.equalRect(expect, SurveyHelper.createRect(point, parametres.width, parametres.height), assumeRect);
    }
});
test('Create point', () => {
    let rect: IRect = TestHelper.defaultRect;
    let isTop = true;
    let isLeft = true;
    let x = rect.xLeft;
    let y = rect.yTop;
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(rect, isLeft, isTop), { xLeft: x, yTop: y });
    isLeft = false;
    x = rect.xRight;
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(rect, isLeft, isTop), { xLeft: x, yTop: y });
    isTop = false;
    y = rect.yBot;
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(rect, isLeft, isTop), { xLeft: x, yTop: y });
    isLeft = true;
    x = rect.xLeft;
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(rect, isLeft, isTop), { xLeft: x, yTop: y });
});
test('Not Carry text', () => {
    let text: string = '111 11111 1111';
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let composite: IPdfBrick = SurveyHelper.createTextFlat(controller.leftTopPoint,
        null, controller, text, TextBrick);
    let assumeRect: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText(text).width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.measureText().height
    };
    TestHelper.equalRect(expect, composite, assumeRect);
});
test('Carry text', () => {
    let text: string = '111 11111 1111';
    let options: IDocOptions = TestHelper.defaultOptions;
    options.paperWidth = options.margins.marginLeft +
        (new DocController(TestHelper.defaultOptions)).measureText('1').width * 5 +
        options.margins.marginRight;
    let controller: DocController = new DocController(options);
    let composite: IPdfBrick = SurveyHelper.createTextFlat(controller.leftTopPoint,
        null, controller, text, TextBrick);
    let assumeRect: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText('11111').width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.measureText('1').height * 3
    };
    TestHelper.equalRect(expect, composite, assumeRect);
});
test('Carry split long text', () => {
    let text: string = '111111';
    let options: IDocOptions = TestHelper.defaultOptions;
    options.paperWidth = options.margins.marginLeft +
        (new DocController(TestHelper.defaultOptions)).measureText('1').width * 3 +
        options.margins.marginRight;
    let controller: DocController = new DocController(options);
    let composite: IPdfBrick = SurveyHelper.createTextFlat(controller.leftTopPoint,
        null, controller, text, TextBrick);
    let assumeRect: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText('111').width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.measureText('1').height * 2
    };
    TestHelper.equalRect(expect, composite, assumeRect);
});