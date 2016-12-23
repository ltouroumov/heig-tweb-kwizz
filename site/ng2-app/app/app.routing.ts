import {NgModule}             from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeModule} from "./home/home.module";
import {LoginModule} from "./login/login.module";
import {AuthGuardService} from "./security/auth-guard.service";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', canActivate: [AuthGuardService], data: { roles: ['ROLE_PROF'] } , component: HomeComponent},
    {path: 'u', loadChildren: () => LoginModule}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
