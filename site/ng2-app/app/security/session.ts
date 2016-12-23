export class Session {

    public constructor(public username: string, public roles: string[]) {

    }

    public hasRoles(roles: string[]) {
        return roles.every(role => this.roles.includes(role));
    }

    static anonymous: Session = new Session('anonymous', ['ROLE_ANON']);
}