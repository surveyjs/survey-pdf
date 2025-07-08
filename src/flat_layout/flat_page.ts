import { PageModel } from 'survey-core';
import { FlatPanel } from './flat_panel';
import { IPoint } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { AdornersPageOptions } from '../event_handler/adorners';
import { SurveyHelper } from '../helper_survey';

export class FlatPage extends FlatPanel<PageModel> {
    protected async generateTitleFlat(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createTextFlat(
            point, null, this.controller, this.panel.locTitle, {
                fontStyle: 'bold',
                fontSize: this.controller.fontSize * SurveyHelper.TITLE_PAGE_FONT_SIZE_SCALE
            });
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