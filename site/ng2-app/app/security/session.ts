export class Session {

    static anonymous: Session = new Session('anonymous', null, ['ROLE_ANON']);

    public constructor(public username: string, public token: string, public roles: string[]) {

    }

    public hasRoles(roles: string[]) {
        return roles.every(role => this.roles.includes(role));
    }

    public toJson(): string {
        return JSON.stringify({
            username: this.username,
            roles: this.roles
        });
    }

    public static fromJson(json: string) {
        let jsonObj = JSON.parse(json);
        return new Session(jsonObj.username, jsonObj.token, jsonObj.roles);
    }
}
