(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};
import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_expression';

test('Check expression', async () => {
    let json: any = {
        elements: [
            {
                type: 'expression',
                name: 'expque',
                titleLocation: 'hidden',
                expression: '1'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'expression'
    });
});
test('Check expression with display format', async () => {
    let json: any = {
        elements: [
            { type: 'expression', titleLocation: 'hidden', name: 'exp', expression: '0.05', displayStyle: 'percent' },
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'expression_display_format'
    });
});