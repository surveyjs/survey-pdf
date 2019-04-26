(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { IRect } from '../src/doc_controller';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { TestHelper } from '../src/helper_test';

test('Check composite shift', () => {
	let flats: IRect[] = [
        { xLeft: 10, xRight: 50, yTop: 10, yBot: 20 },
        { xLeft: 10, xRight: 20, yTop: 20, yBot: 30 },
        { xLeft: 20, xRight: 50, yTop: 20, yBot: 30 }
    ];
    let composite: CompositeBrick = new CompositeBrick(...TestHelper.wrapRects(flats));
    composite.yTop = 80;
    composite.yBot = 100;
    let unfoldFlats: IPdfBrick[] = composite.unfold();
    TestHelper.equalRect(expect, unfoldFlats[0],
        { xLeft: 10, xRight: 50, yTop: 80, yBot: 90 });
    TestHelper.equalRect(expect, unfoldFlats[1],
        { xLeft: 10, xRight: 20, yTop: 90, yBot: 100 });
    TestHelper.equalRect(expect, unfoldFlats[2],
        { xLeft: 20, xRight: 50, yTop: 90, yBot: 100 });
});