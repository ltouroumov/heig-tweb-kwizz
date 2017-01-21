import {Injectable} from "@angular/core";
import {Http, RequestOptionsArgs, Response, Headers} from "@angular/http";
import {SessionService} from "./session.service";
import {Session} from "./session";
import {Observable} from "rxjs";

@Injectable()
export class AuthHttp {

    private session: Session = null;

    constructor(private http: Http, private sessionService: SessionService) {
        this.sessionService.session.subscribe(
            session => this.session = session
        );
    }

    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.get(url, this.addAuthorization(options));
    }
    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.post(url, body, this.addAuthorization(options));
    }
    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.put(url, body, this.addAuthorization(options));
    }
    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.delete(url, this.addAuthorization(options));
    }
    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.patch(url, body, this.addAuthorization(options));
    }
    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.head(url, this.addAuthorization(options));
    }

    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.options(url, this.addAuthorization(options));
    }

    private addAuthorization(options: RequestOptionsArgs): RequestOptionsArgs {
        if (!options) {
            options = {};
        }

        if (!options.headers) {
            options.headers = new Headers();
        }

        if (this.session) {
            options.headers.append('Authorization', 'Bearer ' + this.session.token);
        }

        return options;
    }
}