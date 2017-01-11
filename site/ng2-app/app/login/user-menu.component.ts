import {Component} from "@angular/core";
import {SessionService} from "../security/session.service";
import {Session} from "../security/session";
import {Router} from "@angular/router";

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

    public session: Session = null;

    constructor(private sessionService: SessionService, private router: Router) {
        console.log("UserMenu Created");
        this.sessionService.session.subscribe(session => {
            console.log("Session updated");
            this.session = session;
        });
    }

    public doLogout() {
        this.sessionService.logout();
        this.router.navigate(['/login']);
    }

}
