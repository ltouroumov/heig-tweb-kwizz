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

        let observer = {
            next: (data: any) => {
                if (ws.readyState == WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };

        return Subject.create(observer, observable);
    }

}