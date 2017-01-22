import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Session} from "./session";
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {Http, RequestOptionsArgs, Headers} from "@angular/http";
import {AuthRequestOptions} from "./auth-request-options";

export class IdentityLogin {
    public username: string;
    public password: string;
}

@Injectable()
export class SessionService {

    public session = new BehaviorSubject<Session>(Session.anonymous);

    public errors = new BehaviorSubject<string[]>([]);

    public constructor(private http: Http) {
        console.log("SessionService Created");
        let sessionCookie = Cookie.get('kwizz-session');
        if (sessionCookie != null) {
            this.session.next(Session.fromJson(sessionCookie));
            console.log("Session loaded");
        }

        this.session.subscribe(session => {
            Cookie.set('kwizz-session', session.toJson());
        })
    }

    public signin(identity: IdentityLogin): Observable<Session> {
        return this.http.post("/api/account/signin", identity)
            .map(resp => resp.json())
            .map(sess => {
                console.log("User", sess);
                let session = new Session(sess.userName, true);
                this.session.next(session);
                return session;
            });
    }

    public login(identity: IdentityLogin): Observable<Session> {
        return this.http.post("/api/account/login", identity)
            .map(resp => resp.json())
            .map(sess => {
                console.log("User", sess);
                let session = new Session(sess.userName, true);
                this.session.next(session);
                return session;
            });
    }

    public logout(): Observable<Session> {
        return this.http.post("/api/account/logout", {})
            .map(resp => {
                let session = Session.anonymous;
                this.session.next(session);
                return session;
            });
    }
}