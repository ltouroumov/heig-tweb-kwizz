import {BaseRequestOptions} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthRequestOptions extends BaseRequestOptions {

    constructor() {
        super();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.withCredentials = true;
    }

}