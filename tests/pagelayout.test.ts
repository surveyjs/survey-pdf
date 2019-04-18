(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

import { PagePacker } from '../src/page_layout/page_packer';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { IRect, IDocOptions, DocController } from '../src/docController';
import { TestHelper } from '../src/helper_test';

test.skip("Test empty rect page layout", () => {
    let flats: IRect[] = [
        {
            xLeft: 0,
            xRight: 0,
            yTop: 0,
            yBot: 0
        }
    ];
    let options: IDocOptions = TestHelper.defaultOptions;
    let packs: IPdfBrick[][] =
        PagePacker.pack(TestHelper.wrapRects(flats), new DocController(options));
    TestHelper.equalRect(this, packs[0][0], flats[0]);
});