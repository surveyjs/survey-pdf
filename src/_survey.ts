import { SurveyModel } from "survey-core";
import { PagePacker } from './page_layout/page_packer';

export class PdfSurvey extends SurveyModel {
    docController: DocController;
    constructor(jsonObject: any, options: IDocOptions) {
        super(jsonObject);
        this.docController = new DocController(options);
    }
    render() {
        flats: IFlat[] = FlatSurvey.generateFlats();
        packs: IFlat[][] = PagePacker.pack(flats, this.docController);
        //foreach packs, call render and addPage
    }
    save(fileName: string = "survey_result.pdf") {
        this.docController.doc.save(fileName);
    }
}