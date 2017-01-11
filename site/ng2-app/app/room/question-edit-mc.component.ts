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

    public addOption(title: string) {
        this.question.options.push(new Option(title));
    }

    public removeOption(option: Option) {
        let index = this.question.options.indexOf(option);
        this.question.options.splice(index, 1);
    }

}