
import mongoose, { Schema, Document, Model } from 'mongoose';

export enum LightStatus {
    ON, OFF, OFFLINE
}

export interface LightModel extends Document {
    name: string;
    status: LightStatus;
    color: string;
}

validator:

const LightSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    status: {
        type: String, required: true, validate: {
            validator: (v: any) => LightStatus[v] !== null
        },
    },
    color: { type: String, required: true, validate: {
        validator: (v: any) => /^#([A-Fa-f0-9]{6})/.test(v)
    } }
});

export const Light: Model<LightModel> = mongoose.model<LightModel>('Light', LightSchema);