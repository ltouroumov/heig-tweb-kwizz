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

    constructor(private roomService: RoomService) {

    }

    public ngOnInit(): void {
        this.rooms = this.roomService.getAll();
    }

    public ngOnDestroy(): void {

    }

    public refresh(): void {
        console.log("Refreshing");
        this.rooms = this.roomService.getAll();
    }

    public createRoom(form: NgForm) {
        if (form.valid) {
            let room = new RoomInfo(0, form.value.name);
            this.roomService.add(room).subscribe(() => {
                this.refresh();
            });
        }
    }

    public deleteRoom(room: RoomInfo) {
        if (confirm("Are you sure?")) {
            this.roomService.remove(room).subscribe(() => {
                this.refresh();
            });
        }
    }

}
