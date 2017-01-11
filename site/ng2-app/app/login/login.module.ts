import {NgModule} from "@angular/core";
import {UtilsModule} from "../utils/utils.module";

import {LoginRoutingModule} from "./login.routing";
import {LoginComponent} from "./login.component";
import {UserMenuComponent} from "./user-menu.component";
import {ProfileComponent} from "./profile.component";

@NgModule({
    imports: [
        UtilsModule,
        LoginRoutingModule
    ],
    declarations: [
        LoginComponent,
        ProfileComponent,
        UserMenuComponent
    ],
    providers: [],
    exports: [
        UserMenuComponent
    ]
})
export class LoginModule {

}
