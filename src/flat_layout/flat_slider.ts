import { QuestionSliderModel } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { ITextFieldBrickOptions, TextFieldBrick } from '../pdf_render/pdf_textfield';
import { CompositeBrick } from '../pdf_render/pdf_composite';

export class FlatSlider extends FlatQuestion<QuestionSliderModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let currentPoint: IPoint = SurveyHelper.clone(point);

        if (this.question.sliderType === 'single') {
            const options = this.getOptionsByValue(this.question.value);
            const inputBrick: IPdfBrick = await this.generateInputBrick(currentPoint, options);
            return [inputBrick];
        }

        if (this.question.sliderType === 'range') {
            const compositeBrick: CompositeBrick = new CompositeBrick();
            for (let i = 0; i < this.question.value.length; i++) {
                const valueItem = this.question.value[i];
                const options = this.getOptionsByValue(valueItem);
                const columnInput = await this.generateColumnInput(currentPoint, options, 2, i);
                compositeBrick.addBrick(columnInput);
            }
            return [compositeBrick];
        }
    }
    private getOptionsByValue(value: string):ITextFieldBrickOptions {
        const { id, isReadOnly } = this.question;
        return {
            fieldName: id,
            inputType: 'number',
            value,
            isReadOnly,
            shouldRenderBorders: true,
        };
    }

    private async generateInputBrick(point: IPoint, options:ITextFieldBrickOptions): Promise<IPdfBrick> {
        if (!this.shouldRenderAsComment) {
            const rect1: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
            return new TextFieldBrick(this.question, this.controller, rect1, { ...options });
        }
        else {
            return await SurveyHelper.createCommentFlat(point, this.question, this.controller, { ...options });
        }
    }

    private async generateColumnInput(point: IPoint, options:ITextFieldBrickOptions, colCount: number, colNumber: number): Promise<IPdfBrick> {
        this.controller.pushMargins();
        SurveyHelper.setColumnMargins(this.controller, colCount, colNumber);
        const currentPoint = SurveyHelper.clone(point);
        currentPoint.xLeft = this.controller.margins.left;
        const inputBrick = await this.generateInputBrick(currentPoint, options);
        this.controller.popMargins();
        return inputBrick;
    }
}

FlatRepository.getInstance().register('slider', FlatSlider);