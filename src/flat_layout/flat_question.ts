import { IPoint, DocController } from "../docController";
import { IQuestion } from 'survey-core';
import { IPdfQuestion } from '../pdf_render/pdf_question'

export interface IFlatQuestion {
    generateFlats(point: IPoint): IPdfQuestion[];
}

export class FlatQuestion implements IFlatQuestion {
    constructor(
        protected question: IQuestion,
        protected controller: DocController
    ) {}
    generateFlats(point: IPoint): IPdfQuestion[] {
        return null;
    }
    getQuestion<T extends IQuestion>(): T {
        return <T>this.question;
    }
}