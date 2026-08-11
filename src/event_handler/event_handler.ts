import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DrawCanvas } from './draw_canvas';
import { SurveyHelper } from '../helper_survey';
import { FlatLicense, IFlatLicenseStyle } from '../flat_layout/flat_license';
import { createStyleFromTheme } from '../style';
export class EventHandler {
    public static async process_header_events(survey: SurveyPDF,
        controller: DocController, packs: IPdfBrick[][]): Promise<void> {
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
        if (!survey.haveCommercialLicense) {
            const licenseFlats = new FlatLicense(survey, controller, style).generateFlats({ xLeft: controller.margins.left ?? 0, yTop: 5 });
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