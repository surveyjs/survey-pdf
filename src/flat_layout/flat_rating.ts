import { ItemValue, QuestionRatingModel, LocalizableString } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { IStyles } from '../styles';
import { FlatQuestion } from './flat_question';
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';

export class FlatRating extends FlatQuestion<QuestionRatingModel> {
    private radioGroupWrap: RadioGroupWrap;
    public constructor(protected survey: SurveyPDF,
        question: QuestionRatingModel, protected controller: DocController, styles: IStyles) {
        super(survey, question, controller, styles);
    }
    protected async generateFlatHorisontalComposite(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        const itemText: LocalizableString = SurveyHelper.getRatingItemText(
            this.question, index, item.locText);
        this.controller.pushMargins();
        const halfWidth: number = this.controller.unitWidth / 2.0;
        this.controller.margins.left += halfWidth;
        this.controller.margins.right += halfWidth;
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft += halfWidth;
        const compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.
            createTextFlat(textPoint, this.controller, itemText, { fontStyle: this.styles.labelFontStyle, fontColor: this.styles.labelFontColor, fontSize: this.styles.labelFontSize, lineHeight: this.styles.labelLineHeight }));
        this.controller.popMargins();
        let textWidth: number = compositeFlat.width;
        if (textWidth < SurveyHelper.getRatingMinWidth(this.controller)) {
            compositeFlat.xLeft += (SurveyHelper.getRatingMinWidth(
                this.controller) - textWidth) / 2.0 - halfWidth;
            textWidth = SurveyHelper.getRatingMinWidth(this.controller);
        }
        else {
            textWidth += this.controller.unitWidth;
        }
        const radioPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        radioPoint.xLeft = point.xLeft;
        radioPoint.yTop += this.styles.gapBetweenItemTextVertical;
        compositeFlat.addBrick(this.generateFlatItem(SurveyHelper.createRect(
            radioPoint, textWidth, this.styles.inputHeight), item, index));
        return compositeFlat;
    }
    protected async generateFlatComposite(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const itemRect: IRect = SurveyHelper.createRect(point,
            this.styles.inputWidth, this.styles.inputHeight);
        const itemFlat: IPdfBrick = this.generateFlatItem(itemRect, item, index);
        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.styles.gapBetweenItemText;
        const itemText: LocalizableString = SurveyHelper.getRatingItemText(this.question, index, item.locText);
        itemText == null || compositeFlat.addBrick(await SurveyHelper.createTextFlat(
            textPoint, this.controller, itemText));
        return compositeFlat;
    }
    protected async generateHorisontallyItems(point: IPoint) {
        const rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        const currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.question.visibleRateValues.length; i++) {
            const itemFlat: IPdfBrick = await this.generateFlatHorisontalComposite(currPoint,
                this.question.visibleRateValues[i], i);
            rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
            const leftWidth: number = this.controller.paperWidth -
                this.controller.margins.right - itemFlat.xRight;
            if (SurveyHelper.getRatingMinWidth(this.controller) <= leftWidth + SurveyHelper.EPSILON) {
                currPoint.xLeft = itemFlat.xRight;
            }
            else {
                currPoint.xLeft = point.xLeft;
                currPoint.yTop = itemFlat.yBot;
                if (i !== this.question.visibleRateValues.length - 1) {
                    rowsFlats[rowsFlats.length - 1].addBrick(
                        SurveyHelper.createRowlineFlat(currPoint, this.controller));
                    currPoint.yTop += SurveyHelper.EPSILON;
                    rowsFlats.push(new CompositeBrick());
                }
            }
        }
        return rowsFlats;
    }
    public generateFlatItem(rect: IRect, item: ItemValue, index: number): IPdfBrick {
        if (index === 0) {
            this.radioGroupWrap = new RadioGroupWrap(this.question.id,
                this.controller, { readOnly: this.question.isReadOnly, question: this.question });
            (<any>this.question).pdfRadioGroupWrap = this.radioGroupWrap;
        }
        else if (typeof this.radioGroupWrap === 'undefined') {
            this.radioGroupWrap = (<any>this.question).pdfRadioGroupWrap;
        }
        const isChecked: boolean = this.question.isItemSelected(item);
        return new RadioItemBrick(this.controller, rect, this.radioGroupWrap, {
            index,
            checked: isChecked,
            shouldRenderReadOnly: this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
            updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, item),
        },
        {
            fontName: this.styles.inputFont,
            fontSize: this.styles.inputFontSize,
            lineHeight: this.styles.inputFontSize,
            fontColor: this.styles.inputFontColor,
            fontStyle: 'normal',
            checkMark: this.styles.inputSymbol,
            borderColor: this.styles.inputBorderColor,
            borderWidth: this.styles.inputBorderWidth,
        });
    }
    protected async generateVerticallyItems (point: IPoint): Promise<IPdfBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        for (let i: number = 0; i < this.question.visibleRateValues.length; i++) {
            const itemFlat: IPdfBrick = await this.generateFlatComposite(currPoint, this.question.visibleRateValues[i], i);
            currPoint.yTop = itemFlat.yBot + this.styles.gapBetweenRows;
            flats.push(itemFlat);
        }
        return flats;
    }

    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let isVertical: boolean = false;
        for (let i: number = 0; i < this.question.visibleRateValues.length; i++) {
            const itemText: LocalizableString = SurveyHelper.getRatingItemText(
                this.question, i, this.question.visibleRateValues[i].locText);
            if (this.controller.measureText(itemText).width > this.controller.measureText(SurveyHelper.RATING_COLUMN_WIDTH).width) {
                isVertical = true;
            }
        }
        return isVertical ? this.generateVerticallyItems(point) : this.generateHorisontallyItems(point);
    }
}

FlatRepository.getInstance().register('rating', FlatRating);