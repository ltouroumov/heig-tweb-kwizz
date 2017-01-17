import {Observable, BehaviorSubject} from "rxjs";
export class RoomInfo {

    public status$ = new BehaviorSubject<string>('closed');
    public status: Observable<string> = this.status$.asObservable();

    constructor(public id: number,
                public name: String) {

    }

    public static load(json: any): RoomInfo {
        console.log("RoomInfo", json);
        let room = new RoomInfo(json["id"], json["name"]);
        if ("status" in json) {
            room.changeStatus((<string>json["status"]).toLowerCase());
        }
        return room;
    }

    public changeStatus(status: string) {
        this.status$.next(status);
    }
}