import {BehaviorSubject, Subscription} from "rxjs";

export class ObservableList<T>
{
    private $: BehaviorSubject<T[]>;

    constructor(value: T[])
    {
        this.$ = new BehaviorSubject(value);
    }

    public subscribe(next?: (value: T[]) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        return this.$.subscribe(next, error, complete);
    }

    public get(): T[] {
        return this.$.getValue();
    }

    public set(values: T[]) {
        this.$.next(values);
    }

    public remove(predicate: (T) => boolean) {
        let values = this.$.value;
        let idx = values.findIndex(predicate);
        values.splice(idx);
        this.set(values);
    }

    public push(value: T) {
        let values = this.$.value;
        values.push(value);
        this.set(values);
    }

    public next() {
        let values = this.$.value;
        this.set(values);
    }

}