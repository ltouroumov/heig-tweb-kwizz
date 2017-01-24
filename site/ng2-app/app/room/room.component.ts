import {Component, OnInit} from "@angular/core";
import {RoomService} from "./room.service";
import {Subscription, Observable, Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {RoomInfo} from "./room-info";
import {Room} from "./room";
import {Question} from "./question";
import {WebSocketService} from "../utils/web-socket.service";
import {Dispatcher} from "../utils/dispatcher";
import {SessionService} from "../security/session.service";

@Component({
    templateUrl: './room.component.html',
    styleUrls: [
        '../utils/layout.component.scss',
        './room.component.scss'
    ],
    providers: [
        WebSocketService
    ]
})
export class RoomComponent implements OnInit {

    private room: Room = null;

    private isOwner: boolean = false;

    private pending: Question[] = [];

    private socket: Subject<any>;

    private dispatcher: Dispatcher;

    constructor(private roomService: RoomService,
                private activatedRoute: ActivatedRoute,
                private socketService: WebSocketService,
                private sessionService: SessionService) {
        this.dispatcher = Dispatcher.builder()
            .when("SyncState", args => {
                this.room.info = RoomInfo.fromJson(args.room.info);
                this.updateOwner();

                this.room.questions = args.room.questions
                    .map(question => Question.fromJson(question, args.answers))
                    .sort((q1, q2) => q2.id - q1.id);
            })
            .when("SyncInfo", args => {
                this.room.info = RoomInfo.fromJson(args.info);
                this.updateOwner();
            })
            .when("NewQuestion", args => {
                console.log("New Question", args);
                let question = Question.fromJson(args);
                this.room.questions.unshift(question);
            })
            .when("UpdateQuestion", args => {
                console.log("Updating Question");
                let question = this.room.questions.find(q => q.id == args.id);
                question.update(args);
            })
            .build();
    }

    public updateOwner() {
        this.isOwner = this.room.info.owner == this.sessionService.getSession().username;
    }

    public ngOnInit(): void {
        this.activatedRoute.params.take(1).subscribe(param => {
            this.roomService.get(param['id']).subscribe(room => {
                console.log("Got Room", room);
                this.room = room;

                this.socket = this.socketService.connect(`ws://localhost:5000/connect?id=${room.info.id}`);
                this.socket.catch((err, obs) => {
                    console.log("Socket error");
                    return Observable.throw(err);
                });
                this.socket.subscribe(message => {
                    let data = JSON.parse(message.data);
                    console.log("Dispatching", data);
                    this.dispatcher.handle(data.command, data.args);
                });
            });
        });
    }

    public changeStatus(status: string) {
        console.log("Changing status to", status);
        this.socket.next({
            "Command": "ChangeStatus",
            "Args": status
        });
    }

    public commitQuestion(question: Question) {
        let value = question.forCommit();
        console.log("Committing", value);
        this.socket.next({
            "Command": "CreateQuestion",
            "Args": value
        });
        this.removeQuestion(question);
    }

    public removeQuestion(question: Question) {
        let idx = this.pending.findIndex(q => q == question);
        this.pending.splice(idx);
    }

    public createQuestion() {
        this.pending.unshift(new Question('New Question'));
    }

}