import {Component, Input, EventEmitter, Output} from "@angular/core";
import {Question} from "./question";

@Component({
    selector: 'question-edit',
    templateUrl: './question-edit.component.html',
    styleUrls: ['../utils/base.component.scss'],
    host: { 'class': 'question row' }
})
export class QuestionEditComponent {

    @Input()
    private question: Question;

    @Output()
    private onCommit: EventEmitter<Question> = new EventEmitter();

    @Output()
    private onCancel: EventEmitter<Question> = new EventEmitter();

    public setType(type: string) {
        this.question.type = type;
    }

    public doPublish() {
        this.onCommit.emit(this.question);
    }

    public doCancel() {
        this.onCancel.emit(this.question);
    }

}