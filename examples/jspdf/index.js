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
			titleLocation: "top",
			indent: 0
		}
	]
};

// var json = {
//   questions: [
//     {
// 		type: "radiogroup",
// 		name: "car",
// 		title: "What LONG car are you driving?",
// 		choices: [
// 			"Ford",
// 			"Vauxhall",
// 			"Volkswagen",
// 			"Nissan",
// 			"Audi",
// 			"Mercedes-Benz",
// 			"BMW",
// 			"car0",
// 			"car1",
// 			"car2",
// 			"car3",
// 			"car4",
// 			"car5",
// 			"car6",
// 			"car7",
// 			"car8",
// 			"car9",
// 			"car10",
// 			"car11",
// 			"car12",
// 			"car13",
// 			"car14",
// 			"car15",
// 			"car16",
// 			"car17",
// 			"car18",
// 			"car19",
// 			"car20",
// 			"car21",
// 			"car22",
// 			"car23",
// 			"car24",
// 			"car25",
// 			"car26",
// 			"car27",
// 			"car28",
// 			"car29"
// 		]
//     }
//   ]
// };

// json = {
// 	"pages": [
// 		{
// 		 "name": "page1",
// 		 "elements": [
// 			{
// 			 "type": "boolean",
// 			 "name": "question1",
// 			 "title": "Title",
// 			 "description": "desciption",
// 			 "defaultValue": "false",
// 			 "showTitle": true
// 			},
// 			{
// 			 "type": "boolean",
// 			 "name": "question4",
// 			 "title": "title",
// 			 "showTitle": true
// 			},
// 			{
// 			 "type": "boolean",
// 			 "name": "question3",
// 			 "title": "Title",
// 			 "defaultValue": "true"
// 			},
// 			{
// 			 "type": "boolean",
// 			 "name": "question2",
// 			 "title": "Title",
// 			 "label": "Label"
// 			}
// 		 ]
// 		}
// 	 ]
//  };

// json = {
// 	"pages": [
// 	 {
// 		"name": "page1",
// 		"elements": [
// 		 {
// 			"type": "paneldynamic",
// 			"name": "question1",
// 			"title": "Title",
// 			"description": "Description",
// 			"defaultValue": [
// 			 {},
// 			 {
// 				"question2": "def2",
// 				"question5": [
// 				 "item2"
// 				]
// 			 },
// 			 {
// 				"question2": "defpanel",
// 				"question5": [
// 				 "item1"
// 				]
// 			 }
// 			],
// 			"titleLocation": "bottom",
// 			"templateElements": [
// 			 {
// 				"type": "text",
// 				"name": "question2"
// 			 },
// 			 {
// 				"type": "checkbox",
// 				"name": "question5",
// 				"startWithNewLine": false,
// 				"choices": [
// 				 "item1",
// 				 "item2",
// 				 "item3"
// 				]
// 			 },
// 			 {
// 				"type": "boolean",
// 				"name": "question3",
// 				"label": "boolyaka"
// 			 }
// 			],
// 			"templateTitle": "TemplTit",
// 			"templateDescription": "Template desc",
// 			"allowAddPanel": false,
// 			"allowRemovePanel": false,
// 			"panelCount": 3,
// 			"defaultPanelValue": {
// 			 "question2": "defpanel",
// 			 "question5": [
// 				"item1"
// 			 ]
// 			},
// 			"confirmDelete": true
// 		 }
// 		]
// 	 }
// 	]
//  };

let options = {
	fontSize: 30,
	margins:
	{
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBot: 10
	}
};

var survey = new SurveyPDF.Survey(json, options);
survey.data = {
	car: ["Ford"],
	name: "SUPER",
	name2: "DATA",
	car2: ["A", "EEE"],
	radio: "Red FM",
	name4: "notdef"
};

survey.render();
survey.save();
