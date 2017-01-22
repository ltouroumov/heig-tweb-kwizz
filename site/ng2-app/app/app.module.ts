import {NgModule, ApplicationRef} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, RequestOptions} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app.routing';
import {AppComponent} from "./app.component";

import {LoginModule} from "./login/login.module";
import {SessionService} from "./security/session.service";
import {DropdownModule} from "ng2-bootstrap";
import {AuthGuardService} from "./security/auth-guard.service";
import {HomeComponent} from "./home/home.component";
import {RoomService} from "./room/room.service";
import {AuthRequestOptions} from "./security/auth-request-options";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        LoginModule,
        DropdownModule,
        AppRoutingModule
    ],
    declarations: [AppComponent, HomeComponent],
    providers: [
        SessionService,
        AuthRequestOptions,
        { provide: RequestOptions, useClass: AuthRequestOptions },
        RoomService,
        AuthGuardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(public appRef: ApplicationRef) {
    }
}
