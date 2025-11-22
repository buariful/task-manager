import { Schema, model, Document, Types } from 'mongoose';

export interface TProject extends Document {
  name: string;
  teamId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<TProject>(
  {
    name: { type: String, required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const ProjectModel = model<TProject>('Project', projectSchema);
