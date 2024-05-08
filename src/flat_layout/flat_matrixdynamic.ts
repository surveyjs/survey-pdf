import { IQuestion, Serializer } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { FlatMatrixMultiple } from './flat_matrixmultiple';

export class FlatMatrixDynamic extends FlatMatrixMultiple {
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller, false);
    }
}

Serializer.removeProperty('matrixdynamic', 'renderAs');
Serializer.addProperty('matrixdynamic', {
    name: 'renderAs',
    default: 'auto',
    visible: false,
    choices: ['auto', 'list']
});
FlatRepository.getInstance().register('matrixdynamic', FlatMatrixDynamic);