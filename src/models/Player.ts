import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  losses: number;
  createdAt: Date;
}

const PlayerSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  losses: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Avoid OverwriteModelError in Next.js development
export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
