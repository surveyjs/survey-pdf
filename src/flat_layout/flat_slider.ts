import { QuestionSliderModel } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { IInputAppearanceOptions, SurveyHelper } from '../helper_survey';
import { ITextFieldBrickOptions, TextFieldBrick } from '../pdf_render/pdf_textfield';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { EmptyBrick } from '../pdf_render/pdf_empty';

export class FlatSlider extends FlatQuestion<QuestionSliderModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let currentPoint: IPoint = SurveyHelper.clone(point);

        if (this.question.sliderType === 'single') {
            const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, this.styles.input as IInputAppearanceOptions);
            const options = this.getOptionsByValue(this.question.value);
            const inputBrick: IPdfBrick = await this.generateInputBrick(currentPoint, options, appearance);
            return [inputBrick];
        }

        if (this.question.sliderType === 'range') {
            const appearance = SurveyHelper.getPatchedTextAppearanceOptions<IInputAppearanceOptions & { width: number }>(this.controller, SurveyHelper.mergeObjects(this.styles.input as IInputAppearanceOptions, this.styles.rangeInput));
            const compositeBrick: CompositeBrick = new CompositeBrick();
            const bricks = [];
            for (let i = 0; i < this.question.value.length; i++) {
                const valueItem = this.question.value[i];
                const options = this.getOptionsByValue(valueItem);
                const currentPoint = SurveyHelper.clone(point);
                this.controller.pushMargins();
                if(i > 0) {
                    this.controller.margins.left += appearance.width;
                    currentPoint.xLeft = this.controller.margins.left;
                    const separatorXLeft = currentPoint.xLeft + (this.styles.gapBetweenColumns - this.styles.rangeSeparator.width) / 2;
                    bricks.push(new EmptyBrick(this.controller, { yTop: currentPoint.yTop, xLeft: separatorXLeft, xRight: separatorXLeft + this.styles.rangeSeparator.width, yBot: currentPoint.yTop + this.styles.rangeSeparator.height }, this.styles.rangeSeparator));
                    this.controller.margins.left += this.styles.gapBetweenColumns;
                    currentPoint.xLeft = this.controller.margins.left;
                }
                this.controller.margins.right += SurveyHelper.getPageAvailableWidth(this.controller) - appearance.width;
                const inputBrick = await this.generateInputBrick(currentPoint, options, appearance);
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

    private async generateInputBrick(point: IPoint, options:ITextFieldBrickOptions, appearance: IInputAppearanceOptions): Promise<IPdfBrick> {
        if (!this.shouldRenderAsComment) {
            const rect1: IRect = SurveyHelper.createTextFieldRect(point, this.controller, 1, appearance.lineHeight);
            return new TextFieldBrick(this.controller, rect1, { ...options }, appearance);
        }
        else {
            return await SurveyHelper.createCommentFlat(point, this.question, this.controller, { ...options }, appearance);
        }
    }
}

FlatRepository.getInstance().register('slider', FlatSlider);