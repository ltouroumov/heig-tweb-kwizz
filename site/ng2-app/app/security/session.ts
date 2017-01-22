export class Session {

    static anonymous: Session = new Session('anonymous', false);

    public constructor(public username: string, public loggedIn: boolean) {

    }

    public toJson(): string {
        return JSON.stringify({
            username: this.username,
            loggedIn: this.loggedIn
        });
    }

    public static fromJson(json: string) {
        let jsonObj = JSON.parse(json);
        return new Session(jsonObj.username, jsonObj.loggedIn);
    }
}
