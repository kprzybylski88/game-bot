import { messenger} from './bot';
import { BehaviorSubject } from 'rxjs';
export {mp}
class MessageProcessor {
    private messageBus$ = messenger.messageBus$;
    private _dispatcher$: {[userId: number]: BehaviorSubject<string>} = [];
    get dispatcher$() {
        return this._dispatcher$;
    }
    constructor() {
        Object.freeze(this._dispatcher$)
        this.messageBus$.subscribe({
            next: message => {
               this.responseHandler(message);
            }
        });
    }
    private responseHandler(message) {
        console.log((message));
        if (message) {
            messenger.respond('I hear ya', message.author);
            if (this._dispatcher$[message.author]) {
                this._dispatcher$[message.author].next(message.content);
            } else {
                const newDispatcher = {...this.dispatcher$};
                newDispatcher[message.author] = new BehaviorSubject<string>(message.content);
                this._dispatcher$ = newDispatcher;
                Object.freeze(this._dispatcher$);
            }
        }
    };

}

let mp = new MessageProcessor();
