import { IQuestion } from 'survey-core';
import { IPoint, DocController } from '../doc_controller';
import { FlatRepository } from '../flat_layout/flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';

export class AdornersOptions {
    public point: IPoint;
    public bricks: IPdfBrick[];
    public question: IQuestion; 
    public controller: DocController;
    public repository: FlatRepository;

    public constructor(point: IPoint, bricks: IPdfBrick[],
        question: IQuestion, controller: DocController, repository: FlatRepository) {
        this.point = point;
        this.bricks = bricks;
        this.question = question;
        this.controller = controller;
        this.repository = repository;
    }
}