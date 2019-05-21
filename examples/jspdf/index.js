let json = {
	elements: [
		{
			type: 'boolean',
			name: 'Boolman',
			title: 'Ama label'
		}
	]
};
let options = {
	fontSize: 30,
	margins:
	{
		left: 10,
		right: 10,
		top: 10,
		bot: 10

	}
};

var survey = new SurveyPDF.Survey(json, options);
// survey.data = {
// 	car: ["Ford"],
// 	name: "SUPER",
// 	name2: "DATA",
// 	car2: ["A", "EEE"],
// 	radio: "Red FM",
// 	name4: "notdef"
// };
var converter = new showdown.Converter();
survey
	.onTextMarkdown
	.add(function (survey, options) {
		//convert the mardown text to html
		var str = converter.makeHtml(options.text);
		//remove root paragraphs <p></p>
		str = str.substring(3);
		str = str.substring(0, str.length - 4);
		//set html
		options.html = str;
	});
survey.save();
