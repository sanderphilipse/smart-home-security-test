import { Db, MongoClient } from 'mongodb';
import mongoose, { Connection } from 'mongoose';
import { InternalServerError } from 'restify-errors';
import { User, UserModel } from './models/user.js';
import * as config from './config.json';
import { LightStatus, Light } from './models/light.js';

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
            // User.findOne({userName: {'$gte': ''}}).then(a => console.log(a));
            console.log(username);
            console.log(password);
            return User.findOne({userName: username, password: password}).exec();
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
