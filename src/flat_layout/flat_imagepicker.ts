import { IQuestion, ItemValue, QuestionImagePickerModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { FlatRadiogroup } from './flat_radiogroup';
import { CheckItemBrick } from '../pdf_render/pdf_checkitem';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatImagePicker extends FlatQuestion {
    protected question: QuestionImagePickerModel;
    protected radio: FlatRadiogroup;
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionImagePickerModel>question;
    }
    private async generateFlatItem(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        let compositeFlat: CompositeBrick = new CompositeBrick(SurveyHelper.
            createImageFlat(point, this.question, this.controller, item['imageLink'],
                SurveyHelper.getPageAvailableWidth(this.controller)));
        let buttonPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        if (this.question.showLabel) {
            let labelFlat: IPdfBrick = await SurveyHelper.createTextFlat(buttonPoint,
                this.question, this.controller, item.text || item.value, TextBrick);
            compositeFlat.addBrick(labelFlat);
            buttonPoint = SurveyHelper.createPoint(labelFlat);
        }
        let height: number = this.controller.measureText().height;
        let buttonRect: IRect = SurveyHelper.createRect(buttonPoint,
            SurveyHelper.getPageAvailableWidth(this.controller), height);
        if (this.question.multiSelect) {
            compositeFlat.addBrick(new CheckItemBrick(this.question, this.controller,
                buttonRect, this.question.id + 'index' + index,
                this.question.isReadOnly || !item.isEnabled,
                this.question.value.indexOf(item.value) !== -1));
        }
        else {
            compositeFlat.addBrick(this.radio.createItemBrick(buttonRect, item, index));
        }
        return compositeFlat;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        this.radio = this.question.multiSelect ? null :
            new FlatRadiogroup(this.question, this.controller);
        let rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        let colWidth: number = SurveyHelper.getImagePickerAvailableWidth(
            this.controller) / SurveyHelper.IMAGEPICKER_COUNT;
        let cols: number = ~~(SurveyHelper.
            getPageAvailableWidth(this.controller) / colWidth) || 1;
        let count: number = this.question.visibleChoices.length;
        cols = cols <= count ? cols : count;
        let rows: number = ~~(Math.ceil(count / cols));
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < rows; i++) {
            let yBot: number = currPoint.yTop;
            this.controller.pushMargins();
            let currMarginLeft: number = this.controller.margins.left;
            for (let j: number = 0; j < cols; j++) {
                let index: number = i * cols + j;
                this.controller.margins.left = currMarginLeft;
                this.controller.margins.right = this.controller.paperWidth -
                    currMarginLeft - colWidth;
                currMarginLeft = this.controller.paperWidth -
                    this.controller.margins.right + this.controller.measureText().width;
                currPoint.xLeft = this.controller.margins.left;
                let itemFlat: IPdfBrick = await this.generateFlatItem(currPoint,
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