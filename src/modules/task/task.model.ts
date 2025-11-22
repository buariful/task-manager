import { Schema, model, Document, Types } from 'mongoose';

export interface TTask extends Document {
  title: string;
  description: string;
  projectId: Types.ObjectId;
  assignedTo?: Types.ObjectId; // Member ID
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Done';
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TTask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Member' },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Done'],
      default: 'Pending',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const TaskModel = model<TTask>('Task', taskSchema);
