import { QuestionSelectBase, ItemValue } from "survey-core";
import { SelectBaseQuestion } from "../src/selectbase";
let questionSelectBase = new QuestionSelectBase("q1");
questionSelectBase.choices = [
  new ItemValue("Audi"),
  new ItemValue("BMW"),
  new ItemValue("Volkswagen"),
  new ItemValue("Mercedes-Benz"),
  new ItemValue("Ford")
];
let selectBase = new SelectBaseQuestion(questionSelectBase, null);
test("Test choices sort for selectbase (asc)", () => {
  questionSelectBase.choicesOrder = "asc";
  expect(selectBase.getSortedChoices()).toEqual(
    questionSelectBase.choices.slice().sort((a, b) => {
      return a.value > b.value ? 1 : -1;
    })
  );
});

test("Test choices sort for selectbase (desc)", () => {
  questionSelectBase.choicesOrder = "desc";
  expect(selectBase.getSortedChoices()).toEqual(
    questionSelectBase.choices.slice().sort((a, b) => {
      return a.value < b.value ? 1 : -1;
    })
  );
});

test("Test choices sort for selectbase (none)", () => {
  questionSelectBase.choicesOrder = "none";
  expect(selectBase.getSortedChoices()).toEqual(
    questionSelectBase.choices.slice()
  );
});
