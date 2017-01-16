import {Component} from "@angular/core";
import {SessionService, ProfessorLogin, StudentLogin} from "../security/session.service";
import {Router} from "@angular/router";


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['../utils/layout.component.scss']
})
export class LoginComponent {

    public student: StudentLogin = new StudentLogin();

    public professor: ProfessorLogin = new ProfessorLogin();

    public constructor(private session: SessionService, private router: Router) {

    }

    public doStudentLogin($event: Event) {
        $event.preventDefault();

        console.log("Student Login");
        this.session.login(this.student).then(session => {
            if (session != null) {
                console.log("Got Session");
                this.router.navigate(['/home']);
            } else {
                console.log("Got no session");
            }
        });

    }

    public doProfessorLogin($event: Event) {
        $event.preventDefault();

        console.log("Professor Login");
        this.session.login(this.professor).then(session => {
            if (session != null) {
                this.router.navigate(['/']);
            }
        });
    }

}