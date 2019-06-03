(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { DocController } from "../src/doc_controller";
test('check font size ', () => {
    let options: any = {
        orientation: 'l',
        fontSize: 12,
        margins:
        {
            left: 10,
            right: 10,
            top: 10,
            bot: 10

        }
    };
    const controller = new DocController(options);
    expect(controller.fontSize).toBe(12);
});
test('test doc width and heght with orinetaition \'l\' and \'a4\' format', () => {
    let options: any = {
        orientation: 'l',
        fontSize: 12,
        margins:
        {
            left: 10,
            right: 10,
            top: 10,
            bot: 10

        }
    };
    const controller = new DocController(options);
    expect(controller.paperWidth).toBeCloseTo(297 * DocController.MM_TO_PT);
    expect(controller.paperHeight).toBeCloseTo(210 * DocController.MM_TO_PT);
});
test('test doc width and heght with orinetaition \'l\' and array format', () => {
    let options: any = {
        fontSize: 12,
        orientation: 'l',
        paperHeight: 210,
        paperWidth: 297,
        margins:
        {
            left: 10,
            right: 10,
            top: 10,
            bot: 10

        }
    };
    const controller = new DocController(options);
    expect(controller.paperHeight).toBeCloseTo(210 * DocController.MM_TO_PT);
    expect(controller.paperWidth).toBeCloseTo(297 * DocController.MM_TO_PT);
    expect(controller.orientation).toBe('l');
});
test('test doc width and heght change with orinetaition \'p\'', () => {
    let options: any = {
        fontSize: 12,
        paperHeight: 210,
        paperWidth: 297,
        margins:
        {
            left: 10,
            right: 10,
            top: 10,
            bot: 10

        }
    };
    const controller = new DocController(options);
    expect(controller.paperHeight).toBeCloseTo(297 * DocController.MM_TO_PT);
    expect(controller.paperWidth).toBeCloseTo(210 * DocController.MM_TO_PT);
});
test('test doc width and heght change with orinetaition \'l\'', () => {
    let options: any = {
        fontSize: 12,
        orientation: 'l',
        paperHeight: 297,
        paperWidth: 210,
        margins:
        {
            left: 10,
            right: 10,
            top: 10,
            bot: 10

        }
    };
    const controller = new DocController(options);
    expect(controller.paperHeight).toBeCloseTo(210 * DocController.MM_TO_PT);
    expect(controller.paperWidth).toBeCloseTo(297 * DocController.MM_TO_PT);
});
