import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {LayoutService} from "./layout.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        FormsModule
    ],
    providers: [
        LayoutService
    ],
    declarations: [
    ]
})
export class UtilsModule {

}
