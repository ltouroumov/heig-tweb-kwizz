import {Component} from "@angular/core";
import {RoomService} from "./room.service";
import {Subscription, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {RoomInfo} from "./room-info";
import {Room} from "./room";
import {Question} from "./question";

@Component({
    templateUrl: './room.component.html',
    styleUrls: [
        '../utils/layout.component.scss',
        './room.component.scss'
    ]
})
export class RoomComponent {

    private room: Room;

    private mode = 'edit';

    constructor(private roomService: RoomService,
                private activatedRoute: ActivatedRoute) {
        activatedRoute.params.take(1).subscribe(param => {
            this.roomService.get(param['id']).take(1).subscribe(room => {
                console.log("Got Room", room);
                this.room = room;
                this.room.info.status.subscribe(status => {
                    console.log("New status", status);
                });
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