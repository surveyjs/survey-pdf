import { PageModel } from 'survey-core';
import { FlatPanel, IFlatPanel } from './flat_panel';
import { IPoint } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { AdornersPageOptions } from '../event_handler/adorners';
import { SurveyHelper } from '../helper_survey';
import { IPageStyle } from '../style/types';
export interface IFlatPage extends IFlatPanel {}
export class FlatPage extends FlatPanel<PageModel, IPageStyle> implements IFlatPage {
    protected async generateTitleFlat(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createTextFlat(
            point, this.controller, this.panel.locTitle, { ...this.style.title });
    }
    async generateFlats(point: IPoint): Promise<IPdfBrick[]> {
        const pageFlats: IPdfBrick[] = [];
        pageFlats.push(...await this.generateContentFlats(point));
        const adornersOptions: AdornersPageOptions = new AdornersPageOptions(point,
            pageFlats, this.panel, this.controller, FlatRepository.getInstance());
        await this.survey.onRenderPage.fire(this.survey, adornersOptions);
        const bricks = [...adornersOptions.bricks];
        this.survey.afterRenderSurveyElement(this.panel, bricks);
        return bricks;
    }
}
FlatRepository.registerPage(FlatPage);