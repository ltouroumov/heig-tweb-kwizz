import {NgModule}             from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from "./login.component";
import {AuthGuardService} from "../security/auth-guard.service";
import {ProfileComponent} from "./profile.component";

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'profile', canActivate: [AuthGuardService], data: { roles: ['ROLE_USER'] }, component: ProfileComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {
}
