import mongoose, { Schema, Document, Model } from 'mongoose';

export interface FridgeItem {
    name: string;
    count: number;
}

export interface FridgeModel extends Document {
    name: string;
    owner: number;
    confirmationCode: string;
    contents: FridgeItem[];
    contentsWanted: FridgeItem[];
  }

const FridgeSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true, unique: true },
  confirmationCode: { type: String, required: true },
  contents: { type: Array },
  contentsWanted: { type: Array }
});

export const Fridge: Model<FridgeModel> = mongoose.model<FridgeModel>('Fridge', FridgeSchema);