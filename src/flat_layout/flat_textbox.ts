import { FlatQuestion } from './flat_question';
import { IPoint, DocController } from "../docController";
import { IPdfQuestion } from '../pdf_render/pdf_question'
import { FlatRepository } from './flat_repository';

export class FlatTextbox extends FlatQuestion {
    generateFlats(point: IPoint): IPdfQuestion[] {
        return null;
    }
}

FlatRepository.getInstance().register("text", FlatTextbox);