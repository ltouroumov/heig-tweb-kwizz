import {Component, OnInit, OnDestroy} from "@angular/core";
import {RoomService} from "../room/room.service";
import {RoomInfo} from "../room/room-info";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../utils/layout.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    private lastId: number = 1;

    rooms: Observable<RoomInfo[]>;

    constructor(private roomsService: RoomService) {

    }

    public ngOnInit(): void {
        this.rooms = this.roomsService.rooms;
    }

    public ngOnDestroy(): void {
    }

    public createRoom(form: NgForm) {
        if (form.valid) {
            let room = new RoomInfo(++this.lastId, form.value.name);
            this.roomsService.add(room);
        }
    }

    public deleteRoom(room: RoomInfo) {
        if (confirm("Are you sure?")) {
            this.roomsService.del(room);
        }
    }

}
