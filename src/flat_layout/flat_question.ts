import { IQuestion } from 'survey-core';

export interface IFlatQuestion {
    generateFlats(point: IPoint): IFlat[];
}

export class FlatQuestion implements IFlatQuestion {
    generateFlats(question: IQuestion, point: IPoint): IFlat[] {
    }
}