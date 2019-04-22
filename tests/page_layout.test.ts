(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { PagePacker } from '../src/page_layout/page_packer';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { IRect, IDocOptions, DocController } from '../src/doc_controller';
import { TestHelper } from '../src/helper_test';

test('Pack one flat', () => {
    let flats: IRect[] = [TestHelper.defaultRect];
    let packs: IPdfBrick[][] = PagePacker.pack(TestHelper.wrapRects(flats),
        new DocController(TestHelper.defaultOptions));
    TestHelper.equalRect(expect, packs[0][0], flats[0]);
});
test.skip('Pack two flats on two pages', () => {
    let flats: IRect[] = [TestHelper.defaultRect, TestHelper.defaultRect];
    flats[1].yTop += 10; flats[1].yBot += 10;
    let options: IDocOptions = TestHelper.defaultOptions;
    options.paperHeight = flats[0].yBot;
    let packs: IPdfBrick[][] = PagePacker.pack(TestHelper.wrapRects(flats),
        new DocController(TestHelper.defaultOptions));
    TestHelper.equalRect(expect, packs[0][0], flats[0]);
    TestHelper.equalRect(expect, packs[1][0], flats[0]);
});