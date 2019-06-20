import { SurveyModel, Event } from 'survey-core';
import { IDocOptions, DocController, IRect } from './doc_controller';
import { FlatSurvey } from './flat_layout/flat_survey';
import { PagePacker } from './page_layout/page_packer';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { EventHandler } from './event_handler/event_handler';
import { DrawCanvas } from './event_handler/draw_canvas';
import { SurveyHelper } from './helper_survey';

export class SurveyPDF extends SurveyModel {
    public controller: DocController;
    public constructor(jsonObject: any, options: IDocOptions) {
        super(jsonObject);
        this.controller = new DocController(options);
    }
    /**
     * The event in fired for every rendered page
     * @param sender SurveyPDF object that fires the event
     * @param canvas DrawCanvas object that you may use it to draw text and images in the page header
     */
    public onRenderHeader: Event<(sender: SurveyPDF, canvas: DrawCanvas) => any, any> =
        new Event<(sender: SurveyPDF, canvas: DrawCanvas) => any, any>();
    /**
     * The event in fired for every rendered page
     * @param sender SurveyPDF object that fires the event
     * @param canvas DrawCanvas object that you may use it to draw text and images in the page footer
     */
    public onRenderFooter: Event<(sender: SurveyPDF, canvas: DrawCanvas) => any, any> =
        new Event<(sender: SurveyPDF, canvas: DrawCanvas) => any, any>();
    public async render(): Promise<void> {
        let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(this);
        let packs: IPdfBrick[][] = PagePacker.pack(flats, this.controller);
        EventHandler.process_events(this, packs);
        for (let i: number = 0; i < packs.length; i++) {
            let pageAdded: boolean = i === 0;
            for (let j: number = 0; j < packs[i].length; j++) {
                if (!pageAdded) {
                    pageAdded = true;
                    if (packs[i][j].isAddPage()) {
                        this.controller.addPage();
                    }
                }
                // packs[i][j].unfold().forEach((rect: IPdfBrick) => {
                //     this.controller.doc.setDrawColor('green');
                //     this.controller.doc.rect(...SurveyHelper.createAcroformRect(rect));
                //     this.controller.doc.setDrawColor('black');
                // }
                // );
                await packs[i][j].render();
            }
        }
    }
    public async save(fileName: string = 'survey_result.pdf'): Promise<void> {
        await this.render();
        this.controller.doc.save(fileName);
    }
    public async raw(): Promise<void> {
        await this.render();
        return this.controller.doc.__private__.buildDocument();
    }
}