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
    static equalRect(expect: any, rect1: IRect, rect2: IRect) {
        expect(rect1.xLeft).toBeCloseTo(rect2.xLeft);
        expect(rect1.xRight).toBeCloseTo(rect2.xRight);
        expect(rect1.yTop).toBeCloseTo(rect2.yTop);
        expect(rect1.yBot).toBeCloseTo(rect2.yBot);
    }
    static equalPoint(expect: any, point1: IPoint, point2: IPoint) {
        expect(point1.xLeft).toBeCloseTo(point2.xLeft);
        expect(point1.yTop).toBeCloseTo(point2.yTop);
    }
}