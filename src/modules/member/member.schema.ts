import { Schema, model } from 'mongoose';
import { MemberRole, TMember, TMemberModel } from './member.interface';

const memberSchema = new Schema<TMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    role: {
      type: String,
      enum: Object.values(MemberRole),
      required: true,
    },
    capacity: { type: Number, min: 0, max: 5, required: true },
  },
  { timestamps: true },
);

memberSchema.statics.findByUserAndTeam = function (userId, teamId) {
  return this.findOne({ userId, teamId });
};

export const MemberModel = model<TMember, TMemberModel>('Member', memberSchema);
