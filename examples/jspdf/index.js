var json = {
  questions: [
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      choices: [
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW"
      ],
      titleLocation: "top"
    },
    {
      type: "checkbox",
      name: "radio",
      title: "What radio you are like?",
      isRequired: true,
      choices: ["Radio City", "Big FM", "Red FM", "Radio Mirchi"],
      titleLocation: "top"
    },
    {
      name: "name",
      type: "text",
      title: "Please enter your name:",
      isRequired: true
    },
    {
      name: "name2",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "left"
    },
    {
      type: "checkbox",
      name: "car2",
      title: "What car are YOU driving?",
      isRequired: true,
      choices: ["A", "B", "EEE", "UU"],
      titleLocation: "left"
    },
    {
      type: "checkbox",
      name: "car3",
      title: "What car are you driving?",
      isRequired: true,
      choices: [
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW"
      ],
      titleLocation: "top"
    },
    {
      type: "checkbox",
      name: "car4",
      title: "What LONG car are you driving?",
      isRequired: true,
      choices: [
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "car0",
        "car1",
        "car2",
        "car3",
        "car4",
        "car5",
        "car6",
        "car7",
        "car8",
        "car9",
        "car10",
        "car11",
        "car12",
        "car13",
        "car14",
        "car15",
        "car16",
        "car17",
        "car18",
        "car19",
        "car20",
        "car21",
        "car22",
        "car23",
        "car24",
        "car25",
        "car26",
        "car27",
        "car28",
        "car29"
      ],
      titleLocation: "top"
    },
    {
      name: "name3",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top"
    },
    {
      name: "name4",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top"
    },
    {
      name: "name5",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top"
    },
    {
      name: "name6",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top"
    },
    {
      name: "name7",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top"
    },
    {
      name: "name8",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top"
    },
    {
      name: "name9",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top"
    },
    {
      name: "name10",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top"
    }
  ]
};

var survey = new SurveyPDF.Survey(json);
survey.data = {
  car: ["Ford"],
  name: "SUPER",
  name2: "DATA",
  car2: ["A", "EEE"],
  radio: "Red FM"
};
// var pdfDocument = survey.render(16, 0.165, 0.36);
var pdfDocument = survey.render(30, 0.22, 0.36,
  { marginLeft: 10, marginRigth: 10, marginTop: 10, marginBot: 10 });
