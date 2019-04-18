import { FlatQuestion } from './flat_question';
import { IPoint, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { FlatRepository } from './flat_repository';

export class FlatTextbox extends FlatQuestion {
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        return null;
    }
    generateFlats(point: IPoint): IPdfBrick[] {
        return null;
    }
}

FlatRepository.getInstance().register("text", FlatTextbox);