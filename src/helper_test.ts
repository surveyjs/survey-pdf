import { Question } from 'survey-core';
import { IPoint, IRect, IDocOptions, DocOptions } from './doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick';
import { SurveyHelper } from './helper_survey';

export class TestHelper {
    public static readonly BASE64_IMAGE_16PX: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAt1BMVEVHcExTXGROYmJIT1ZPXmVJV11ES1JYZ24+SE5JU1s+R0xVYmtYZW1ETlRRXWVUYWpKV1xZZ25YZW5YanNrfIdTYWlaZ29nd4JUYmhIU1lHUVtRXWQ+SlA6QkouNzpFT1ZCS1JSXWVxhI98kp53iZZSXmVcaXE5QkdCTFNndn9WY2tZZm5canJfbXVbZ29hcHlXZGxtfYVNWmFRXWVCTFNKVl04QEdoeINnZGxrc3uAk6Fzb3dxg43scHiMAAAAKnRSTlMALwQXZU4MImyJQbCrPOPZRdOHx4X4t2fR0SfsoHhYseyioqbHwOy+59gMe1UiAAAAuElEQVQYlU2P5xKCQAyEI1gABVSKUu3tOgL2938u74Ybx/2xk3yT2SQAPw2Yb8KfRp6VzAxVDDVwYej1ZbHbG9tQTy030sJP+1po4MfSZs+qsrp+KubSg8e7Wq8mk/E44LinwqJr22IskCA4UgBiUqueUUqJ2gLzO0MCC8Ypx1MFXEIEqhFGjB/0zTXNbPvcXOkx7YjFbYDydsq7DIAeKyS9mSYadGBR51A0JVwy/dcyScFxwLAdgC+IFhIbrHyDqAAAAABJRU5ErkJggg==';
    public static readonly BASE64_IMAGE_100PX: string = 'data:image/png;base64,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';
    public static get defaultPoint(): IPoint {
        return {
            xLeft: 10.0 * DocOptions.MM_TO_PT,
            yTop: 10.0 * DocOptions.MM_TO_PT
        };
    }
    public static get defaultRect(): IRect {
        return {
            xLeft: 10.0 * DocOptions.MM_TO_PT,
            xRight: 20.0 * DocOptions.MM_TO_PT,
            yTop: 10.0 * DocOptions.MM_TO_PT,
            yBot: 20.0 * DocOptions.MM_TO_PT
        };
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
            }
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
    public static equalRects(expect: any, rects1: IRect[], rects2: IRect[], strictMode = false) {
        if(strictMode) {
            expect(rects1.length).toBe(rects2.length);
        }
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