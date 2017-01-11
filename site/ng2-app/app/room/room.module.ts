import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RoomRoutingModule} from "./room.routing";
import {RoomComponent} from "./room.component";
import {QuestionEditComponent} from "./question-edit.component";
import {QuestionEditMcComponent} from "./question-edit-mc.component";
import {QuestionViewComponent} from "./question-view.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RoomRoutingModule
    ],
    declarations: [
        RoomComponent,
        QuestionEditComponent,
        QuestionEditMcComponent,
        QuestionViewComponent
    ],
    providers: [
    ]
})
export class RoomModule {

}
