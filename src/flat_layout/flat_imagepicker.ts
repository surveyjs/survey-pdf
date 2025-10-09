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
    private _radioGroupWrap: any;
    protected get radioGroupWrap(): RadioGroupWrap {
        if(!this._radioGroupWrap) {
            this._radioGroupWrap = new RadioGroupWrap(this.question.id,
                this.controller, { readOnly: this.question.isReadOnly, question: this.question });
        }
        return this._radioGroupWrap;
    }
    private async generateFlatItem(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        const pageAvailableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        const imageFlat = await SurveyHelper.createImageFlat(point, this.question, this.controller, { link: (<any>item).imageLink, width: pageAvailableWidth, height: pageAvailableWidth / this.styles.imageRatio });
        const compositeFlat: CompositeBrick = new CompositeBrick(imageFlat);
        let buttonPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        if (this.question.showLabel) {
            let labelFlat: IPdfBrick = await SurveyHelper.createTextFlat(buttonPoint, this.controller, item.text || item.value, {
                ...this.styles.label
            });
            compositeFlat.addBrick(labelFlat);
            buttonPoint = SurveyHelper.createPoint(labelFlat);
        }
        const height: number = this.styles.inputHeight;
        const buttonRect: IRect = SurveyHelper.createRect(buttonPoint, pageAvailableWidth, height);
        const isChecked = this.question.isItemSelected(item);
        const isReadOnly = this.question.isReadOnly || !item.isEnabled;
        const shouldRenderReadOnly = isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;
        const appearance = {
            fontSize: this.styles.inputFontSize,
            lineHeight: this.styles.inputFontSize,
            fontColor: this.styles.inputFontColor,
            fontStyle: 'normal',
            borderColor: this.styles.inputBorderColor,
            borderWidth: this.styles.inputBorderWidth,
        }
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
                    ...appearance,
                    fontName: this.styles.checkmarkFont,
                    checkMark: this.styles.checkmarkSymbol,
                }));
        }
        else {
            compositeFlat.addBrick(new RadioItemBrick(this.controller, buttonRect, this.radioGroupWrap, {
                index,
                checked: isChecked,
                shouldRenderReadOnly: shouldRenderReadOnly,
                updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, item),
            },
            {
                ...appearance,
                fontName: this.styles.radiomarkFont,
                checkMark: this.styles.radiomarkSymbol,
            }));
        }
        return compositeFlat;
    }
    protected getColumnsInfo(): { columnsCount: number, columnWidth: number } {
        const { gapBetweenColumns, imageMinWidth, imageMaxWidth } = this.styles;
        const availableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        let columnsCount = this.question.colCount == 0 ? this.question.visibleChoices.length : this.question.colCount;
        let columnWidth: number;
        const getColumnWidth = () => {
            return Math.max(Math.min((availableWidth - gapBetweenColumns * (columnsCount - 1)) / columnsCount, imageMaxWidth), 1);
        };
        if(imageMinWidth * columnsCount + gapBetweenColumns * (columnsCount - 1) < availableWidth) {
            columnWidth = getColumnWidth();
        } else {
            columnsCount = Math.max(Math.ceil((availableWidth + gapBetweenColumns)/ (imageMinWidth + gapBetweenColumns)), 1);
            columnWidth = getColumnWidth();
        }
        return { columnsCount, columnWidth };
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        const { columnsCount: columnsCount, columnWidth: columnWidth } = this.getColumnsInfo();
        const rows: number = Math.ceil(this.question.visibleChoices.length / columnsCount);
        const currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < rows; i++) {
            let yBot: number = currPoint.yTop;
            this.controller.pushMargins();
            let currMarginLeft: number = this.controller.margins.left;
            for (let j: number = 0; j < columnsCount; j++) {
                const index: number = i * columnsCount + j;
                if (index == this.question.visibleChoices.length) break;
                this.controller.margins.left = currMarginLeft;
                this.controller.margins.right = this.controller.paperWidth -
                    currMarginLeft - columnWidth;
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
                currPoint.yTop += this.styles.gapBetweenRows;
                rowsFlats.push(new CompositeBrick());
            }
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('imagepicker', FlatImagePicker);