import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AutosizeDirective} from "./autosize.directive";
import {LayoutService} from "./layout.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        AutosizeDirective
    ],
    providers: [
        LayoutService
    ],
    declarations: [
        AutosizeDirective
    ]
})
export class UtilsModule {

}