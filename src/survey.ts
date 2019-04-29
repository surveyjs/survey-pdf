import { SurveyModel } from 'survey-core';
import { IDocOptions, DocController } from './doc_controller'
import { FlatSurvey } from './flat_layout/flat_survey';
import { PagePacker } from './page_layout/page_packer';
import { IPdfBrick } from './pdf_render/pdf_brick';

export class PdfSurvey extends SurveyModel {
    controller: DocController;
    constructor(jsonObject: any, options: IDocOptions) {
        super(jsonObject);
        this.controller = new DocController(options);
    }
    render() {
        let flats: IPdfBrick[][] = FlatSurvey.generateFlats(this);
        let packs: IPdfBrick[][] = PagePacker.pack(flats, this.controller);
        packs.forEach((page: IPdfBrick[], index: number) => {
            page.forEach((brick: IPdfBrick) => brick.render());
            if (index != packs.length - 1) this.controller.addPage();
        });
    }
    save(fileName: string = 'survey_result.pdf') {
        this.controller.doc.save(fileName);
    }
}