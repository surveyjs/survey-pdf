import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { RowlineBrick } from '../pdf_render/pdf_rowline';
import { SurveyHelper } from '../helper_survey';
import { ISurveyStyle, ITextStyle } from '../style/types';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { FlatRepository } from './flat_repository';

export interface IFlatSurvey {
    generateFlats(): Promise<IPdfBrick[][]>;
}

export class FlatSurvey implements IFlatSurvey {
    private popRowlines(flats: IPdfBrick[]) {
        while (flats.length > 0 && flats[flats.length - 1] instanceof RowlineBrick) {
            flats.pop();
        }
    }
    constructor(protected survey: SurveyPDF, protected controller: DocController, protected style: ISurveyStyle) {}
    private async generateFlatTitle(
        point: IPoint): Promise<CompositeBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        if (this.survey.showTitle) {
            const style = this.style;
            if (this.survey.title) {
                const textOptions:Partial<ITextStyle> = { ...style.title };
                const surveyTitleFlat: IPdfBrick = await SurveyHelper.createTextFlat(point, this.controller, this.survey.locTitle, textOptions);
                compositeFlat.addBrick(surveyTitleFlat);
                point = SurveyHelper.createPoint(surveyTitleFlat);
            }
            if (this.survey.description) {
                if (this.survey.title) {
                    point.yTop += style.spacing.titleDescriptionGap;
                }
                compositeFlat.addBrick(await SurveyHelper.createTextFlat(
                    point, this.controller, this.survey.locDescription, { ...style.description }));
            }
        }
        return compositeFlat;
    }
    private async generateFlatLogoImage(point: IPoint): Promise<IPdfBrick> {
        const logoUrl = SurveyHelper.getLocString(this.survey.locLogo);
        const logoSize = await SurveyHelper.getCorrectedImageSize(this.controller, { imageLink: logoUrl, imageHeight: this.survey.logoHeight, imageWidth: this.survey.logoWidth, defaultImageWidth: '300px', defaultImageHeight: '200px' });
        const logoFlat: IPdfBrick = await SurveyHelper.createImageFlat(
            point, null, this.controller, { link: logoUrl,
                width: logoSize.width, height: logoSize.height });
        let shift: number = 0;
        if (this.survey.logoPosition === 'right') {
            shift = SurveyHelper.getPageAvailableWidth(this.controller) - logoFlat.width;
        }
        else if (this.survey.logoPosition !== 'left') {
            shift = SurveyHelper.getPageAvailableWidth(this.controller) / 2.0 - logoFlat.width / 2.0;
        }
        logoFlat.xLeft += shift;
        logoFlat.xRight += shift;
        return logoFlat;
    }
    public async generateFlats(): Promise<IPdfBrick[][]> {
        const flats: IPdfBrick[][] = [];
        const header = new ContainerBrick(this.controller, { ...this.controller.leftTopPoint, width: SurveyHelper.getPageAvailableWidth(this.controller) }, this.style.header);
        await header.setup(async (point, bricks) => {
            if (!this.survey.hasLogo) {
                const titleFlat: CompositeBrick = await this.generateFlatTitle(point);
                if (!titleFlat.isEmpty) bricks.push(titleFlat);
            }
            else if (this.survey.isLogoBefore) {
                const logoFlat: IPdfBrick = await this.generateFlatLogoImage(point);
                bricks.push(logoFlat);
                const titlePoint: IPoint = SurveyHelper.createPoint(logoFlat,
                    this.survey.logoPosition === 'top', this.survey.logoPosition !== 'top');
                if (this.survey.logoPosition !== 'top') {
                    this.controller.pushMargins();
                    titlePoint.xLeft += this.controller.unitWidth;
                    this.controller.margins.left += logoFlat.width + this.controller.unitWidth;
                }
                else {
                    titlePoint.xLeft = point.xLeft;
                    titlePoint.yTop += this.controller.unitHeight / 2.0;
                }
                const titleFlat: CompositeBrick = await this.generateFlatTitle(titlePoint);
                if (this.survey.logoPosition !== 'top') this.controller.popMargins();
                if (!titleFlat.isEmpty) bricks.push(titleFlat);
            }
            else {
                if (this.survey.logoPosition === 'right') {
                    const logoFlat: IPdfBrick = await this.generateFlatLogoImage(point);
                    bricks.push(logoFlat);
                    this.controller.pushMargins();
                    this.controller.margins.right += logoFlat.width + this.controller.unitWidth;
                    const titleFlat: CompositeBrick = await this.generateFlatTitle(point);
                    if (!titleFlat.isEmpty) bricks.unshift(titleFlat);
                    this.controller.popMargins();
                }
                else {
                    const titleFlat: CompositeBrick = await this.generateFlatTitle(point);
                    let logoPoint: IPoint = point;
                    if (!titleFlat.isEmpty) {
                        bricks.push(titleFlat);
                        logoPoint = SurveyHelper.createPoint(titleFlat);
                        logoPoint.yTop += this.controller.unitHeight / 2.0;
                    }
                    const logoFlat: IPdfBrick = await this.generateFlatLogoImage(logoPoint);
                    if (bricks.length !== 0) bricks.push(logoFlat);
                    else bricks.push(logoFlat);
                }
            }
        });
        if(!header.isEmpty) {
            flats.push(header.getBricks());
        }
        let point: IPoint = this.controller.leftTopPoint;
        if (flats.length !== 0) {
            point.yTop = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats[0])).yTop;
            flats[0].push(SurveyHelper.createRowlineFlat(point, this.controller));
            point.yTop += this.style.spacing.headerContentGap + SurveyHelper.EPSILON;
        }
        for (let i: number = 0; i < this.survey.visiblePages.length; i++) {
            this.survey.currentPage = this.survey.visiblePages[i];
            let pageFlats: IPdfBrick[] = await SurveyHelper.generatePageFlats(this.survey, this.controller, this.survey.currentPage, point);
            if (i === 0 && flats.length !== 0) {
                flats[0].push(...pageFlats);
            }
            else flats.push(pageFlats);
            this.popRowlines(flats[flats.length - 1]);
            point.yTop = this.controller.leftTopPoint.yTop;
        }
        return flats;
    }
}
FlatRepository.registerSurvey(FlatSurvey);