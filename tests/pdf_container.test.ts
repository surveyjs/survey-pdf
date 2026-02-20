import { DocController, IPoint } from '../src/doc_controller';
import { BorderMode, SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { PdfBrick } from '../src/pdf_render/pdf_brick';
import { ContainerBrick } from '../src/pdf_render/pdf_container';
import { EmptyBrick } from '../src/pdf_render/pdf_empty';

test('check container bricks', async() =>{
    const controller = new DocController();
    let container = new ContainerBrick(controller, { xLeft: 0, yTop: 0, width: 10 }, { padding: 0, borderColor: '#000', borderWidth: 0, borderMode: BorderMode.Inside, backgroundColor: '#fff' });
    container.startSetup();
    const firstBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 0, xRight: 10, yBot: 10 });
    const secondBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 10, xRight: 10, yBot: 20 });
    container.addBrick(firstBrick);
    container.addBrick(secondBrick);
    container.finishSetup();
    let result = container.getBricks();
    expect(result.length).toBe(2);
    container = new ContainerBrick(controller, { xLeft: 0, yTop: 0, width: 10 }, { padding: 0, borderColor: '#000', borderWidth: 0, borderMode: BorderMode.Inside, backgroundColor: '#fff' });
    container.startSetup();
    const brick = new EmptyBrick(controller, { xLeft: 0, yTop: 0, xRight: 10, yBot: 10 });
    container.addBrick(brick);
    container.finishSetup();
    result = container.getBricks();
    expect(result.length).toBe(1);
});

test('Check padding works correctly for container brick', async () => {
    const controller = new DocController();
    let container = new ContainerBrick(controller, { xLeft: 0, yTop: 0, width: 100 }, { padding: [40, 25, 30, 20], borderColor: '#000', borderWidth: 0, borderMode: BorderMode.Inside, backgroundColor: '#fff' });
    await container.setup(async (point: IPoint, bricks) => {
        bricks.push(new EmptyBrick(controller, { ...point, xRight: point.xLeft + SurveyHelper.getPageAvailableWidth(controller) / 2, yBot: point.yTop + 10 }));
        bricks.push(new EmptyBrick(controller, { xLeft: point.xLeft + SurveyHelper.getPageAvailableWidth(controller) / 2, xRight: point.xLeft + SurveyHelper.getPageAvailableWidth(controller), yTop: point.yTop, yBot: point.yTop + 10 }));
        bricks.push(new EmptyBrick(controller, { xLeft: point.xLeft, xRight: point.xLeft + SurveyHelper.getPageAvailableWidth(controller), yTop: point.yTop + 10, yBot: point.yTop + 20 }));
    });
    const bricks = container.getBricks() as Array<PdfBrick>;
    expect(bricks.length).toBe(3);
    expect(bricks[0]['padding']).toEqual({ top: 40, bottom: 0 });
    expect(bricks[1]['padding']).toEqual({ top: 40, bottom: 0 });
    expect(bricks[2]['padding']).toEqual({ top: 0, bottom: 30 });
    TestHelper.equalRect(expect, bricks[0].contentRect, { yTop: 40, xLeft: 20, yBot: 50, xRight: 47.5 });
    TestHelper.equalRect(expect, bricks[1].contentRect, { yTop: 40, xLeft: 47.5, yBot: 50, xRight: 75 });
    TestHelper.equalRect(expect, bricks[2].contentRect, { yTop: 50, xLeft: 20, yBot: 60, xRight: 75 });

    TestHelper.equalRect(expect, bricks[0], { yTop: 0, xLeft: 20, yBot: 50, xRight: 47.5 });
    TestHelper.equalRect(expect, bricks[1], { yTop: 0, xLeft: 47.5, yBot: 50, xRight: 75 });
    TestHelper.equalRect(expect, bricks[2], { yTop: 50, xLeft: 20, yBot: 90, xRight: 75 });

});