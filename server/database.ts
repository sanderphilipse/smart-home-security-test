import mongoose, { Connection } from 'mongoose';
import { UnauthorizedError } from 'restify-errors';
import { User, UserModel } from './models/user.js';
import * as config from './config.json';
import * as crypto from 'crypto';

declare interface Models {
    User: UserModel;

}

export class SmartHomeDatabase {
    
    private _db: Connection; 
    private _models: Models;

    constructor() {
        mongoose.connect(config.db.url, { useNewUrlParser: true });
        this._db = mongoose.connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

        this._models = {
            User: new User()
            // this is where we initialise all models
        }
    }

    public get models() {
        return this._models;
    }
   
    public authenticate = async(username: string, password: string): Promise<UserModel | null> => {
        try {
            return User.findOne({userName: username})
                .then((user) => {
                    const hash = crypto.createHash('md5').update(password).digest('hex');
                    if ( user && hash === user.password) {
                        return user;
                    }
                    else throw new UnauthorizedError();
                }
            );
        }
        catch(error) {
            return error;
        }
    }

    private connected() {
        console.log('Mongoose has connected');
    }

    private error(error: Error) {
        console.log('Mongoose has errored', error);
    }
}
