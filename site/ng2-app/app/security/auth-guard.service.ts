import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {SessionService} from "./session.service";
import {Session} from "./session";

@Injectable()
export class AuthGuardService implements CanActivate {

    private session: Session = null;

    public constructor(private sessionService: SessionService, private router: Router) {
        this.sessionService.session.subscribe(session => {
            this.session = session;
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let anon = route.data["anonymous"] as boolean;

        if (this.session.loggedIn != anon) {
            return true;
        } else {
            this.router.navigate(['/u/login']);
            return false;
        }
    }

}