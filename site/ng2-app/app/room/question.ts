import {Option} from "./option";
import {ObservableList} from "../utils/observable-list";
import * as _ from "underscore"

export class Question {

    public id: number = 0;

    public description: string = null;

    public type: string = 'MultipleChoice';

    public options: ObservableList<Option> = new ObservableList([]);

    public answered: boolean = false;

    constructor(public title: string) {}

    public static fromJson(args: any, answered: number[] = []) {
        let self = new Question(args.title);
        self.id = args.id;
        self.description = args.description;
        self.type = args.type;
        self.options.set(args.options.map(opt => Option.fromJson(opt)));
        self.answered = _.contains(answered, self.id);
        return self;
    }

    public forCommit(): any {
        return {
            title: this.title,
            description: this.description,
            type: this.type,
            options: _.map(this.options.get(), option => {
                return { title: option.title }
            })
        }
    }

    public update(args: any) {
        _.each(args.options, (opt: any) => {
            let option = this.options.get().find(o => o.id == opt.id);
            option.votes.next(opt.votes);
        });
        this.options.next();
    }
}
