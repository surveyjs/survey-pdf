import { IQuestion } from 'survey-core';
import { IPoint, IRect, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';

export class AdornersOptions {
    public point: IPoint;
    public rect: IRect;
    public bricks: IPdfBrick[];
    public question: IQuestion; 
    public controller: DocController;
}