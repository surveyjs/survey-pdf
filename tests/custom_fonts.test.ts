(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
  return {};
};

import * as jsPDF from 'jspdf';
import addCustomFonts from '../src/custom_fonts';
addCustomFonts(jsPDF);
let doc = new jsPDF();

test('add segoe font to jsPDf', () => {
  expect(doc.getFontList()['segoe']).toBeDefined();
});

test('add segoe font (normal) to jsPDf', () => {
  expect(doc.getFontList()['segoe'].includes('normal')).toBe(true);
});

test('add segoe font (bold) to jsPDf', () => {
  expect(doc.getFontList()['segoe'].includes('bold')).toBe(true);
});
