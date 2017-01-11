import {Observable, BehaviorSubject} from "rxjs";
export class RoomInfo {

    private status$ = new BehaviorSubject<string>('closed');
    public status: Observable<string> = this.status$.asObservable();

    constructor(public id: number,
                public name: String) {

    }

    changeStatus(status: string) {
        this.status$.next(status);
    }
}