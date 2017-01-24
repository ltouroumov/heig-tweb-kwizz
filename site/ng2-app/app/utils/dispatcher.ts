export class Dispatcher {

    private _handlers: {
        [command: string]: (args: any) => void;
    } = {};

    public static builder(): DispatcherBuilder {
        return new DispatcherBuilder();
    }

    public addHandler(command: string, handler: (args: any) => void) {
        this._handlers[command] = handler;
    }

    public handle(command: string, args: any) {
        let handler = this._handlers[command];
        if (handler) {
            handler(args);
        }
    }
}

export class DispatcherBuilder {

    private _dispatcher: Dispatcher;

    public constructor() {
        this._dispatcher = new Dispatcher();
    }

    public when(command: string, handler: (args: any) => void): DispatcherBuilder {
        this._dispatcher.addHandler(command, handler);
        return this;
    }

    public build(): Dispatcher {
        return this._dispatcher;
    }

}