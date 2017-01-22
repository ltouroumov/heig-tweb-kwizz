import {Component} from "@angular/core";
import {SessionService, IdentityLogin} from "../security/session.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['../utils/layout.component.scss']
})
export class LoginComponent {

    public identity: IdentityLogin = new IdentityLogin();

    public errors: string[] = null;

    public constructor(private session: SessionService, private router: Router) {

    }

    public doLogin($event: Event) {
        $event.preventDefault();

        this.session.login(this.identity)
            .catch((err, caught) => {
                console.log(err, caught);
                this.errors = ["Failed to login"];
                return Observable.throw(err);
            })
            .subscribe(session => {
                if (session.loggedIn) {
                    this.router.navigate(['/']);
                }
            });

    }

    public doSignIn($event: Event) {
        $event.preventDefault();

        this.session.signin(this.identity)
            .catch((err, caught) => {
                let errors = err.json();
                this.errors = errors.map(error => error['description']);

                return Observable.throw(err);
            })
            .subscribe(session => {
                if (session.loggedIn) {
                    this.router.navigate(['/']);
                }
            });
    }

}