import {Component, Input, OnInit, OnDestroy} from "@angular/core";
import {Question} from "./question";
import {Option} from "./option";
import {Subscription, Subject} from "rxjs";
import * as _ from "underscore";

@Component({
    selector: 'question-answer',
    templateUrl: './question-answer.component.html',
    host: { 'class': 'question row' }
})
export class QuestionAnswerComponent {

    @Input()
    private question: Question;

    @Input()
    private socket: Subject<any>;

    private answered: boolean = false;

    public selectChoice(option: Option) {
        this.socket.next({
            "Command": "AnswerQuestion",
            "Args": {
                "question": this.question.id,
                "option": option.id
            }
        });
        this.question.answered = true;
    }

    /*
    public sendOption(option: string) {
        this.socket.next({
            "Command": "AnswerQuestion",
            "Args": {
                "question": this.question.id,
                "option": option
            }
        });
        this.question.answered = true;
    }
    */

}