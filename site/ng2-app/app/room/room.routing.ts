import {NgModule}             from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthGuardService} from "../security/auth-guard.service";
import {RoomComponent} from "./room.component";

export const routes: Routes = [
    {path: ':id', canActivate: [AuthGuardService], data: { anonymous: false }, component: RoomComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoomRoutingModule {
}
