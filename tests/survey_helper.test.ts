(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { IPoint, IRect, ISize, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { SurveyPDF } from '../src/survey';

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
    let composite: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        null, controller, text, TextBrick);
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
    options.format = [options.margins.left +
        new DocController(options).measureText('1').width * 5 / DocOptions.MM_TO_PT +
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
        new DocController(options).measureText('1').width * 3.5 / DocOptions.MM_TO_PT +
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
test('Scale squre 0.8', () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    };
    let assumeRect: IRect = {
        xLeft: 11,
        xRight: 19,
        yTop: 11,
        yBot: 19
    };
    TestHelper.equalRect(expect, SurveyHelper.scaleRect(rect, 0.8), assumeRect);
});
test('Scale rect 0.8', () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 26,
        yTop: 10,
        yBot: 20
    };
    let assumeRect: IRect = {
        xLeft: 11,
        xRight: 25,
        yTop: 11,
        yBot: 19
    };
    TestHelper.equalRect(expect, SurveyHelper.scaleRect(rect, 0.8), assumeRect);
});
test('Scale rect 0.2', () => {
    let rect: IRect = {
        xLeft: 10,
        xRight: 20,
        yTop: 10,
        yBot: 20
    };
    let assumeRect: IRect = {
        xLeft: 14,
        xRight: 16,
        yTop: 14,
        yBot: 16
    };
    TestHelper.equalRect(expect, SurveyHelper.scaleRect(rect, 0.2), assumeRect);
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
    let columnWidth: number = SurveyHelper.getColumnWidth(controller, 3);
    let gap: number = controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    controller.pushMargins();
    SurveyHelper.setColumnMargins(controller, 3, 0);
    expect(controller.margins.left).toBe(0);
    expect(controller.margins.right).toBe(2 * (columnWidth + gap));
    controller.popMargins();
    controller.pushMargins();
    SurveyHelper.setColumnMargins(controller, 3, 1);
    expect(controller.margins.left).toBe(columnWidth + gap);
    expect(controller.margins.right).toBe(columnWidth + gap);
    controller.popMargins();
    SurveyHelper.setColumnMargins(controller, 3, 2);
    expect(controller.margins.left).toBe(2 * (columnWidth + gap));
    expect(controller.margins.right).toBe(0);
});
test('Check textfield with negative width', () => {
    let options: IDocOptions = {
        format: [10, 200]
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
    }
});
test('Check setCanvas method', () => {
    class ContextMock {
        xScale: number;
        yScale: number;

        scale = (xScale: number, yScale: number) => {
            this.xScale = xScale;
            this.yScale = yScale;
        };
        fillRect = () => { };
        drawImage = () => { }
    }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    let context: ContextMock;
    (<any>canvas).getContext = () => {
        context = new ContextMock();
        return context;
    };

    const img = new Image();
    const oldValue = SurveyHelper.HTML_TO_IMAGE_QUALITY;

    SurveyHelper.HTML_TO_IMAGE_QUALITY = 4;
    SurveyHelper['setCanvas'](canvas, 50, 20, img);
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(80);
    expect(context.xScale).toBe(4);
    expect(context.yScale).toBe(4);

    SurveyHelper.HTML_TO_IMAGE_QUALITY = 1;
    SurveyHelper['setCanvas'](canvas, 60, 40, img);
    expect(canvas.width).toBe(60);
    expect(canvas.height).toBe(40);
    expect(context.xScale).toBe(1);
    expect(context.yScale).toBe(1);

    SurveyHelper.HTML_TO_IMAGE_QUALITY = oldValue;
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

test('Check getImageLink method', async () => {
    const oldHtmlToImage = SurveyHelper.htmlToImage;
    const oldXMLSerializer = window.XMLSerializer;
    const oldshouldConvertImageToPng = SurveyHelper.shouldConvertImageToPng;
    const oldGetImageBase64 = SurveyHelper.getImageBase64;

    const controller = new DocController();
    SurveyHelper.shouldConvertImageToPng = false;
    expect(await SurveyHelper.getImageLink(controller, { link: 'svg_16x16', width: 10, height: 10, objectFit: 'contain' }, false)).toEqual('svg_16x16');
    (<any>SurveyHelper).htmlToImage = () => { return { url: 'jpeg_16x16' }; };
    (<any>SurveyHelper).getImageBase64 = () => { return 'png_16x16'; };
    (<any>window).XMLSerializer = () => {};
    SurveyHelper.shouldConvertImageToPng = true;
    expect(await SurveyHelper.getImageLink(controller, { link: 'svg_16x16', width: 10, height: 10, objectFit: 'contain' }, true)).toEqual('jpeg_16x16');
    expect(await SurveyHelper.getImageLink(controller, { link: 'svg_16x16', width: 10, height: 10, objectFit: 'contain' }, false)).toEqual('png_16x16');

    SurveyHelper.shouldConvertImageToPng = oldshouldConvertImageToPng;
    SurveyHelper.htmlToImage = oldHtmlToImage;
    SurveyHelper.getImageBase64 = oldGetImageBase64;
    window.XMLSerializer = oldXMLSerializer;
});

test('Check chooseHtmlFont method', async () => {
    let controller = new DocController(
        { fontName: 'custom_font' }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe(SurveyHelper.STANDARD_FONT);
    controller = new DocController(
        { fontName: 'custom_font', useCustomFontInHtml: true }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe(SurveyHelper.STANDARD_FONT);
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
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe(SurveyHelper.STANDARD_FONT);
    DocController.addFont('custom_font2', 'base64', 'normal');
    controller = new DocController(
        { fontName: 'custom_font2', useCustomFontInHtml: true }
    );
    expect(SurveyHelper.chooseHtmlFont(controller)).toBe('custom_font2');
});