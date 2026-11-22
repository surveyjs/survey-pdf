import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DrawCanvas } from './draw_canvas';
import { SurveyHelper } from '../helper_survey';
import { FlatLicense, IFlatLicenseStyle } from '../flat_layout/flat_license';
import { createStyleFromTheme } from '../style';
export class EventHandler {
    public static LICENSE_BANNER_TOP: number = 5;
    // Minimal vertical gap between the license banner and the document content
    public static LICENSE_BANNER_CONTENT_GAP: number = 10;
    public static createLicenseFlats(survey: SurveyPDF, controller: DocController): IPdfBrick[] {
        if (survey.haveCommercialLicense) return [];
        const style = createStyleFromTheme<IFlatLicenseStyle>(survey.theme, survey.layout, (options) => {
            return {
                text: {
                    fontSize: 10,
                    lineHeight: 12,
                    fontStyle: 'normal',
                    fontName: 'helvetica',
                    fontColor: options.getColorVariable('--sjs2-color-fg-basic-primary'),
                },
                link: {
                    fontColor: options.getColorVariable('--sjs2-color-fg-note-primary'),
                }

            };
        });
        return new FlatLicense(survey, controller, style).generateFlats({ xLeft: controller.margins.left ?? 0, yTop: EventHandler.LICENSE_BANNER_TOP });
    }
    // Generates the license banner and moves the top margin down (if required),
    // so the document content starts below the banner. Must be called before the content layout is generated.
    public static process_license(survey: SurveyPDF, controller: DocController): IPdfBrick[] {
        const licenseFlats = EventHandler.createLicenseFlats(survey, controller);
        if (licenseFlats.length > 0) {
            const bannerBot = Math.max(...licenseFlats.map(flat => flat.yBot));
            controller.margins.top = Math.max(controller.margins.top, bannerBot + EventHandler.LICENSE_BANNER_CONTENT_GAP);
        }
        return licenseFlats;
    }
    public static async process_header_events(survey: SurveyPDF,
        controller: DocController, packs: IPdfBrick[][], licenseFlats?: IPdfBrick[]): Promise<void> {
        licenseFlats = licenseFlats ?? EventHandler.createLicenseFlats(survey, controller);
        if (licenseFlats.length > 0) {
            survey.onRenderHeader.add((_, canvas) => {
                canvas.packs.push(...licenseFlats);
            });
        }
        for (let i: number = 0; i < packs.length; i++) {
            await survey.onRenderHeader.fire(survey, new DrawCanvas(packs[i], controller,
                SurveyHelper.createHeaderRect(controller), packs.length, i + 1));
            await survey.onRenderFooter.fire(survey, new DrawCanvas(packs[i], controller,
                SurveyHelper.createFooterRect(controller), packs.length, i + 1));
        }
    }
}
