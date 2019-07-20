import {Client, Message, User} from 'discord.js';
import {Subject, BehaviorSubject} from 'rxjs';
import * as config from '../../config.json'
export {messenger};

export interface IMessage {
    author: string;
    content: string;
    isDM: boolean;
}

class Bot  {
    public readonly messageBus$ = new BehaviorSubject<IMessage>(null);
    private readonly client: Client;
    constructor(private readonly token: string) {
        this.client = new Client();
        this.initialize();
    }

    private initialize() {
        this.client.login(this.token).then(() => {
                console.log('successfully logged in');
            }).catch(
                err => {
                    console.log(err.message);
                    throw new Error('Failed to login. Exiting')
                }
            );
        this.client.on('message', (message: Message) => {
            if(!message.author.bot) {
                console.log(message);
                this.messageBus$.next({author: message.author.id, content: message.content, isDM: message.channel.type === 'dm'})
            }
        }) 
        
    }
    public respond (response: string, userId: string) {
        this.client.fetchUser(userId).then((user: User) => {
            user.send(response);
        })
    }

}
const messenger = new Bot(config.token);
