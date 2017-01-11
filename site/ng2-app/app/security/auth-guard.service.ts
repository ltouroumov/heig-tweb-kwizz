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
        let roles = route.data["roles"] as Array<string>;

        if (this.session != null) {
            if (this.session.hasRoles(roles)) {
                return true;
            } else {
                this.router.navigate(['/u/profile']);
                return false;
            }
        } else {
            this.router.navigate(['/u/login']);
            return false;
        }
    }

}