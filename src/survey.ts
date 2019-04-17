import { SurveyModel } from  'survey-core';
import { IDocOptions, DocController } from './docController'
import { FlatSurvey } from './flat_layout/flat_survey';
import { PagePacker } from './page_layout/page_packer';
import { IPdfQuestion } from './pdf_render/pdf_question';

export class PdfSurvey extends SurveyModel {
    controller: DocController;
    constructor(jsonObject: any, options: IDocOptions) {
        super(jsonObject);
        this.controller = new DocController(options);
    }
    render() {
        let flats: IPdfQuestion[] = FlatSurvey.generateFlats(this);
        let packs: IPdfQuestion[][] = PagePacker.pack(flats, this.docController);
        packs.forEach((page: IPdfQuestion[], index: number) => {
            page.forEach((question: IPdfQuestion) => {
                question.render();
            });
            if (index != packs.length - 1) this.docController.addPage();
        });
    }
    save(fileName: string = 'survey_result.pdf') {
        this.docController.doc.save(fileName);
    }
}