var json = {
  questions: [
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      description: "Description",
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
      titleLocation: "bottom",
      description: "Another description",
      choices: ["Radio City", "Big FM", "Red FM", "Radio Mirchi"]
    },
    {
      name: "name",
      type: "text",
      title: "Please enter your name:",
      titleLocation: "hidden",
      description: "Hidden description",
    },
    {
      name: "name2",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "left",
      description: "Left description",
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
      titleLocation: "top",
      defaultValue: "def"
    },
    {
      name: "name4",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "top",
      defaultValue: "def2"
    },
    {
      name: "name5",
      type: "text",
      title: "Rarrararar:",
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
  radio: "Red FM",
  name4: "notdef"
};
// debugger

survey.render(
  {
    fontSize: 30, xScale: 0.22, yScale: 0.36,
    margins: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBot: 10 }
  });
survey.save();