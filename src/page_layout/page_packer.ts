import { DocOptions } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';

export class PagePacker {
    static pack(flats: IPdfBrick[], options: DocOptions): IPdfBrick[][] {
        return [flats];
    }
}