import {Injectable} from "@angular/core";
import {Subject, Observable, Observer} from "rxjs";

@Injectable()
export class WebSocketService {

    private socket: Subject<any> = null;

    public connect(url: string): Subject<any> {
        if (this.socket == null) {
            this.socket = this.create(url);
        }

        return this.socket;
    }

    private create(url: string): Subject<any> {
        let ws = new WebSocket(url);

        let observable = Observable.create(
            (obs: Observer<any>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);

                return ws.close.bind(ws);
            }
        );

        let observer = new MessageQueue(ws);

        return Subject.create(observer, observable);
    }

}

class MessageQueue {

    private queue: any[] = [];

    private isOpen: boolean = false;

    public constructor(private socket: WebSocket) {
        this.socket.onopen = this.onOpen.bind(this);
    }

    private onOpen() {
        var msg;
        while (msg = this.queue.pop()) {
            this.send(msg);
        }
        this.isOpen = true;
    }

    private send(message: any) {
        this.socket.send(JSON.stringify(message));
    }

    public next(message: any) {
        if (this.socket.readyState == WebSocket.OPEN) {
            this.send(message);
        } else {
            this.queue.unshift(message);
        }
    }

}