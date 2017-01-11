import {Injectable} from "@angular/core";
import {RoomInfo} from "./room-info";
import {Observable, BehaviorSubject} from "rxjs";
import {Room} from "./room";

@Injectable()
export class RoomService {

    private rooms$ = new BehaviorSubject<RoomInfo[]>([
        new RoomInfo(1, 'Test Room')
    ]);

    public rooms: Observable<RoomInfo[]> = this.rooms$.asObservable();

    constructor() {
        this.rooms.subscribe(newRooms => {
            console.log("New Rooms", newRooms);
        });
    }

    public get(id: number): Observable<Room> {
        let info = this.getInfo(id);
        return new Observable<Room>(subscriber => {
            subscriber.next(new Room(info));
        });
    }

    public getInfo(id: number): RoomInfo {
        return this.rooms$.value.find(room => room.id == id);
    }

    public add(room: RoomInfo) {
        let current = this.rooms$.value;
        current.push(room);
        this.rooms$.next(current);
    }

    public del(room: RoomInfo) {
        let current = this.rooms$.value;
        let updated = current.filter(rm => rm.id != room.id);
        this.rooms$.next(updated);
    }

}
