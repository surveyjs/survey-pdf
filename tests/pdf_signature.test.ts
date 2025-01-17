import { checkPDFSnapshot } from './snapshot_helper';
import { FlatSignaturePad } from '../src/flat_layout/flat_signaturepad';

var json = {
    showQuestionNumbers: 'on',
    elements: [
        {
            type: 'signaturepad',
            name: 'q1',
        }
    ]
};

test('Check signature with dashed border', async () => {
    await checkPDFSnapshot(json, {
        snapshotName: 'signature_border_dashed',
    });
});

test('Check signature with solid border', async () => {
    FlatSignaturePad.BORDER_STYLE = 'solid';
    await checkPDFSnapshot(json, {
        snapshotName: 'signature_border_solid',
    });
    FlatSignaturePad.BORDER_STYLE = 'none';
});

test('Check signature without border', async () => {
    FlatSignaturePad.BORDER_STYLE = 'none';
    await checkPDFSnapshot(json, {
        snapshotName: 'signature_border_none',
    });
    FlatSignaturePad.BORDER_STYLE = 'dashed';
});