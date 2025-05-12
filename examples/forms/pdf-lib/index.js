var data = {
  "question1": "text1",
  "question2": "text2",
  "question3": "Option 2",
  "question4": "item2",
  "question5": [
      "v1",
      "v3"
  ],
  "question6": {
      "row1": {
          "column1": "a",
          "column2": [
              1
          ]
      },
      "row2": {
          "column1": "b",
          "column2": [
              2
          ]
      }
  },
  "question7": [
      {
          "question8": "b",
          "question9": "b"
      },
      {
          "question8": "a",
          "question9": "a"
      }
  ]
}

const fieldMap = {
  "question1": ["f1", "f1_plus"],
  "question2": "f2",
  "question3": "f3",
  "question4": {
    "item1": {
      field: "f4",
      value: "f4_1"
    },
    "item2": {
      field: "f4",
      value: "f4_2"
    },
  },
  "question5": {
    "v1": {
      field: "f5_1",
      value: true
    },
    "v2": {
      field: "f5_2",
      value: true
    },
    "v3": {
      field: "f5_3",
      value: true
    },
  },
  "question6": {
      "row1": {
          "column1": "f6_1_1",
          "column2": {
            "1": {
              field: "f6_1_2A",
              value: true
            },
            "2": {
              field: "6_1_2B",
              value: true
            },
          }
      },
      "row2": {
          "column1": "f6_2_1",
          "column2": {
            "1": {
              field: "f6_2_2A",
              value: true
            },
            "2": {
              field: "6_2_B",
              value: true
            },
          }
      }
  },
  "question7": [
      {
          "question8": "f7_1_1",
          "question9": {
            "a": {
              field: "f7_1_2",
              value: "A"
            },
            "b": {
              field: "f7_1_2",
              value: "B"
            },
          }
      },
      {
          "question8": "f7_2_1",
          "question9": {
            "a": {
              field: "f7_2_2",
              value: "A"
            },
            "b": {
              field: "f7_2_2",
              value: "B"
            },
          }
      }
  ]
}
const adapter = new PDFFormFiller.PDFLibAdapter(window.PDFLib);
const form = new PDFFormFiller.PDFFormFiller({data, fieldMap, pdfTemplate: template, pdfLibraryAdapter: adapter});
form.save('result.pdf');
