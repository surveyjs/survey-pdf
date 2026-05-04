(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { IPoint, IRect, ISize, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { SurveyPDF } from '../src/survey';
import '../src/entries/pdf-base';

test('Merge rects 2 count', () => {
    let rectKeys: string[] = Object.keys(TestHelper.defaultRect);
    let lessKeys: any = ['yTop', 'xLeft'];
    rectKeys.forEach((key: string) => {
        let firstRect: IRect = TestHelper.defaultRect;
        let secondRect: IRect = TestHelper.defaultRect;
        let assumeRect: IRect = TestHelper.defaultRect;
        (<any>firstRect)[key] += (lessKeys.indexOf(key) < 0) ? 10 : -10;
        (<any>assumeRect)[key] = (<any>firstRect)[key];
        let resultRect = SurveyHelper.mergeRects(firstRect, secondRect);
        TestHelper.equalRect(expect, resultRect, assumeRect);
    });
});
test('Create rect', () => {
    let parametres: ISize = {
        width: 0,
        height: 0
    };
    let point: IPoint = TestHelper.defaultPoint;
    for (let i: number = 0; i < 10; i++) {
        Object.keys(parametres).forEach((key: string) => {
            (<any>parametres)[key]++;
        });
        let assumeRect: IRect = {
            xLeft: point.xLeft,
            xRight: point.xLeft + parametres.width,
            yTop: point.yTop,
            yBot: point.yTop + parametres.height
        };
        TestHelper.equalRect(expect, SurveyHelper.createRect(point, parametres.width, parametres.height), assumeRect);
    }
});
test('Create point', () => {
    let rect: IRect = TestHelper.defaultRect;
    let isTop: boolean = true;
    let isLeft: boolean = true;
    let x: number = rect.xLeft;
    let y: number = rect.yTop;
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
    let composite: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint, controller, text, TextBrick);
    let assumeRect: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText(text).width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, composite, assumeRect);
});
test('Carry text', async () => {
    let text: string = '111 11111 1111';
    let options: IDocOptions = TestHelper.defaultOptions;
    options.margins = {
        top: 10 * 72 / 25.4,
        bot: 10 * 72 / 25.4,
        left: 10 * 72 / 25.4,
        right: 10 * 72 / 25.4
    };
    options.format = [10 +
        new DocController(options).measureText('1').width * 5 / DocOptions.MM_TO_PT +
        10, 297];
    let controller: DocController = new DocController(options);
    let composite: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint, controller, text);
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
    options.margins = {
        top: 10 * 72 / 25.4,
        bot: 10 * 72 / 25.4,
        left: 10 * 72 / 25.4,
        right: 10 * 72 / 25.4
    };
    options.format = [10 +
        new DocController(options).measureText('1').width * 3.5 / DocOptions.MM_TO_PT +
        10, 297];
    let controller: DocController = new DocController(options);
    let composite: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint, controller, text);
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
test('Move rect to (0,0)', () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    };
    let assumeRect: IRect = {
        xLeft: 0,
        xRight: 10,
        yTop: 0,
        yBot: 10
    };
    TestHelper.equalRect(expect, SurveyHelper.moveRect(rect, 0, 0), assumeRect);
});
test('Move rect to (0, undefined)', () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    };
    let assumeRect: IRect = {
        xLeft: 0,
        xRight: 10,
        yTop: 10,
        yBot: 20
    };
    TestHelper.equalRect(expect, SurveyHelper.moveRect(rect, 0), assumeRect);
});
test('Move rect to (undefined, 0)', () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    };
    let assumeRect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 0,
        yBot: 10
    };
    TestHelper.equalRect(expect, SurveyHelper.moveRect(rect, undefined, 0), assumeRect);
});
test('Parse width 10 px', () => {
    expect(SurveyHelper.parseWidth('10px', 100)).toBeCloseTo(10 * 72 / 96);
});
test('Parse width 10', () => {
    expect(SurveyHelper.parseWidth('10', 100)).toBe(10);
});
test('Parse width 10%', () => {
    expect(SurveyHelper.parseWidth('10%', 100)).toBe(10);
});
test('Check set column width', () => {
    let options: IDocOptions = {
        format: [100, 100],
        margins: {
            left: 0,
            right: 0,
            top: 0,
            bot: 0
        }
    };
    let controller: DocController = new DocController(options);
    let gap: number = controller.unitWidth;
    let columnWidth: number = SurveyHelper.getColumnWidth(controller, 3, gap);
    controller.pushMargins();
    SurveyHelper.setColumnMargins(controller, 3, 0, gap);
    expect(controller.margins.left).toBe(0);
    expect(controller.margins.right).toBe(2 * (columnWidth + gap));
    controller.popMargins();
    controller.pushMargins();
    SurveyHelper.setColumnMargins(controller, 3, 1, gap);
    expect(controller.margins.left).toBe(columnWidth + gap);
    expect(controller.margins.right).toBe(columnWidth + gap);
    controller.popMargins();
    SurveyHelper.setColumnMargins(controller, 3, 2, gap);
    expect(controller.margins.left).toBe(2 * (columnWidth + gap));
    expect(controller.margins.right).toBe(0);
});
test('Check textfield with negative width', () => {
    let options: IDocOptions = {
        format: [10, 200],
        margins: {
            top: 10 * 72 / 25.4,
            bot: 10 * 72 / 25.4,
            left: 10 * 72 / 25.4,
            right: 10 * 72 / 25.4
        }
    };
    let controller: DocController = new DocController(options);
    let resultRect: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    let assumeRect: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.unitWidth,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, resultRect, assumeRect);
});
test('Check createSvgContent method', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation((warning) => {});
    const options: IDocOptions = {
        useCustomFontInHtml: true
    };
    const controller: DocController = new DocController(options);
    const old = SurveyHelper.htmlToXml;
    try {
        SurveyHelper.htmlToXml = str => str;
        DocController.addFont('Test Font', 'NNN', 'normal');
        DocController.addFont('Test Font', 'BBB', 'bold');
        DocController.addFont('Test Font', 'III', 'italic');
        DocController.addFont('Test Font', 'BIBIBI', 'bolditalic');
        controller.fontName = 'Test Font';
        const res = SurveyHelper.createSvgContent('<span>Test</span>', 200, controller);
        expect(res.svg).toContain('@font-face { font-family: Test Font');
        const svgElem: string = `<svg xmlns="http://www.w3.org/2000/svg" width="${res.divWidth}px" height="${res.divHeight}px">`;
        expect(res.svg).toContain(svgElem);
    } finally {
        SurveyHelper.htmlToXml = old;
        DocController.customFonts = {};
        spy.mockRestore();
    }
});
test('Check setCanvas method', () => {
    class ContextMock {
        xScale!: number;
        yScale!: number;

        scale = (xScale: number, yScale: number) => {
            this.xScale = xScale;
            this.yScale = yScale;
        };
        fillRect = () => { };
        drawImage = () => { };
    }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    let context!: ContextMock;
    (<any>canvas).getContext = () => {
        context = new ContextMock();
        return context;
    };

    const img = new Image();
    let controller = new DocController({ htmlToImageQuality: 4 });
    SurveyHelper['setCanvas'](controller, canvas, 50, 20, img);
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(80);
    expect(context.xScale).toBe(4);
    expect(context.yScale).toBe(4);

    controller = new DocController({ htmlToImageQuality: 1 });
    SurveyHelper['setCanvas'](controller, canvas, 60, 40, img);
    expect(canvas.width).toBe(60);
    expect(canvas.height).toBe(40);
    expect(context.xScale).toBe(1);
    expect(context.yScale).toBe(1);
});
test('Check getContentQuestionType method with renderAs', () => {
    let json: any = {
        elements: [
            {
                type: 'boolean',
            }
        ]
    };
    let survey = new SurveyPDF(json);
    let question = survey.getAllQuestions()[0];
    let type = SurveyHelper.getContentQuestionType(question, survey);
    expect(type).toEqual('boolean');

    survey = new SurveyPDF(json, { useLegacyBooleanRendering: true });
    question = survey.getAllQuestions()[0];
    type = SurveyHelper.getContentQuestionType(question, survey);
    expect(type).toEqual('boolean-checkbox');

    json = {
        elements: [
            {
                type: 'boolean',
                'renderAs': 'checkbox'
            }
        ]
    };
    survey = new SurveyPDF(json);
    question = survey.getAllQuestions()[0];
    type = SurveyHelper.getContentQuestionType(question, survey);
    expect(type).toEqual('boolean-checkbox');
});
test('Check chooseHtmlFont method', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation((error) => {});
    const warningSpy = jest.spyOn(console, 'warn').mockImplementation((warning) => {});
    let controller = new DocController(
        { fontName: 'custom_font' }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe('helvetica');
    controller = new DocController(
        { fontName: 'custom_font', useCustomFontInHtml: true }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe('helvetica');
    controller = new DocController(
        { fontName: 'custom_font', useCustomFontInHtml: true, base64Bold: 'base64font' }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe('custom_font');
    controller = new DocController(
        { fontName: 'custom_font', useCustomFontInHtml: true, base64Normal: 'base64font' }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe('custom_font');
    controller = new DocController(
        { fontName: 'custom_font2', useCustomFontInHtml: true }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe('helvetica');
    DocController.addFont('custom_font2', 'base64', 'normal');
    controller = new DocController(
        { fontName: 'custom_font2', useCustomFontInHtml: true }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe('custom_font2');
    errorSpy.mockRestore();
    warningSpy.mockRestore();
});

test('check getCorrectedImageSize works incorrectly if image could not be loaded', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation((error) => {});
    const warningSpy = jest.spyOn(console, 'warn').mockImplementation((warning) => {});
    const controller = new DocController(
        { fontName: 'custom_font', margins: {
            top: 10 * 72 / 25.4,
            bot: 10 * 72 / 25.4,
            left: 10 * 72 / 25.4,
            right: 10 * 72 / 25.4
        } },
    );
    let imageSize = await SurveyHelper.getCorrectedImageSize(controller, { imageLink: '' });
    expect(imageSize.width).toBe(0);
    expect(imageSize.height).toBe(0);
    imageSize = await SurveyHelper.getCorrectedImageSize(controller, { imageLink: '', imageWidth: 100, imageHeight: 200 });
    expect(imageSize.width).toBe(75);
    expect(imageSize.height).toBe(150);
    imageSize = await SurveyHelper.getCorrectedImageSize(controller, { imageLink: '', imageWidth: 100, imageHeight: 200, defaultImageWidth: 300, defaultImageHeight: 400 });
    expect(imageSize.width).toBe(75);
    expect(imageSize.height).toBe(150);
    imageSize = await SurveyHelper.getCorrectedImageSize(controller, { imageLink: '', defaultImageWidth: 300, defaultImageHeight: 400 });
    expect(imageSize.width).toBe(225);
    expect(imageSize.height).toBe(300);
    errorSpy.mockRestore();
    warningSpy.mockRestore();
});

test('check SurveyHelper.generateCssTextRule method', () => {
    let css = SurveyHelper.generateCssTextRule({ fontSize: 12, fontStyle: 'bold', fontName: 'MyFont', fontColor: '#404040', lineHeight: 12 });
    expect(css).toBe('"font-size: 12pt; font-weight: bold; font-family: MyFont; color: #404040; lineHeight: 12; margin: 0"');
    css = SurveyHelper.generateCssTextRule({ fontSize: 8, fontStyle: 'normal', fontName: 'Arial', fontColor: '#404040', lineHeight: 12 });
    expect(css).toBe('"font-size: 8pt; font-weight: normal; font-family: Arial; color: #404040; lineHeight: 12; margin: 0"');
});
const cases = [
    {
        title: 'borderRadius smaller than rect width and height with mergeAngles',
        rect: { xLeft: 10, yTop: 10, xRight: 30, yBot: 22 },
        borderRadius: 4,
        mergeAngles: true,
        expectedLines: new Map(Object.entries({
            top: [
                [14, 10, 26, 10],
                [26, 10, 28.209138999323173, 10, 30, 11.790861000676825, 30, 13.999999999999998]
            ],
            right: [
                [30, 14, 30, 18],
                [30, 18, 30, 20.209138999323173, 28.209138999323173, 22, 26, 22]
            ],
            bot: [
                [26, 22, 14, 22],
                [14, 22, 11.790861000676827, 22, 10, 20.209138999323173, 10, 18]
            ],
            left: [
                [10, 18, 10, 14],
                [10, 14, 10, 11.790861000676827, 11.790861000676825, 10, 14, 10]
            ]
        }))
    },
    {
        title: 'borderRadius smaller than rect width and height',
        rect: { xLeft: 10, yTop: 10, xRight: 30, yBot: 22 },
        borderRadius: 4,
        mergeAngles: false,
        expectedLines: new Map(Object.entries({
            top: [
                [11.171572875253808, 11.17157287525381, 11.921718389045948, 10.42142736146167, 12.939134040641823, 10, 14, 10],
                [14, 10, 26, 10],
                [26, 10, 27.060865959358175, 10, 28.07828161095405, 10.42142736146167, 28.828427124746188, 11.171572875253808]
            ],
            right: [
                [28.828427124746188, 11.171572875253808, 29.57857263853833, 11.921718389045948, 30, 12.939134040641823, 30, 13.999999999999998],
                [30, 14, 30, 18],
                [30, 18, 30, 19.060865959358175, 29.57857263853833, 20.07828161095405, 28.82842712474619, 20.82842712474619]
            ],
            bot: [
                [28.82842712474619, 20.82842712474619, 28.07828161095405, 21.57857263853833, 27.060865959358175, 22, 26, 22],
                [26, 22, 14, 22],
                [14, 22, 12.939134040641825, 22, 11.92171838904595, 21.57857263853833, 11.17157287525381, 20.82842712474619]
            ],
            left: [
                [11.17157287525381, 20.82842712474619, 10.42142736146167, 20.07828161095405, 10, 19.060865959358175, 10, 18],
                [10, 18, 10, 14],
                [10, 14, 10, 12.939134040641825, 10.42142736146167, 11.92171838904595, 11.171572875253808, 11.17157287525381]
            ]
        }))
    },

    {
        title: 'borderRadius bigger than rect width and height with mergeAngles',
        rect: { xLeft: 10, yTop: 10, xRight: 30, yBot: 22 },
        borderRadius: 30,
        mergeAngles: true,
        expectedLines: new Map(Object.entries({
            top: [
                [16, 10, 24, 10],
                [24, 10, 27.31370849898476, 10, 30, 12.686291501015239, 30, 15.999999999999998]
            ],
            right: [
                [30, 16, 30, 16],
                [30, 16, 30, 19.31370849898476, 27.31370849898476, 22, 24, 22]
            ],
            bot: [
                [24, 22, 16, 22],
                [16, 22, 12.68629150101524, 22, 10, 19.31370849898476, 10, 16]
            ],
            left: [
                [10, 16, 10, 16],
                [10, 16, 10, 12.68629150101524, 12.686291501015239, 10, 15.999999999999998, 10]
            ]
        }))
    },
    {
        title: 'borderRadius bigger than rect width and height',
        rect: { xLeft: 10, yTop: 10, xRight: 30, yBot: 22 },
        borderRadius: 30,
        mergeAngles: false,
        expectedLines: new Map(Object.entries({
            top: [
                [11.757359312880714, 11.757359312880716, 12.882577583568922, 10.632141042192508, 14.408701060962734, 10, 15.999999999999998, 10],
                [16, 10, 24, 10],
                [24, 10, 25.591298939037262, 10, 27.117422416431076, 10.632141042192504, 28.242640687119284, 11.757359312880713]
            ],
            right: [
                [28.242640687119284, 11.757359312880714, 29.367858957807492, 12.882577583568922, 30, 14.408701060962734, 30, 15.999999999999998],
                [30, 16, 30, 16],
                [30, 16, 30, 17.591298939037266, 29.367858957807492, 19.117422416431076, 28.242640687119284, 20.242640687119284]
            ],
            bot: [
                [28.242640687119284, 20.242640687119284, 27.117422416431076, 21.367858957807492, 25.591298939037266, 22, 24, 22],
                [24, 22, 16, 22],
                [16, 22, 14.408701060962736, 22, 12.882577583568924, 21.367858957807492, 11.757359312880716, 20.242640687119284]
            ],
            left: [
                [11.757359312880716, 20.242640687119284, 10.632141042192508, 19.117422416431076, 10, 17.591298939037266, 10, 16],
                [10, 16, 10, 16],
                [10, 16, 10, 14.408701060962736, 10.632141042192506, 12.882577583568924, 11.757359312880713, 11.757359312880716]
            ]
        }))
    },
    {
        title: 'borderRadius smaller than width but bigger than height with mergeAngles',
        rect: { xLeft: 10, yTop: 10, xRight: 30, yBot: 20 },
        borderRadius: 15,
        mergeAngles: true,
        expectedLines: new Map(Object.entries({
            top: [
                [15, 10, 25, 10],
                [25, 10, 27.761423749153966, 10, 30, 12.238576250846032, 30, 14.999999999999998]
            ],
            right: [
                [30, 15, 30, 15],
                [30, 15, 30, 17.761423749153966, 27.761423749153966, 20, 25, 20]
            ],
            bot: [
                [25, 20, 15, 20],
                [15, 20, 12.238576250846034, 20, 10, 17.761423749153966, 10, 15]
            ],
            left: [
                [10, 15, 10, 15],
                [10, 15, 10, 12.238576250846034, 12.238576250846032, 10, 14.999999999999998, 10]
            ]
        }))
    },
    {
        title: 'borderRadius smaller than width but bigger than height',
        rect: { xLeft: 10, yTop: 10, xRight: 30, yBot: 20 },
        borderRadius: 15,
        mergeAngles: false,
        expectedLines: new Map(Object.entries({
            top: [
                [11.464466094067262, 11.464466094067262, 12.402147986307433, 10.52678420182709, 13.67391755080228, 10, 15, 10],
                [15, 10, 25, 10],
                [25, 10, 26.32608244919772, 10, 27.597852013692563, 10.526784201827088, 28.535533905932738, 11.464466094067262]
            ],
            right: [
                [28.535533905932738, 11.464466094067262, 29.47321579817291, 12.402147986307433, 30, 13.67391755080228, 30, 14.999999999999998],
                [30, 15, 30, 15],
                [30, 15, 30, 16.32608244919772, 29.47321579817291, 17.597852013692563, 28.535533905932738, 18.535533905932738]
            ],
            bot: [
                [28.535533905932738, 18.535533905932738, 27.597852013692567, 19.47321579817291, 26.32608244919772, 20, 25, 20],
                [25, 20, 15, 20],
                [15, 20, 13.67391755080228, 20, 12.402147986307437, 19.47321579817291, 11.464466094067262, 18.535533905932738]
            ],
            left: [
                [11.464466094067262, 18.535533905932738, 10.52678420182709, 17.597852013692567, 10, 16.32608244919772, 10, 15],
                [10, 15, 10, 15],
                [10, 15, 10, 13.673917550802281, 10.52678420182709, 12.402147986307437, 11.464466094067262, 11.464466094067262]
            ]
        }))
    },
    {
        title: 'borderRadius smaller than height but bigger than width with mergeAngles',
        rect: { xLeft: 10, yTop: 10, xRight: 20, yBot: 30 },
        borderRadius: 15,
        mergeAngles: true,
        expectedLines: new Map(Object.entries({
            top: [
                [15, 10, 15, 10],
                [14.999999999999998, 10, 17.761423749153966, 10, 20, 12.238576250846032, 20, 14.999999999999998]
            ],
            right: [
                [20, 15, 20, 25],
                [20, 25, 20, 27.761423749153966, 17.761423749153966, 30, 15, 30]
            ],
            bot: [
                [15, 30, 15, 30],
                [15, 30, 12.238576250846034, 30, 10, 27.761423749153966, 10, 25]
            ],
            left: [
                [10, 25, 10, 15],
                [10, 15, 10, 12.238576250846034, 12.238576250846032, 10, 14.999999999999998, 10]
            ]
        }))
    },
    {
        title: 'borderRadius smaller than height but bigger than width',
        rect: { xLeft: 10, yTop: 10, xRight: 20, yBot: 30 },
        borderRadius: 15,
        mergeAngles: false,
        expectedLines: new Map(Object.entries({
            top: [
                [11.464466094067262, 11.464466094067262, 12.402147986307433, 10.52678420182709, 13.67391755080228, 10, 15, 10],
                [15, 10, 15, 10],
                [14.999999999999998, 10, 16.32608244919772, 10, 17.597852013692563, 10.526784201827088, 18.535533905932738, 11.464466094067262]
            ],
            right: [
                [18.535533905932738, 11.464466094067262, 19.47321579817291, 12.402147986307433, 20, 13.67391755080228, 20, 14.999999999999998],
                [20, 15, 20, 25],
                [20, 25, 20, 26.32608244919772, 19.47321579817291, 27.597852013692563, 18.535533905932738, 28.535533905932738]
            ],
            bot: [
                [18.535533905932738, 28.535533905932738, 17.597852013692567, 29.47321579817291, 16.32608244919772, 30, 15, 30],
                [15, 30, 15, 30],
                [15, 30, 13.67391755080228, 30, 12.402147986307437, 29.47321579817291, 11.464466094067262, 28.535533905932738]
            ],
            left: [
                [11.464466094067262, 28.535533905932738, 10.52678420182709, 27.597852013692567, 10, 26.32608244919772, 10, 25],
                [10, 25, 10, 15],
                [10, 15, 10, 13.673917550802281, 10.52678420182709, 12.402147986307437, 11.464466094067262, 11.464466094067262]
            ]
        }))
    }
];
cases.forEach(({ title, rect, borderRadius, expectedLines, mergeAngles }) => {
    test(`Check createRoundedShape method borderRadius clamping scenarios: ${title}`, () => {
        const shape = SurveyHelper.createRoundedShape(rect, { borderRadius }, mergeAngles);
        expect(shape).toEqual(expectedLines);
    });
});