import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginModule} from "./login/login.module";
import {AuthGuardService} from "./security/auth-guard.service";
import {HomeComponent} from "./home/home.component";
import {RoomModule} from "./room/room.module";

export const routes: Routes = [
    {path: '', pathMatch: 'full', canActivate: [AuthGuardService], data: { roles: ['ROLE_PROF'] } , component: HomeComponent},
    {path: 'u', loadChildren: () => LoginModule},
    {path: 'r', loadChildren: () => RoomModule}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
