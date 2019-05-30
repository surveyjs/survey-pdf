(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { IPoint, IRect, IDocOptions, DocController } from '../src/doc_controller';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';

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
    for (let i: number = 0; i < 10; i++) {
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
test('Not Carry text', async () => {
    let text: string = '111 11111 1111';
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let composite: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        null, controller, text, TextBrick);
    let assumeRect: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText(text).width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.measureText().height
    };
    TestHelper.equalRect(expect, composite, assumeRect);
});
test('Carry text', async () => {
    let text: string = '111 11111 1111';
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [options.margins.left +
        new DocController(options).measureText('1').width * 5 / DocController.MM_TO_PT +
        options.margins.right, 297];
    let controller: DocController = new DocController(options);
    let composite: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        null, controller, text, TextBrick);
    let assumeRect: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText('11111').width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.measureText('1').height * 3
    };
    TestHelper.equalRect(expect, composite, assumeRect);
});
test('Carry split long text', async () => {
    let text: string = '111111';
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [options.margins.left +
        new DocController(options).measureText('1').width * 3.5 / DocController.MM_TO_PT +
        options.margins.right, 297];
    let controller: DocController = new DocController(options);
    let composite: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        null, controller, text, TextBrick);
    let assumeRect: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText('111').width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.measureText('1').height * 2
    };
    TestHelper.equalRect(expect, composite, assumeRect);
});
test('Push pop margins', async () => {
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let oldMarginLeft: number = controller.margins.left;
    let oldMarginRight: number = controller.margins.right;
    controller.pushMargins();
    controller.margins.left = oldMarginLeft + 1.0;
    controller.margins.right = oldMarginLeft + 1.0;
    controller.popMargins();
    expect(controller.margins.left).toBe(oldMarginLeft);
    expect(controller.margins.right).toBe(oldMarginRight);
});
test('Push pop margins with params', async () => {
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let oldMarginLeft_1: number = controller.margins.left;
    let oldMarginRight_1: number = controller.margins.right;
    controller.pushMargins(oldMarginLeft_1 + 1.0, oldMarginRight_1 + 1.0);
    let oldMarginLeft_2: number = controller.margins.left;
    let oldMarginRight_2: number = controller.margins.right;
    controller.pushMargins(oldMarginLeft_2 + 1.0, oldMarginRight_1 + 2.0);
    controller.popMargins();
    expect(controller.margins.left).toBe(oldMarginLeft_2);
    expect(controller.margins.right).toBe(oldMarginRight_2);
    controller.popMargins();
    expect(controller.margins.left).toBe(oldMarginLeft_1);
    expect(controller.margins.right).toBe(oldMarginRight_1);
});
test('scale rect 0.8', async () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    }
    let assumeRect: IRect = {
        xLeft: 11,
        xRight: 19,
        yTop: 11,
        yBot: 19
    }
    TestHelper.equalRect(expect, SurveyHelper.scaleRect(rect, 0.8), assumeRect);
})
test('scale rect 0.2', async () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    }
    let assumeRect: IRect = {
        xLeft: 14,
        xRight: 16,
        yTop: 14,
        yBot: 16
    }
    TestHelper.equalRect(expect, SurveyHelper.scaleRect(rect, 0.2), assumeRect);
})
test('move rect to (0,0)', async () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    }
    let assumeRect: IRect = {
        xLeft: 0,
        xRight: 10,
        yTop: 0,
        yBot: 10
    }
    TestHelper.equalRect(expect, SurveyHelper.moveRect(rect, 0, 0), assumeRect);
}
);
test('move rect to (0, undefined)', async () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    }
    let assumeRect: IRect = {
        xLeft: 0,
        xRight: 10,
        yTop: 10,
        yBot: 20
    }
    TestHelper.equalRect(expect, SurveyHelper.moveRect(rect, 0), assumeRect);
})
test('move rect to (undefined, 0)', async () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    }
    let assumeRect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 0,
        yBot: 10
    }
    TestHelper.equalRect(expect, SurveyHelper.moveRect(rect, undefined, 0), assumeRect);
})