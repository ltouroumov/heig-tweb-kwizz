import {Component, Input} from "@angular/core";
import {Question} from "./question";
import {Room} from "./room";

@Component({
    selector: 'question-edit',
    templateUrl: './question-edit.component.html',
    styleUrls: ['../utils/base.component.scss'],
    host: { 'class': 'question row' }
})
export class QuestionEditComponent {

    @Input()
    private question: Question;

    @Input()
    private room: Room;

    public setType(type: string) {
        this.question.type = type;
    }

    public doPublish() {
        this.question.mode = 'view';
    }

    public doCancel() {
        this.room.delQuestion(this.question);
    }

}