import { IQuestion, ItemValue, QuestionImagePickerModel } from 'survey-core';
import { SurveyPDF } from '../survey';
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
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionImagePickerModel>question;
    }
    private async generateFlatItem(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        const pageAvailableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        const imageFlat = await SurveyHelper.createImageFlat(point, this.question, this.controller, { link: (<any>item).imageLink, width: pageAvailableWidth, height: pageAvailableWidth / SurveyHelper.IMAGEPICKER_RATIO });
        const compositeFlat: CompositeBrick = new CompositeBrick(imageFlat);
        let buttonPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        if (this.question.showLabel) {
            let labelFlat: IPdfBrick = await SurveyHelper.createTextFlat(buttonPoint, this.question, this.controller, item.text || item.value, TextBrick);
            compositeFlat.addBrick(labelFlat);
            buttonPoint = SurveyHelper.createPoint(labelFlat);
        }
        const height: number = this.controller.unitHeight;
        const buttonRect: IRect = SurveyHelper.createRect(buttonPoint, pageAvailableWidth, height);
        if (this.question.multiSelect) {
            compositeFlat.addBrick(new CheckItemBrick(this.controller,
                buttonRect, this.question.id + 'index' + index, { readOnly: this.question.isReadOnly || !item.isEnabled, question: this.question, item: item, checked: this.question.value.indexOf(item.value) !== -1, index: index }));
        }
        else {
            compositeFlat.addBrick(this.radio.generateFlatItem(buttonRect, item, index));
        }
        return compositeFlat;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        this.radio = this.question.multiSelect ? null :
            new FlatRadiogroup(this.survey, this.question, this.controller);
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