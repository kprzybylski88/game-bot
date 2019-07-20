"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const rxjs_1 = require("rxjs");
class MessageProcessor {
    constructor() {
        this.messageBus$ = bot_1.messenger.messageBus$;
        this._dispatcher$ = [];
        Object.freeze(this._dispatcher$);
        this.messageBus$.subscribe({
            next: message => {
                this.responseHandler(message);
            }
        });
    }
    get dispatcher$() {
        return this._dispatcher$;
    }
    responseHandler(message) {
        console.log((message));
        if (message) {
            bot_1.messenger.respond('I hear ya', message.author);
            if (this._dispatcher$[message.author]) {
                this._dispatcher$[message.author].next(message.content);
            }
            else {
                const newDispatcher = Object.assign({}, this.dispatcher$);
                newDispatcher[message.author] = new rxjs_1.BehaviorSubject(message.content);
                this._dispatcher$ = newDispatcher;
                Object.freeze(this._dispatcher$);
            }
        }
    }
    ;
}
let mp = new MessageProcessor();
exports.mp = mp;
//# sourceMappingURL=message-processor.js.map