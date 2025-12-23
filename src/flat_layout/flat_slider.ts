import { QuestionSliderModel } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { ITextFieldBrickOptions } from '../pdf_render/pdf_textfield';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { EmptyBrick } from '../pdf_render/pdf_empty';
import { IQuestionSliderStyle } from '../styles/types';

export class FlatSlider extends FlatQuestion<QuestionSliderModel, IQuestionSliderStyle> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let currentPoint: IPoint = SurveyHelper.clone(point);

        if (this.question.sliderType === 'single') {
            const options = this.getOptionsByValue(this.question.value);
            const inputBrick: IPdfBrick = await this.generateInputBrick(currentPoint, options);
            return [inputBrick];
        }

        if (this.question.sliderType === 'range') {
            const compositeBrick: CompositeBrick = new CompositeBrick();
            const bricks = [];
            for (let i = 0; i < this.question.renderedValue.length; i++) {
                const valueItem = this.question.renderedValue[i];
                const options = this.getOptionsByValue(valueItem.toString());
                const currentPoint = SurveyHelper.clone(point);
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, 2, i, this.styles.spacing.gapBetweenColumns);
                currentPoint.xLeft = this.controller.margins.left;
                if(i > 0) {
                    const separatorPoint = SurveyHelper.clone(currentPoint);
                    separatorPoint.xLeft -= this.styles.spacing.gapBetweenColumns - (this.styles.spacing.gapBetweenColumns - this.styles.rangeSeparator.width) / 2;
                    bricks.push(new EmptyBrick(this.controller, { ...separatorPoint, xRight: separatorPoint.xLeft + this.styles.rangeSeparator.width, yBot: separatorPoint.yTop + this.styles.rangeSeparator.height }, this.styles.rangeSeparator));
                }
                const inputBrick = await this.generateInputBrick(currentPoint, options);
                this.controller.popMargins();
                bricks.push(inputBrick);
            }
            const mergedRect = SurveyHelper.mergeRects(...bricks);
            bricks.forEach(brick => brick.translateY((yTop, yBot) => {
                const shift = (mergedRect.yBot - mergedRect.yTop - yBot + yTop) / 2;
                return {
                    yTop: yTop + shift,
                    yBot: yBot + shift
                };
            }));
            compositeBrick.addBrick(...bricks);
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
            shouldRenderReadOnly: SurveyHelper.shouldRenderReadOnly(this.question, this.controller, isReadOnly),
            shouldRenderBorders: true,
        };
    }

    private async generateInputBrick(point: IPoint, options:ITextFieldBrickOptions): Promise<IPdfBrick> {
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, SurveyHelper.mergeObjects({}, this.styles.input, shouldRenderReadOnly ? this.styles.inputReadOnly : undefined));
        return await SurveyHelper.createCommentFlat(point, this.controller, { ...options, shouldRenderReadOnly }, appearance);
    }
}

FlatRepository.getInstance().register('slider', FlatSlider);