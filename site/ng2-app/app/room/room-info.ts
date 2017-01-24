export class RoomInfo {

    public status: string = 'Closed';

    public key: string = null;

    public owner: string = null;

    constructor(public id: number,
                public name: String) {

    }

    public static fromJson(json: any): RoomInfo {
        let room = new RoomInfo(json["id"], json["name"]);
        room.owner = json.owner.userName;
        room.key = json.key;
        if ("status" in json) {
            room.status = (<string>json["status"]);
        }
        return room;
    }
}