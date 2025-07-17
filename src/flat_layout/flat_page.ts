import { PageModel } from 'survey-core';
import { FlatPanel } from './flat_panel';
import { IPoint } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { AdornersPageOptions } from '../event_handler/adorners';
import { SurveyHelper } from '../helper_survey';
import { ITextOptions } from '../pdf_render/pdf_text';

export class FlatPage extends FlatPanel<PageModel> {
    protected async generateTitleFlat(point: IPoint): Promise<IPdfBrick> {
        const textOptions:Partial<ITextOptions> = {
            fontSize: SurveyHelper.getScaledFontSize(this.controller, this.styles.titleFontSizeScale),
            fontStyle: this.styles.titleFontStyle,
            fontColor: this.styles.titleFontColor
        };
        return await SurveyHelper.createTextFlat(
            point, null, this.controller, this.panel.locTitle, textOptions);
    }
    async generateFlats(point: IPoint): Promise<IPdfBrick[]> {
        const pageFlats: IPdfBrick[] = [];
        pageFlats.push(...await this.generateContentFlats(point));
        const adornersOptions: AdornersPageOptions = new AdornersPageOptions(point,
            pageFlats, this.panel, this.controller, FlatRepository.getInstance());
        await this.survey.onRenderPage.fire(this.survey, adornersOptions);
        return [...adornersOptions.bricks];
    }
}