import {Component, Input} from "@angular/core";
import {Question} from "./question";
import {Option} from "./option";

@Component({
    selector: 'question-edit-mc',
    templateUrl: './question-edit-mc.component.html'
})
export class QuestionEditMcComponent {

    @Input()
    private question: Question;

    private newOption: string;

    public addOption() {
        this.question.options.push(new Option(this.newOption));
        this.newOption = "";
    }

    public removeOption(option: Option) {
        this.question.options.remove(opt => opt == option);
    }

}