import {Component, Input} from "@angular/core";
import {Question} from "./question";

@Component({
    selector: 'question-view',
    templateUrl: './question-view.component.html',
    host: { 'class': 'question row' }
})
export class QuestionViewComponent {

    @Input()
    private question: Question;

}