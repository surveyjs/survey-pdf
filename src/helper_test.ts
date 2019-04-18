import { IPoint, IRect, IDocOptions } from './doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick';

export class TestHelper {
    static get defaultPoint(): IPoint {
        return {
            xLeft: 10,
            yTop: 10
        }
    }
    static get defaultRect(): IRect {
        return {
            xLeft: 10,
            xRight: 20,
            yTop: 10,
            yBot: 20
        }
    }
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
    static wrapRect(rect: IRect): IPdfBrick {
        return new PdfBrick(null, null, rect);
    }
    static wrapRects(rects: IRect[]): IPdfBrick[] {
        let pdfqs: IPdfBrick[] = new Array();
        rects.forEach((rect: IRect) => {
            pdfqs.push(TestHelper.wrapRect(rect));
        });
        return pdfqs;
    }
    static equalRect(expect: any, question: IPdfBrick | IRect, rect: IRect) {
        let qRect: IRect = typeof question === 'string' ?
            (<PdfBrick>question).rect : <IRect>question;
        expect(qRect.xLeft).toBeCloseTo(rect.xLeft);
        expect(qRect.xRight).toBeCloseTo(rect.xRight);
        expect(qRect.yTop).toBeCloseTo(rect.yTop);
        expect(qRect.yBot).toBeCloseTo(rect.yBot);
    }
}