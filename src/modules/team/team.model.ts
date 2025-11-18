import { model, Schema } from 'mongoose';
import { TTeam, TTeamModel } from './team.interface';

const teamSchema = new Schema<TTeam, TTeamModel>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const TeamModel = model<TTeam, TTeamModel>('Team', teamSchema);
