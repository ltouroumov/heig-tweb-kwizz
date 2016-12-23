import {NgModule, ApplicationRef} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app.routing';
import {AppComponent} from "./app.component";

import {removeNgStyles, createNewHosts} from '@angularclass/hmr';
import {LoginModule} from "./login/login.module";
import {SessionService} from "./security/session.service";
import {DropdownModule} from "ng2-bootstrap";
import {AuthGuardService} from "./security/auth-guard.service";
import {HomeComponent} from "./home/home.component";

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
    providers: [SessionService, AuthGuardService],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(public appRef: ApplicationRef) {
    }

    hmrOnInit(store) {
        console.log('HMR store', store);
    }

    hmrOnDestroy(store) {
        let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // remove styles
        removeNgStyles();
    }

    hmrAfterDestroy(store) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}
