import { DocOptions } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';

export class PagePacker {
    static pack(flats: IPdfBrick[], options: DocOptions): IPdfBrick[][] {
        flats.sort((a: IPdfBrick, b: IPdfBrick) => {
            if (a.yTop < b.yTop) return -1;
            if (a.yTop > b.yTop) return 1;
            if (a.xLeft > b.xLeft) return 1;
            if (a.xLeft < b.xLeft) return -1;
            return 0;
        });
        return [flats];
    }
}