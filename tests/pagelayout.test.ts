(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

import { PagePacker } from '../src//page_layout/page_packer';
import { IPdfQuestion } from '../src/pdf_render/pdf_question';
import { IRect, IDocOptions, DocController } from '../src/docController';
import { TestHelper } from '../src/helper_test';

test("Test empty rect page layout", () => {
    let flats: IRect[] = [
        {
            xLeft: 0,
            xRight: 0,
            yTop: 0,
            yBot: 0
        }
    ];
    let options: IDocOptions = TestHelper.defaultOptions;
    let packs: IPdfQuestion[][] =
        PagePacker.pack(TestHelper.wrapRects(flats), new DocController(options));
    TestHelper.equalRect(this, packs[0][0], flats[0]);
});