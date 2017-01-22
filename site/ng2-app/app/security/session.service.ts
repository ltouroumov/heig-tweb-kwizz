import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Session} from "./session";
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {Http, RequestOptionsArgs, Headers} from "@angular/http";
import {AuthRequestOptions} from "./auth-request-options";

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

    public constructor(private http: Http, private requestOptions: AuthRequestOptions) {
        console.log("SessionService Created");
        let sessionCookie = Cookie.get('kwizz-session');
        if (sessionCookie != null) {
            this.sessionSubject.next(Session.fromJson(sessionCookie));
            console.log("Session loaded");
        }

        this.session.subscribe(session => {
            if (session != null) {
                Cookie.set('kwizz-session', session.toJson());
                console.log("Setting session header");
                this.requestOptions.headers.set('Authorization', 'Bearer ' + session.token);
            } else {
                console.log("Removing session header");
                this.requestOptions.headers.delete('Authorization');
            }
        })
    }

    public getHeaders(): RequestOptionsArgs {
        return {
            headers: new Headers({
                'Authorization': 'Bearer ' + this.sessionSubject.value.token
            })
        };
    }

    private authenticate(payload: LoginRequest): Promise<Session> {
        console.log("Login Request", payload);

        switch (payload.type) {
            case LoginRequestType.STUDENT:
                return Promise.resolve(new Session(
                    (<StudentLogin>payload).name,
                    null,
                    ['ROLE_USER', 'ROLE_STUDENT']
                ));
            case LoginRequestType.PROFESSOR:
                return this.http.post('/api/login/professor', payload)
                    .filter(response => response.ok)
                    .map(response => response.json())
                    .map(json =>
                        new Session(
                            json.username,
                            json.access_token,
                            json.roles
                        )
                    )
                    .toPromise();
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