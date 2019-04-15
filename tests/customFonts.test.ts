import * as jsPDF from "jspdf";
import addCustomFonts from "../src/customFonts";
addCustomFonts(jsPDF);
let doc = new jsPDF();
test("font mock", () => {
  expect(true).toBe(true);
});

test("add segoe font  to jsPDf", () => {
  expect(doc.getFontList()["segoe"]).toBeDefined();
});

test("add segoe font (normal) to jsPDf", () => {
  expect(doc.getFontList()["segoe"].includes("normal")).toBe(true);
});

test("add segoe font (bold) to jsPDf", () => {
  expect(doc.getFontList()["segoe"].includes("bold")).toBe(true);
});
