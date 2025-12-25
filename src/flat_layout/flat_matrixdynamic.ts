import { QuestionMatrixDynamicModel, Serializer } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { FlatMatrixMultiple } from './flat_matrixmultiple';
import { IQuestionMatrixDynamicStyle } from '../styles/types';

export class FlatMatrixDynamic extends FlatMatrixMultiple<QuestionMatrixDynamicModel> {
    public constructor(protected survey: SurveyPDF,
        question: QuestionMatrixDynamicModel, controller: DocController, styles: IQuestionMatrixDynamicStyle) {
        super(survey, question, controller, styles, false);
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