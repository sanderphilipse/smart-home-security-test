
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserModel extends Document {
    userName: string;
    password: string;
    uid: string;
  }

const UserSchema: Schema = new Schema({
  userName: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const User: Model<UserModel> = mongoose.model<UserModel>('User', UserSchema);