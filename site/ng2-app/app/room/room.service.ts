import {Injectable} from "@angular/core";
import {RoomInfo} from "./room-info";
import {Observable} from "rxjs";
import {Room} from "./room";
import {Http} from "@angular/http";

@Injectable()
export class RoomService {

    constructor(private http: Http) {

    }

    public getAll(): Observable<RoomInfo[]> {
        return this.http.get('/api/rooms')
            .filter(response => response.ok)
            .map(response => response.json())
            .map(rooms => rooms.map(room => RoomInfo.fromJson(room)));
    }


    public getInfo(id: number): Observable<RoomInfo> {
        return this.http.get(`/api/rooms/${id}`)
            .map(response => response.json())
            .map(json => RoomInfo.fromJson(json));
    }

    public get(id: number): Observable<Room> {
        return this.getInfo(id)
            .map(info => new Room(info));
    }

    public add(room: RoomInfo): Observable<RoomInfo> {
        return this.http.post("/api/rooms", {
            name: room.name
        })
            .map(resp => resp.json())
            .map(json => RoomInfo.fromJson(json));
    }

    public update(room: RoomInfo): Observable<RoomInfo> {
        return this.http.put(`/api/rooms/${room.id}`, {
            name: room.name,
            status: room.status
        })
            .map(resp => resp.json())
            .map(json => RoomInfo.fromJson(json));
    }

    public remove(room: RoomInfo): Observable<boolean> {
        return this.http.delete(`/api/rooms/${room.id}`)
            .map(resp => resp.ok);
    }

    public join(name: string): Observable<RoomInfo> {
        return this.http.post('/api/rooms/join', { name: name })
            .map(resp => resp.json())
            .map(json => RoomInfo.fromJson(json));
    }
}
