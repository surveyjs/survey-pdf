import { IQuestion, JsonObject } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatRepository } from './flat_repository';
import { DocController } from '../doc_controller';
import { FlatMatrixMultiple } from './flat_matrixmultiple';

export class FlatMatrixDynamic extends FlatMatrixMultiple {
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller, false);
    }
}

JsonObject.metaData.addProperty('matrixdynamic', {
    name: 'renderAs',
    default: 'auto',
    choices: ['auto', 'list']
});
FlatRepository.getInstance().register('matrixdynamic', FlatMatrixDynamic);