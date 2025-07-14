import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { RowlineBrick } from '../pdf_render/pdf_rowline';
import { SurveyHelper } from '../helper_survey';
import { ITextOptions } from '../pdf_render/pdf_text';

export class FlatSurvey {
    public static DESC_GAP_SCALE= 0.25;
    public static PANEL_CONT_GAP_SCALE = 1.0;
    private static popRowlines(flats: IPdfBrick[]) {
        while (flats.length > 0 && flats[flats.length - 1] instanceof RowlineBrick) {
            flats.pop();
        }
    }
    private static async generateFlatTitle(survey: SurveyPDF, controller: DocController,
        point: IPoint): Promise<CompositeBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        if (survey.showTitle) {
            if (survey.title) {
                const styles = survey.styles;
                const textOptions:Partial<ITextOptions> = {
                    fontSize: SurveyHelper.getScaledFontSize(controller, styles.titleFontSizeScale),
                    fontStyle: styles.titleFontStyle,
                    fontColor: styles.titleFontColor
                };
                const surveyTitleFlat: IPdfBrick = await SurveyHelper.createTextFlat(point, null, controller, survey.locTitle, textOptions);
                compositeFlat.addBrick(surveyTitleFlat);
                point = SurveyHelper.createPoint(surveyTitleFlat);
            }
            if (survey.description) {
                if (survey.title) {
                    point.yTop += controller.unitWidth * FlatSurvey.DESC_GAP_SCALE;
                }
                compositeFlat.addBrick(await SurveyHelper.createTextFlat(
                    point, null, controller, survey.locDescription, { fontSize: controller.fontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE }));
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
            point.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
        }
        for (let i: number = 0; i < survey.visiblePages.length; i++) {
            survey.currentPage = survey.visiblePages[i];
            let pageFlats: IPdfBrick[] = await SurveyHelper.generatePageFlats(survey, controller, survey.currentPage, point);
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