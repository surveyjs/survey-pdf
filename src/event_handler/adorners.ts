import { IQuestion, PanelModel, PageModel, Question } from 'survey-core';
import { IPoint, DocController } from '../doc_controller';
import { FlatRepository } from '../flat_layout/flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';

export class AdornersBaseOptions {
    public point: IPoint;
    public bricks: IPdfBrick[];
    public controller: DocController;
    public repository: FlatRepository;
    public module: any;

    public constructor(point: IPoint, bricks: IPdfBrick[],
        controller: DocController, repository: FlatRepository, module: any) {
        this.point = point;
        this.bricks = bricks;
        this.controller = controller;
        this.repository = repository;
        this.module = module;
    }
}
export class AdornersOptions extends AdornersBaseOptions {
    public question: Question;
    public constructor(point: IPoint, bricks: IPdfBrick[],
        question: Question, controller: DocController,
        repository: FlatRepository, module: any) {
        super(point, bricks, controller, repository, module);
        this.question = question;
    }
}
export class AdornersPanelOptions extends AdornersBaseOptions {
    public panel: PanelModel;
    public constructor(point: IPoint, bricks: IPdfBrick[],
        panel: PanelModel, controller: DocController,
        repository: FlatRepository, module: any) {
        super(point, bricks, controller, repository, module);
        this.panel = panel;
    }
}

export class AdornersPageOptions extends AdornersBaseOptions {
    public page: PageModel;
    public constructor(point: IPoint, bricks: IPdfBrick[],
        page: PageModel, controller: DocController,
        repository: FlatRepository, module: any) {
        super(point, bricks, controller, repository, module);
        this.page = page;
    }
}

