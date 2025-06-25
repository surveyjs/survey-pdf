import { IQuestion, QuestionSliderModel, QuestionTextModel, settings } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { ITextFieldBrickOptions, TextFieldBrick } from '../pdf_render/pdf_textfield';
import { CompositeBrick } from '../pdf_render/pdf_composite';

export class FlatSlider extends FlatQuestion {
    protected question: QuestionSliderModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionSliderModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        if (this.question.sliderType === 'single') {
            const options = this.getOptionsByValue(this.question.value);

            if (!this.shouldRenderAsComment) {
                const rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
                return [new TextFieldBrick(this.question, this.controller, rect, { ...options })];
            }
            return [await SurveyHelper.createCommentFlat(point, this.question,
                this.controller, { ...options })];
        }

        if (this.question.sliderType === 'range') {
            const options1 = this.getOptionsByValue(this.question.value[0]);
            const options2 = this.getOptionsByValue(this.question.value[1]);

            if (!this.shouldRenderAsComment) {
                const rect1: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
                const compositeBrick: CompositeBrick = new CompositeBrick(new TextFieldBrick(this.question, this.controller, rect1, { ...options1 }));
                const otherPoint: IPoint = SurveyHelper.createPoint(compositeBrick);
                otherPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
                const rect2: IRect = SurveyHelper.createTextFieldRect(otherPoint, this.controller);
                compositeBrick.addBrick(new TextFieldBrick(this.question, this.controller, rect2, { ...options2 }));
                return [compositeBrick];
            } else {
                const commentBrick1: IPdfBrick = await SurveyHelper.createCommentFlat(point, this.question,
                    this.controller, { ...options1 });
                const compositeBrick: CompositeBrick = new CompositeBrick(commentBrick1);
                const otherPoint: IPoint = SurveyHelper.createPoint(compositeBrick);
                otherPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
                const commentBrick2: IPdfBrick = await SurveyHelper.createCommentFlat(otherPoint, this.question,
                    this.controller, { ...options2 });
                compositeBrick.addBrick(commentBrick2);
                return [compositeBrick];
            }
        }
    }
    private getOptionsByValue(value: string):Omit<ITextFieldBrickOptions, 'isMultiline'> {
        const { id, isReadOnly } = this.question;
        return {
            fieldName: id,
            inputType: 'number',
            value,
            isReadOnly,
            shouldRenderBorders: true,
        };
    }
}

FlatRepository.getInstance().register('slider', FlatSlider);