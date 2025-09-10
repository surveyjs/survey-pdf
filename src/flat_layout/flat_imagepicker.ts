import { ItemValue, QuestionImagePickerModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CheckItemBrick } from '../pdf_render/pdf_checkitem';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';

export class FlatImagePicker extends FlatQuestion<QuestionImagePickerModel> {
    private radioGroupWrap: any;
    private async generateFlatItem(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        const pageAvailableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        const imageFlat = await SurveyHelper.createImageFlat(point, this.question, this.controller, { link: (<any>item).imageLink, width: pageAvailableWidth, height: pageAvailableWidth / SurveyHelper.IMAGEPICKER_RATIO });
        const compositeFlat: CompositeBrick = new CompositeBrick(imageFlat);
        let buttonPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        if (this.question.showLabel) {
            let labelFlat: IPdfBrick = await SurveyHelper.createTextFlat(buttonPoint, this.controller, item.text || item.value);
            compositeFlat.addBrick(labelFlat);
            buttonPoint = SurveyHelper.createPoint(labelFlat);
        }
        const height: number = this.styles.inputHeight;
        const buttonRect: IRect = SurveyHelper.createRect(buttonPoint, pageAvailableWidth, height);
        const isChecked = this.question.isItemSelected(item);
        const isReadOnly = this.question.isReadOnly || !item.isEnabled;
        const shouldRenderReadOnly = isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;

        if (this.question.multiSelect) {
            compositeFlat.addBrick(new CheckItemBrick(this.controller,
                buttonRect,
                {
                    fieldName: this.question.id + 'index' + index,
                    readOnly: isReadOnly,
                    checked: isChecked,
                    shouldRenderReadOnly: shouldRenderReadOnly,
                    updateOptions: (options) => this.survey.updateCheckItemAcroformOptions(options, this.question, item),
                },
                {
                    fontName: this.styles.checkmarkFont,
                    fontColor: this.styles.inputFontColor,
                    fontSize: this.styles.checkmarkFontSize,
                    lineHeight: this.styles.checkmarkFontSize,
                    checkMark: this.styles.checkmarkSymbol,
                    fontStyle: 'normal',
                    borderColor: this.styles.inputBorderColor,
                    borderWidth: this.styles.inputBorderWidth,
                }));
        }
        else {
            if (index === 0) {
                this.radioGroupWrap = new RadioGroupWrap(this.question.id,
                    this.controller, { readOnly: this.question.isReadOnly, question: this.question });
                (<any>this.question).pdfRadioGroupWrap = this.radioGroupWrap;
            }
            else if (typeof this.radioGroupWrap === 'undefined') {
                this.radioGroupWrap = (<any>this.question).pdfRadioGroupWrap;
            }
            return new RadioItemBrick(this.controller, buttonRect, this.radioGroupWrap, {
                index,
                checked: isChecked,
                shouldRenderReadOnly: shouldRenderReadOnly,
                updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, item),
            },
            {
                fontName: this.styles.radiomarkFont,
                fontSize: this.styles.radiomarkFontSize,
                lineHeight: this.styles.radiomarkFontSize,
                fontColor: this.styles.inputFontColor,
                fontStyle: 'normal',
                checkMark: this.styles.radiomarkSymbol,
                borderColor: this.styles.inputBorderColor,
                borderWidth: this.styles.inputBorderWidth,
            });
        }
        return compositeFlat;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        const colWidth: number = SurveyHelper.getImagePickerAvailableWidth(
            this.controller) / SurveyHelper.IMAGEPICKER_COUNT;
        let cols: number = ~~(SurveyHelper.
            getPageAvailableWidth(this.controller) / colWidth) || 1;
        const count: number = this.question.visibleChoices.length;
        cols = cols <= count ? cols : count;
        const rows: number = ~~(Math.ceil(count / cols));
        const currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < rows; i++) {
            let yBot: number = currPoint.yTop;
            this.controller.pushMargins();
            let currMarginLeft: number = this.controller.margins.left;
            for (let j: number = 0; j < cols; j++) {
                const index: number = i * cols + j;
                if (index == count) break;
                this.controller.margins.left = currMarginLeft;
                this.controller.margins.right = this.controller.paperWidth -
                    currMarginLeft - colWidth;
                currMarginLeft = this.controller.paperWidth -
                    this.controller.margins.right + this.controller.unitWidth;
                currPoint.xLeft = this.controller.margins.left;
                const itemFlat: IPdfBrick = await this.generateFlatItem(currPoint,
                    this.question.visibleChoices[index], index);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                yBot = Math.max(yBot, itemFlat.yBot);
            }
            this.controller.popMargins();
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = yBot;
            if (i !== rows - 1) {
                rowsFlats[rowsFlats.length - 1].addBrick(
                    SurveyHelper.createRowlineFlat(currPoint, this.controller));
                currPoint.yTop += SurveyHelper.EPSILON;
                rowsFlats.push(new CompositeBrick());
            }
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('imagepicker', FlatImagePicker);