import { DocController } from '../src/doc_controller';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { ContainerBrick, InseparableBrick, InseparableBrickMode } from '../src/pdf_render/pdf_container';
import { EmptyBrick } from '../src/pdf_render/pdf_empty';

test('check container bricks', async() =>{
    const controller = new DocController();
    let container = new ContainerBrick(controller, { xLeft: 0, yTop: 0, width: 10 }, { paddingBottom: 0, paddingLeft: 0, paddingRight: 0, borderColor: '#000', borderWidth: 0, borderOutside: false, paddingTop: 0, backgroundColor: '#fff' });
    container.startSetup();
    const firstBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 0, xRight: 10, yBot: 10 });
    const secondBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 10, xRight: 10, yBot: 20 });
    container.addBrick(firstBrick);
    container.addBrick(secondBrick);
    container.finishSetup();
    let result = container.getBricks();
    expect(result.length).toBe(2);
    expect(result[0]).toBeInstanceOf(InseparableBrick);
    expect(result[0]['bricks'][1]).toBe(firstBrick);
    expect(result[1]).toBeInstanceOf(InseparableBrick);
    expect(result[1]['bricks'][0]).toBe(secondBrick);

    container = new ContainerBrick(controller, { xLeft: 0, yTop: 0, width: 10 }, { paddingBottom: 0, paddingLeft: 0, paddingRight: 0, borderColor: '#000', borderWidth: 0, borderOutside: false, paddingTop: 0, backgroundColor: '#fff' });
    container.startSetup();
    const brick = new EmptyBrick(controller, { xLeft: 0, yTop: 0, xRight: 10, yBot: 10 });
    container.addBrick(brick);
    container.finishSetup();
    result = container.getBricks();
    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(InseparableBrick);
    expect(result[0]['bricks'].length).toBe(3);
    expect(result[0]['bricks'][1]).toBe(brick);
});

test('check InseparableBrick', async() => {
    const controller = new DocController();
    const firstBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 0, xRight: 10, yBot: 10 });
    const secondBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 10, xRight: 10, yBot: 20 });
    const thirdBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 20, xRight: 10, yBot: 30 });
    const forthBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 30, xRight: 10, yBot: 40 });
    let inseparableBrick = new InseparableBrick(InseparableBrickMode.FIRST, firstBrick, secondBrick, thirdBrick);
    let unfoldedBricks = inseparableBrick.unfold();
    expect(unfoldedBricks.length).toBe(2);
    expect(unfoldedBricks[0]['bricks'][0]).toBe(firstBrick);
    expect(unfoldedBricks[0]['bricks'][1]).toBe(secondBrick);
    expect(unfoldedBricks[1]).toBe(thirdBrick);

    inseparableBrick = new InseparableBrick(InseparableBrickMode.LAST, firstBrick, secondBrick, thirdBrick);
    unfoldedBricks = inseparableBrick.unfold();
    expect(unfoldedBricks.length).toBe(2);
    expect(unfoldedBricks[0]).toBe(firstBrick);
    expect(unfoldedBricks[1]['bricks'][0]).toBe(secondBrick);
    expect(unfoldedBricks[1]['bricks'][1]).toBe(thirdBrick);

    inseparableBrick = new InseparableBrick(InseparableBrickMode.BOTH, firstBrick, secondBrick, thirdBrick, forthBrick);
    unfoldedBricks = inseparableBrick.unfold();
    expect(unfoldedBricks.length).toBe(2);
    expect(unfoldedBricks[0]['bricks'][0]).toBe(firstBrick);
    expect(unfoldedBricks[0]['bricks'][1]).toBe(secondBrick);
    expect(unfoldedBricks[1]['bricks'][0]).toBe(thirdBrick);
    expect(unfoldedBricks[1]['bricks'][1]).toBe(forthBrick);
});

test('check InseparableBrick with CompositeBrick', async() =>{
    const controller = new DocController();
    const firstBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 0, xRight: 10, yBot: 10 });
    const secondBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 10, xRight: 10, yBot: 20 });
    const thirdBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 20, xRight: 10, yBot: 30 });
    const forthBrick = new EmptyBrick(controller, { xLeft: 0, yTop: 30, xRight: 10, yBot: 40 });

    let inseparableBrick = new InseparableBrick(InseparableBrickMode.FIRST, firstBrick, new CompositeBrick(secondBrick, thirdBrick));
    let unfoldedBricks = inseparableBrick.unfold();
    expect(unfoldedBricks.length).toBe(2);
    expect(unfoldedBricks[0]['bricks'][0]).toBe(firstBrick);
    expect(unfoldedBricks[0]['bricks'][1]).toBe(secondBrick);
    expect(unfoldedBricks[1]).toBe(thirdBrick);

    inseparableBrick = new InseparableBrick(InseparableBrickMode.LAST, firstBrick, new CompositeBrick(secondBrick, thirdBrick));
    unfoldedBricks = inseparableBrick.unfold();
    expect(unfoldedBricks.length).toBe(2);
    expect(unfoldedBricks[0]).toBe(firstBrick);
    expect(unfoldedBricks[1]['bricks'][0]).toBe(secondBrick);
    expect(unfoldedBricks[1]['bricks'][1]).toBe(thirdBrick);

    inseparableBrick = new InseparableBrick(InseparableBrickMode.BOTH, firstBrick, new CompositeBrick(secondBrick, thirdBrick), forthBrick);
    unfoldedBricks = inseparableBrick.unfold();
    expect(unfoldedBricks.length).toBe(2);
    expect(unfoldedBricks[0]['bricks'][0]).toBe(firstBrick);
    expect(unfoldedBricks[0]['bricks'][1]).toBe(secondBrick);
    expect(unfoldedBricks[1]['bricks'][0]).toBe(thirdBrick);
    expect(unfoldedBricks[1]['bricks'][1]).toBe(forthBrick);
});