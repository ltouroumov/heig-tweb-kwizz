import {Component, OnInit} from "@angular/core";
import {RoomService} from "./room.service";
import {Subscription, Observable, Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {RoomInfo} from "./room-info";
import {Room} from "./room";
import {Question} from "./question";
import {WebSocketService} from "../utils/web-socket.service";

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

    private socket: Subject<any>;

    private mode = 'edit';

    constructor(private roomService: RoomService,
                private activatedRoute: ActivatedRoute,
                private socketService: WebSocketService) {

    }

    public ngOnInit(): void {
        this.activatedRoute.params.take(1).subscribe(param => {
            this.roomService.get(param['id']).subscribe(room => {
                console.log("Got Room", room);
                this.room = room;
                this.room.info.status.subscribe(status => {
                    console.log("New status", status);
                });

                this.socket = this.socketService.connect(`ws://locahost:8080/api/rooms/${room.info.id}/connect`);
                this.socket.next({"type": "HELO"});
            });
        });


    }

    public changeStatus(status: string) {
        console.log("Changing status to", status);
        this.room.info.changeStatus(status);
    }

    public createQuestion() {
        this.room.addQuestion(new Question('New Question'));
    }

}