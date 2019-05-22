import { SurveyModel } from 'survey-core';
import { IDocOptions, DocController } from './doc_controller'
import { FlatSurvey } from './flat_layout/flat_survey';
import { PagePacker } from './page_layout/page_packer';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { SurveyHelper } from './helper_survey';

export class SurveyPDF extends SurveyModel {
    controller: DocController;
    constructor(jsonObject: any, options: IDocOptions) {
        super(jsonObject);
        this.controller = new DocController(options);
        SurveyHelper.setFontSize(options.fontSize);
    }
    async render() {
        let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(this);
        let packs: IPdfBrick[][] = PagePacker.pack(flats, this.controller);
        for (let i: number = 0; i < packs.length; i++) {
            for (let j: number = 0; j < packs[i].length; j++) {
                await packs[i][j].render();
            }
            if (i != packs.length - 1) this.controller.addPage();
        }
    }
    async save(fileName: string = 'survey_result.pdf') {
        await this.render();
        this.controller.doc.save(fileName);
    }
}