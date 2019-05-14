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
},
{
	type: "checkbox",
	name: "radio",
	title: "What radio you are like?",
	titleLocation: "bottom",
	description: "Another description",
	choices: ["Radio City", "Big FM", "Red FM", "Radio Mirchi"],
	indent: 2,
	startWithNewLine: false
},
{
	name: "name",
	type: "text",
	title: "Please enter your name:",
	titleLocation: "hidden",
	description: "Hidden description",
	indent: 1,
	readOnly: true
},
{
type: 'dropdown',
name: 'Expand me',
	choices: [
		'item1',
		'item2',
		'item3'
	]
},
{
	name: "name2",
	type: "text",
	title: "Rarrararar:",
	isRequired: true,
	titleLocation: "left",
	description: "Left descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
	inputType: "password"
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
	type: "radiogroup",
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
	titleLocation: "top",
	indent: 4,
	startWithNewLine: false
},
{
	name: "name3",
	type: "text",
	title: "Rarr 1",
	titleLocation: "top",
	defaultValue: "def",
	inputType: "password",
	placeHolder: "holder"
},
{
	name: "name4",
	type: "comment",
	title: "Comment",
	isRequired: true,
	titleLocation: "top",
	defaultValue: "def2",
	placeHolder: "holder"
},
{
	name: "name5",
	type: "text",
	title: "Rarr 2:",
	titleLocation: "top",
	inputType: "password"
},
{
	name: "name6",
	type: "comment",
	title: "Comment 2",
	isRequired: true,
	titleLocation: "top",
	startWithNewLine: false
},
{
	name: "name7",
	type: "text",
	title: "Rarrararar:",
	isRequired: true,
	titleLocation: "top",
	indent: 6
},
{
	type: "rating",
	name: "ratq",
	rateValues: [
		{
			value: "item1",
			text: "Text 1"
		},
		{
			value: "item2",
			text: "TE2222222222XT"
		},
		{
			value: "item3",
			text: "T33333E333333333X3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333"
		},
		'item4',
		{
			value: "item5",
			text: "TE255555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555"
		},
		'item66.',
		'item7'
	]
},
{
	name: "name8",
	type: "text",
	title: "Rarrararar:",
	isRequired: true,
	titleLocation: "top",
	placeHolder: "holder"
},
{
	name: "name9",
	type: "text",
	title: "Rarrararar:",
	isRequired: true,
	titleLocation: "top",
	placeHolder: "holder",
	readOnly: true
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
