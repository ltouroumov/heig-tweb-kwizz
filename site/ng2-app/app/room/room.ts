import {RoomInfo} from "./room-info";
import {BehaviorSubject} from "rxjs";
import {Question} from "./question";

export class Room {

    public questions: Question[] = [];

    constructor(public info: RoomInfo) {

    }

    public addQuestion(question: Question) {
        this.questions.push(question);
    }

    public delQuestion(question: Question) {
        let idx = this.questions.findIndex(q => q != question);
        if (idx > -1) {
            this.questions.splice(idx);
        }
    }

}