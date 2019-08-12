import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';

export class AdornersOptions {
    public point: IPoint;
    public bricks: IPdfBrick;
    public controller: DocController;
}