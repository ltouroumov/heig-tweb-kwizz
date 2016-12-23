import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Session} from "./session";

export enum LoginRequestType {
    STUDENT, PROFESSOR
}

export abstract class LoginRequest {
    public abstract type: LoginRequestType
}

export class StudentLogin extends LoginRequest{
    public type: LoginRequestType = LoginRequestType.STUDENT;

    public name: string;
    public room: string;
}

export class ProfessorLogin extends LoginRequest{
    public type: LoginRequestType = LoginRequestType.PROFESSOR;

    public username: string;
    public password: string;
}

@Injectable()
export class SessionService {

    public sessionSubject = new BehaviorSubject<Session>(null);

    public session = this.sessionSubject.asObservable();

    public constructor() {
        console.log("SessionService Created");
    }

    private authenticate(payload: LoginRequest): Promise<Session> {
        console.log("Login Request", payload);

        switch (payload.type) {
            case LoginRequestType.STUDENT:
                return Promise.resolve(new Session(
                    (<StudentLogin>payload).name,
                    ['ROLE_USER', 'ROLE_STUDENT']
                ));
            case LoginRequestType.PROFESSOR:
                return Promise.resolve(new Session(
                    (<ProfessorLogin>payload).username,
                    ['ROLE_USER', 'ROLE_PROF']
                ));
            default:
                return Promise.resolve(Session.anonymous);
        }
    }

    public login(request: LoginRequest): Promise<Session> {
        return this.authenticate(request).then(session => {
            this.sessionSubject.next(session);
            return session;
        });
    }

    public logout() {
        this.sessionSubject.next(null);
    }
}