import { QuestionDropdownModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DropdownBrick } from '../pdf_render/pdf_dropdown';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatDropdown extends FlatQuestion<QuestionDropdownModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const valueBrick = !this.shouldRenderAsComment ? new DropdownBrick(this.controller, SurveyHelper.createTextFieldRect(point, this.controller), {
            fieldName: this.question.id,
            value: SurveyHelper.getDropdownQuestionValue(this.question),
            isReadOnly: this.question.isReadOnly,
            optionsCaption: this.question.optionsCaption,
            showOptionsCaption: this.question.showOptionsCaption,
            items: this.question.visibleChoices.map(item => SurveyHelper.getLocString(item.locText))
        }, {
            fontColor: this.styles.textColor,
            fontName: this.controller.fontName,
            fontSize: this.controller.fontSize,
            fontStyle: 'normal'
        }) : await SurveyHelper.createCommentFlat(point, this.question, this.controller,
            {
                fieldName: this.question.id,
                shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
                value: SurveyHelper.getDropdownQuestionValue(this.question),
                isReadOnly: this.question.isReadOnly,
                placeholder: SurveyHelper.getLocString(this.question.locPlaceholder)
            }, {
                fontName: this.controller.fontName,
                fontColor: this.styles.textColor,
                fontSize: this.controller.fontSize,
                fontStyle: 'normal'
            });
        const compositeFlat: CompositeBrick = new CompositeBrick(valueBrick);
        if (this.question.isOtherSelected) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            otherPoint.yTop += SurveyHelper.getScaledVerticalSize(this.controller, this.styles.gapBetweenRows);
            compositeFlat.addBrick(await SurveyHelper.createCommentFlat(
                otherPoint, this.question, this.controller, {
                    fieldName: this.question.id + '_comment',
                    rows: SurveyHelper.OTHER_ROWS_COUNT,
                    value: this.question.comment !== undefined && this.question.comment !== null ? this.question.comment : '',
                    shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                    isReadOnly: this.question.isReadOnly,
                    isMultiline: true,
                }, {
                    fontName: this.controller.fontName,
                    fontColor: this.styles.textColor,
                    fontSize: this.controller.fontSize,
                    fontStyle: 'normal'
                }
            ));
        }
        return [compositeFlat];
    }
}

FlatRepository.getInstance().register('dropdown', FlatDropdown);