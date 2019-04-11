import * as jsPDF from "jspdf";
import addCustomFonts from "../src/customFonts";

test("add segoe font  to jsPDf", () => {
  addCustomFonts(jsPDF);
  let doc = new jsPDF();
  expect(doc.getFontList()["segoe"]).toBeDefined();
});

test("add segoe font (normal) to jsPDf", () => {
  addCustomFonts(jsPDF);
  let doc = new jsPDF();
  expect(doc.getFontList()["segoe"].includes("normal")).toBe(true);
});

test("add segoe font (bold) to jsPDf", () => {
  addCustomFonts(jsPDF);
  let doc = new jsPDF();
  expect(doc.getFontList()["segoe"].includes("bold")).toBe(true);
});
