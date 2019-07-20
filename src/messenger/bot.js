"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rxjs_1 = require("rxjs");
const config = require("../../config.json");
class Bot {
    constructor(token) {
        this.token = token;
        this.messageBus$ = new rxjs_1.BehaviorSubject(null);
        this.client = new discord_js_1.Client();
        this.initialize();
    }
    initialize() {
        this.client.login(this.token).then(() => {
            console.log('successfully logged in');
        }).catch(err => {
            console.log(err.message);
            throw new Error('Failed to login. Exiting');
        });
        this.client.on('message', (message) => {
            if (!message.author.bot) {
                console.log(message);
                this.messageBus$.next({ author: message.author.id, content: message.content, isDM: message.channel.type === 'dm' });
            }
        });
    }
    respond(response, userId) {
        this.client.fetchUser(userId).then((user) => {
            user.send(response);
        });
    }
}
const messenger = new Bot(config.token);
exports.messenger = messenger;
//# sourceMappingURL=bot.js.map