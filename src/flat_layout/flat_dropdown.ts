import { QuestionDropdownModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DropdownBrick } from '../pdf_render/pdf_dropdown';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatDropdown extends FlatQuestion<QuestionDropdownModel> {
    protected async generateItemComment(point: IPoint): Promise<IPdfBrick> {
        const commentModel = this.question.getCommentTextAreaModel(this.question.selectedItem);
        return await SurveyHelper.createCommentFlat(
            point, this.question, this.controller, {
                fieldName: commentModel.id,
                rows: SurveyHelper.OTHER_ROWS_COUNT,
                value: commentModel.getTextValue(),
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
            },
            {
                fontName: this.controller.fontName,
                fontColor: this.styles.commentFontColor,
                fontSize: SurveyHelper.getScaledSize(this.controller, this.styles.commentFontSizeScale),
                lineHeight: SurveyHelper.getScaledSize(this.controller, this.styles.commentLineHeightScale),
                fontStyle: 'normal',
                borderColor: this.styles.commentBorderColor,
                borderWidth: SurveyHelper.getScaledSize(this.controller, this.styles.commentBorderWidthScale),
            }
        );
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const appearance = {
            fontColor: this.styles.inputFontColor,
            fontName: this.controller.fontName,
            fontSize: SurveyHelper.getScaledSize(this.controller, this.styles.inputFontSizeScale),
            lineHeight: SurveyHelper.getScaledSize(this.controller, this.styles.inputLineHeightScale),
            fontStyle: 'normal',
            borderColor: this.styles.inputBorderColor,
            borderWidth: SurveyHelper.getScaledSize(this.controller, this.styles.inputBorderWidthScale),
        };
        const valueBrick = !this.shouldRenderAsComment ? new DropdownBrick(this.controller, SurveyHelper.createTextFieldRect(point, this.controller, 1, appearance.lineHeight), {
            fieldName: this.question.id,
            value: this.question.readOnlyText,
            isReadOnly: this.question.isReadOnly,
            optionsCaption: this.question.optionsCaption,
            showOptionsCaption: this.question.showOptionsCaption,
            items: this.question.visibleChoices.map(item => SurveyHelper.getLocString(item.locText))
        }, appearance) : await SurveyHelper.createCommentFlat(point, this.question, this.controller,
            {
                fieldName: this.question.id,
                shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
                value: this.question.readOnlyText || '',
                isReadOnly: this.question.isReadOnly,
                placeholder: SurveyHelper.getLocString(this.question.locPlaceholder)
            }, appearance);
        const compositeFlat: CompositeBrick = new CompositeBrick(valueBrick);
        if (this.question.isShowingChoiceComment) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            otherPoint.yTop += SurveyHelper.getScaledSize(this.controller, this.styles.gapBetweenRows);
            compositeFlat.addBrick(await this.generateItemComment(otherPoint));
        }
        return [compositeFlat];
    }
}

FlatRepository.getInstance().register('dropdown', FlatDropdown);