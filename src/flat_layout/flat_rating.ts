import { ItemValue, QuestionRatingModel, LocalizableString } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { IStyles } from '../styles';
import { FlatQuestion } from './flat_question';
import { IRadioItemBrickAppearanceOptions, RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';

interface ItemInfo { item: ItemValue, index: number, locText: LocalizableString, width: number }

export class FlatRating extends FlatQuestion<QuestionRatingModel> {
    private _radioGroupWrap: RadioGroupWrap;
    public constructor(protected survey: SurveyPDF,
        question: QuestionRatingModel, protected controller: DocController, styles: IStyles) {
        super(survey, question, controller, styles);
    }
    protected get radioGroupWrap(): RadioGroupWrap {
        if(!this._radioGroupWrap) {
            this._radioGroupWrap = new RadioGroupWrap(
                this.controller, {
                    readOnly: this.question.isReadOnly,
                    fieldName: this.question.id,
                    updateOptions: (options) => { this.survey.getUpdatedRadioGroupWrapOptions(options, this.question); }
                });
        }
        return this._radioGroupWrap;
    }
    protected getItemWidth(title: LocalizableString): number {
        return Math.min(Math.max(this.controller.measureText(title, { ...this.styles.label }).width, this.styles.itemMinWidth), SurveyHelper.getPageAvailableWidth(this.controller));
    }
    protected getItemText(index: number, locText: LocalizableString): LocalizableString {
        const ratingItemLocText: LocalizableString = new LocalizableString(locText.owner, locText.useMarkdown);
        ratingItemLocText.text = SurveyHelper.getLocString(locText);
        if (index === 0 && this.question.minRateDescription) {
            ratingItemLocText.text = this.question.locMinRateDescription.text + ' ' + SurveyHelper.getLocString(locText);
        }
        else if (index === this.question.visibleRateValues.length - 1 && this.question.maxRateDescription) {
            ratingItemLocText.text = SurveyHelper.getLocString(locText) + ' ' + this.question.locMaxRateDescription.text;
        }
        return ratingItemLocText;
    }
    private getInputAppearance(isReadOnly: boolean, isChecked: boolean): IRadioItemBrickAppearanceOptions {
        const styles = { ...this.styles.input };
        if(isReadOnly) {
            SurveyHelper.mergeObjects(styles, this.styles.inputReadOnly);
            if(isChecked) {
                SurveyHelper.mergeObjects(styles, this.styles.inputReadOnlyChecked);
            }
        }
        return styles;
    }
    public generateFlatItem(rect: IRect, item: ItemValue, index: number): IPdfBrick {
        const isChecked: boolean = this.question.isItemSelected(item);
        const shouldRenderReadOnly = this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;
        return new RadioItemBrick(this.controller, rect, this.radioGroupWrap, {
            index,
            checked: isChecked,
            shouldRenderReadOnly: shouldRenderReadOnly,
            updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, { item }),
        }, SurveyHelper.getPatchedTextAppearanceOptions(this.controller, this.getInputAppearance(shouldRenderReadOnly, isChecked)));
    }
    protected async generateItemComposite(point: IPoint, itemInfo: ItemInfo): Promise<IPdfBrick> {
        const currPoint = SurveyHelper.clone(point);
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const textBrick = await SurveyHelper.
            createTextFlat(point, this.controller, itemInfo.locText, { ...this.styles.label });
        compositeFlat.addBrick(textBrick);
        currPoint.yTop = textBrick.yBot + this.styles.gapBetweenItemText;
        compositeFlat.addBrick(this.generateFlatItem(SurveyHelper.createRect(
            currPoint, itemInfo.width, this.styles.input.height), itemInfo.item, itemInfo.index));
        compositeFlat.translateX((xLeft, xRight) => {
            const shift = (compositeFlat.width - (xRight - xLeft)) / 2;
            return { xLeft: xLeft + shift, xRight: xRight + shift };
        });
        return compositeFlat;
    }
    protected getRows(): Array<Array<ItemInfo>> {
        const res: Array<Array<ItemInfo>> = [];
        let currentRowsIndex = 0;
        let currentColumnIndex = 0;
        const availableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        let leftWidth = availableWidth;
        this.question.visibleRateValues.forEach((item, index) => {
            if(!res[currentRowsIndex]) {
                res.push([]);
            }
            const locText = this.getItemText(index, item.locText);
            const width = this.getItemWidth(locText);
            if(currentColumnIndex !== 0 && width + this.styles.gapBetweenColumns > leftWidth) {
                currentRowsIndex++;
                currentColumnIndex = 0;
                leftWidth = availableWidth;
            } else {
                leftWidth -= width + (currentColumnIndex == 0 ? 0 : this.styles.gapBetweenColumns);
                currentColumnIndex++;
                res[currentRowsIndex].push({ index, item, locText, width });
            }
        });
        return res;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const rowsFlats: CompositeBrick[] = [];
        const rows = this.getRows();
        for(const row of rows) {
            const rowFlat = new CompositeBrick();
            for(const itemInfo of row) {
                this.controller.pushMargins();
                this.controller.margins.left = currPoint.xLeft;
                this.controller.margins.right = SurveyHelper.getPageAvailableWidth(this.controller) - itemInfo.width - currPoint.xLeft;
                rowFlat.addBrick(await this.generateItemComposite(currPoint, itemInfo));
                this.controller.popMargins();
                currPoint.xLeft = rowFlat.xRight + this.styles.gapBetweenColumns;
            }
            rowFlat.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller, rowFlat.width));
            if(row !== rows[rows.length - 1]) {
                currPoint.yTop = rowFlat.yBot + this.styles.gapBetweenRows;
                currPoint.xLeft = rowFlat.xLeft;
            }
            rowsFlats.push(rowFlat);
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('rating', FlatRating);