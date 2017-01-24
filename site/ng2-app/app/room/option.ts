import {BehaviorSubject} from "rxjs";
export class Option {

    public id: number = 0;

    public votes: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(public title: string) {

    }

    static fromJson(opt: any) {
        let self = new Option(opt.title);
        self.id = opt.id;
        self.votes.next(opt.votes);

        return self;
    }
}