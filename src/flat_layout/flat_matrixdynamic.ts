import { QuestionMatrixDynamicModel, Serializer } from 'survey-core';
import { FlatMatrixMultiple } from './flat_matrixmultiple';
import { FlatRepository } from './flat_repository';

export class FlatMatrixDynamic extends FlatMatrixMultiple<QuestionMatrixDynamicModel> {}

Serializer.removeProperty('matrixdynamic', 'renderAs');
Serializer.addProperty('matrixdynamic', {
    name: 'renderAs',
    default: 'auto',
    visible: false,
    choices: ['auto', 'list']
});
FlatRepository.getInstance().register('matrixdynamic', FlatMatrixDynamic);