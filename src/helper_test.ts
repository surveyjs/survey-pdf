import { IRect, IDocOptions } from './docController';
import { IPdfQuestion, PdfQuestion } from './pdf_render/pdf_question';

export class TestHelper {
    static get defaultOptions(): IDocOptions {
        return {
            fontSize: 30, xScale: 0.22, yScale: 0.36,
            margins: {
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                marginBot: 10
            }
        };
    }
    static wrapRect(rect: IRect): IPdfQuestion {
        return new PdfQuestion(null, rect);
    }
    static wrapRects(rects: IRect[]): IPdfQuestion[] {
        let pdfqs: IPdfQuestion[] = new Array();
        rects.forEach((rect: IRect) => {
            pdfqs.push(TestHelper.wrapRect(rect));
        });
        return pdfqs;
    }
    static equalRect(jest: any, question: IPdfQuestion | IRect, rect: IRect) {
        let qRect: IRect = typeof question === 'string' ?
            (<PdfQuestion>question).rect : <IRect>question;
        jest.expect(qRect.xLeft).toBeCloseTo(rect.xLeft);
        jest.expect(qRect.xRight).toBeCloseTo(rect.xRight);
        jest.expect(qRect.yTop).toBeCloseTo(rect.yTop);
        jest.expect(qRect.yBot).toBeCloseTo(rect.yBot);
    }
}