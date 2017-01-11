import {Option} from "./option";

export class Question {

    public description: string = null;

    public type: string = 'mc';

    public mode: string = 'edit';

    public options: Option[] = [];

    constructor(public title: string) {}

}
