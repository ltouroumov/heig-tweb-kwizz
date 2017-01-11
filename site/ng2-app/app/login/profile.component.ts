import {Component} from "@angular/core";
import {SessionService} from "../security/session.service";
import {Session} from "../security/session";

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    public session: Session;

    public constructor(private sessionService: SessionService) {
        this.session = this.sessionService.sessionSubject.getValue();
    }

}
