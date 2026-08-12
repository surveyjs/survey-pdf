import { test } from 'vitest';
import { checkPDFSnapshot } from './snapshot_helper';
import { DocController } from '../src/doc_controller';
import { fonts } from './custom_fonts';
import '../src/entries/pdf-base';

test('Check signature with solid border', async () => {
    DocController.addFont('Roboto', fonts.thin, 'normal');
    DocController.addFont('Roboto', fonts.medium, 'bold');
    DocController.addFont('Roboto', fonts.lightitalic, 'italic');
    DocController.addFont('Roboto', fonts.bolditalic, 'bolditalic');
    await checkPDFSnapshot({
        elements: [
            {
                'name': 'test',
                'type': 'text',
                'title': 'Test',
                'defaultValue': 'Test value'
            }]
    }, {
        controllerOptions: {
            fontName: 'Roboto',
        },
        snapshotName: 'textfield_custom_font',
    });
});