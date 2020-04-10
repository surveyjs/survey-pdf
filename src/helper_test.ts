import { Question } from 'survey-core';
import { IPoint, IRect, IDocOptions, DocOptions } from './doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick';
import { SurveyHelper } from './helper_survey';

export class TestHelper {
    public static get defaultPoint(): IPoint {
        return {
            xLeft: 10.0 * DocOptions.MM_TO_PT,
            yTop: 10.0 * DocOptions.MM_TO_PT
        }
    }
    public static get defaultRect(): IRect {
        return {
            xLeft: 10.0 * DocOptions.MM_TO_PT,
            xRight: 20.0 * DocOptions.MM_TO_PT,
            yTop: 10.0 * DocOptions.MM_TO_PT,
            yBot: 20.0 * DocOptions.MM_TO_PT
        }
    }
    public static get defaultOptions(): IDocOptions {
        return {
            format: [210.0, 297.0],
            fontSize: 30,
            fontName: SurveyHelper.STANDARD_FONT,
            margins: {

                left: 10.0,
                right: 10.0,
                top: 10.0,
                bot: 10.0
            },
            commercial: true
        };
    }
    public static wrapRect(rect: IRect): IPdfBrick {
        return new PdfBrick(null, null, rect);
    }
    public static wrapRects(rects: IRect[]): IPdfBrick[] {
        let pdfqs: IPdfBrick[] = [];
        rects.forEach((rect: IRect) => {
            pdfqs.push(TestHelper.wrapRect(rect));
        });
        return pdfqs;
    }
    public static wrapRectsPage(rects: IRect[]): IPdfBrick[][] {
        return [TestHelper.wrapRects(rects)];
    }
    public static equalRects(expect: any, rects1: IRect[], rects2: IRect[]) {
        for (let i: number = 0; i < rects1.length; i++) {
            this.equalRect(expect, rects1[i], rects2[i]);
        }
    }
    public static equalRect(expect: any, rect1: IRect, rect2: IRect) {
        expect(rect1.xLeft).toBeCloseTo(rect2.xLeft);
        expect(rect1.xRight).toBeCloseTo(rect2.xRight);
        expect(rect1.yTop).toBeCloseTo(rect2.yTop);
        expect(rect1.yBot).toBeCloseTo(rect2.yBot);
    }
    public static equalPoint(expect: any, point1: IPoint, point2: IPoint) {
        expect(point1.xLeft).toBeCloseTo(point2.xLeft);
        expect(point1.yTop).toBeCloseTo(point2.yTop);
    }
    public static getTitleText(question: Question): string {
        return (question.no != '' ? question.no + ' ' : '') +
            SurveyHelper.getLocString(question.locTitle) +
            (question.isRequired ? question.requiredText : '');
    }
}