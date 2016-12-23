import { Injectable } from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class LayoutService {

    private layoutSource = new Subject<String>();

    public layout = this.layoutSource.asObservable();

    public setLayout(layout:String): void {
        this.layoutSource.next(layout);
    }

}