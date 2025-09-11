import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { RowlineBrick } from '../pdf_render/pdf_rowline';
import { SurveyHelper } from '../helper_survey';
import { ITextAppearanceOptions } from '../pdf_render/pdf_text';

export class FlatSurvey {
    private static popRowlines(flats: IPdfBrick[]) {
        while (flats.length > 0 && flats[flats.length - 1] instanceof RowlineBrick) {
            flats.pop();
        }
    }
    private static async generateFlatTitle(survey: SurveyPDF, controller: DocController,
        point: IPoint): Promise<CompositeBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        if (survey.showTitle) {
            const styles = survey.styles;
            if (survey.title) {
                const textOptions:Partial<ITextAppearanceOptions> = {
                    fontSize: styles.titleFontSize,
                    fontStyle: styles.titleFontStyle,
                    fontColor: styles.titleFontColor
                };
                const surveyTitleFlat: IPdfBrick = await SurveyHelper.createTextFlat(point, controller, survey.locTitle, textOptions);
                compositeFlat.addBrick(surveyTitleFlat);
                point = SurveyHelper.createPoint(surveyTitleFlat);
            }
            if (survey.description) {
                if (survey.title) {
                    point.yTop += styles.descriptionGap;
                }
                compositeFlat.addBrick(await SurveyHelper.createTextFlat(
                    point, controller, survey.locDescription, { fontSize: controller.fontSize * styles.descriptionFontSize }));
            }
        }
        return compositeFlat;
    }
    private static async generateFlatLogoImage(survey: SurveyPDF, controller: DocController,
        point: IPoint): Promise<IPdfBrick> {
        const logoUrl = SurveyHelper.getLocString(survey.locLogo);
        const logoSize = await SurveyHelper.getCorrectedImageSize(controller, { imageLink: logoUrl, imageHeight: survey.logoHeight, imageWidth: survey.logoWidth, defaultImageWidth: '300px', defaultImageHeight: '200px' });
        const logoFlat: IPdfBrick = await SurveyHelper.createImageFlat(
            point, null, controller, { link: logoUrl,
                width: logoSize.width, height: logoSize.height });
        let shift: number = 0;
        if (survey.logoPosition === 'right') {
            shift = SurveyHelper.getPageAvailableWidth(controller) - logoFlat.width;
        }
        else if (survey.logoPosition !== 'left') {
            shift = SurveyHelper.getPageAvailableWidth(controller) / 2.0 - logoFlat.width / 2.0;
        }
        logoFlat.xLeft += shift;
        logoFlat.xRight += shift;
        return logoFlat;
    }
    public static async generateFlats(survey: SurveyPDF, controller: DocController): Promise<IPdfBrick[][]> {
        const flats: IPdfBrick[][] = [];
        if (!survey.hasLogo) {
            const titleFlat: CompositeBrick = await this.generateFlatTitle(
                survey, controller, controller.leftTopPoint);
            if (!titleFlat.isEmpty) flats.push([titleFlat]);
        }
        else if (survey.isLogoBefore) {
            const logoFlat: IPdfBrick = await this.generateFlatLogoImage(
                survey, controller, controller.leftTopPoint);
            flats.push([logoFlat]);
            const titlePoint: IPoint = SurveyHelper.createPoint(logoFlat,
                survey.logoPosition === 'top', survey.logoPosition !== 'top');
            if (survey.logoPosition !== 'top') {
                controller.pushMargins();
                titlePoint.xLeft += controller.unitWidth;
                controller.margins.left += logoFlat.width + controller.unitWidth;
            }
            else {
                titlePoint.xLeft = controller.leftTopPoint.xLeft;
                titlePoint.yTop += controller.unitHeight / 2.0;
            }
            const titleFlat: CompositeBrick = await this.generateFlatTitle(
                survey, controller, titlePoint);
            if (survey.logoPosition !== 'top') controller.popMargins();
            if (!titleFlat.isEmpty) flats[0].push(titleFlat);
        }
        else {
            if (survey.logoPosition === 'right') {
                const logoFlat: IPdfBrick = await this.generateFlatLogoImage(
                    survey, controller, controller.leftTopPoint);
                flats.push([logoFlat]);
                controller.pushMargins();
                controller.margins.right += logoFlat.width + controller.unitWidth;
                const titleFlat: CompositeBrick = await this.generateFlatTitle(
                    survey, controller, controller.leftTopPoint);
                if (!titleFlat.isEmpty) flats[0].unshift(titleFlat);
                controller.popMargins();
            }
            else {
                const titleFlat: CompositeBrick = await this.generateFlatTitle(
                    survey, controller, controller.leftTopPoint);
                let logoPoint: IPoint = controller.leftTopPoint;
                if (!titleFlat.isEmpty) {
                    flats.push([titleFlat]);
                    logoPoint = SurveyHelper.createPoint(titleFlat);
                    logoPoint.yTop += controller.unitHeight / 2.0;
                }
                const logoFlat: IPdfBrick = await this.generateFlatLogoImage(
                    survey, controller, logoPoint);
                if (flats.length !== 0) flats[0].push(logoFlat);
                else flats.push([logoFlat]);
            }
        }
        let point: IPoint = controller.leftTopPoint;
        if (flats.length !== 0) {
            point.yTop = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats[0])).yTop;
            flats[0].push(SurveyHelper.createRowlineFlat(point, controller));
            const styles = survey.styles;
            point.yTop += styles.contentGap + SurveyHelper.EPSILON;
        }
        for (let i: number = 0; i < survey.visiblePages.length; i++) {
            survey.currentPage = survey.visiblePages[i];
            let pageFlats: IPdfBrick[] = await SurveyHelper.generatePageFlats(survey, controller, survey.currentPage, point, survey.getStylesForElement(survey.currentPage));
            if (i === 0 && flats.length !== 0) {
                flats[0].push(...pageFlats);
            }
            else flats.push(pageFlats);
            this.popRowlines(flats[flats.length - 1]);
            point.yTop = controller.leftTopPoint.yTop;
        }
        return flats;
    }
}