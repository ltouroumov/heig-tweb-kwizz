import {Injectable} from "@angular/core";
import {RoomInfo} from "./room-info";
import {Observable} from "rxjs";
import {Room} from "./room";
import {Http} from "@angular/http";
import {SessionService} from "../security/session.service";

@Injectable()
export class RoomService {

    constructor(private http: Http, private session: SessionService) {

    }

    public getAll(): Observable<RoomInfo[]> {
        return this.http.get('/api/rooms', this.session.getHeaders())
            .filter(response => response.ok)
            .map(response => response.json())
            .map(rooms => rooms.map(room => RoomInfo.load(room)));
    }


    public getInfo(id: number): Observable<RoomInfo> {
        return this.http.get(`/api/rooms/${id}`, this.session.getHeaders())
            .map(response => response.json())
            .map(json => RoomInfo.load(json));
    }

    public get(id: number): Observable<Room> {
        return this.getInfo(id)
            .map(info => new Room(info));
    }

    public add(room: RoomInfo): Observable<RoomInfo> {
        return this.http.post("/api/rooms", {
            name: room.name
        }, this.session.getHeaders())
            .map(resp => resp.json())
            .map(json => RoomInfo.load(json));
    }

    public update(room: RoomInfo): Observable<RoomInfo> {
        return this.http.put(`/api/rooms/${room.id}`, {
            name: room.name,
            status: room.status$.value
        }, this.session.getHeaders())
            .map(resp => resp.json())
            .map(json => RoomInfo.load(json));
    }

    public remove(room: RoomInfo): Observable<boolean> {
        return this.http.delete(`/api/rooms/${room.id}`, this.session.getHeaders())
            .map(resp => resp.ok);
    }

}
