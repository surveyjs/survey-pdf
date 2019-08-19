import { Event } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DrawCanvas } from './draw_canvas';
import { SurveyHelper } from '../helper_survey';

export class EventAsync<T extends Function, Options> extends Event<T, Options> {
    public async fire(sender: any, options: Options) {
        if ((<any>this)['callbacks'] == null) return;
        for (var i = 0; i < (<any>this)['callbacks'].length; i++) {
           await (<any>this)['callbacks'][i](sender, options);
        }
    }
}
export class EventHandler {
    public static process_header_events(survey: SurveyPDF, controller: DocController, packs: IPdfBrick[][]): void {
        if (!survey.haveCommercialLicense) {
            survey.onRenderHeader.add((_, canvas) => {
            	canvas.drawText({
            		text: 'SurveyJS PDF | For non-commercial use only | https://surveyjs.io/Home/Licenses',
            		fontSize: 10
            	});
            });
        }
        for (let i: number = 0; i < packs.length; i++) {
            survey.onRenderHeader.fire(survey, new DrawCanvas(packs[i], controller,
                    SurveyHelper.createHeaderRect(controller), packs.length, i + 1));
            survey.onRenderFooter.fire(survey, new DrawCanvas(packs[i], controller,
                    SurveyHelper.createFooterRect(controller), packs.length, i + 1));
        }
    }
}