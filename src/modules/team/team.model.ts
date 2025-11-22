import { model, Schema } from 'mongoose';
import { TTeam, TTeamModel } from './team.interface';
import { MemberModel } from '../member/member.schema';

const teamSchema = new Schema<TTeam, TTeamModel>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        capacity: { type: Number, min: 0, max: 5, required: true },
      },
    ],
  },
  { timestamps: true },
);

// teamSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
//   await MemberModel.deleteMany({ teamId: this._id });
//   next();
// });

teamSchema.post('deleteOne', async function (doc) {
  await MemberModel.deleteMany({ teamId: doc._id });
});

export const TeamModel = model<TTeam, TTeamModel>('Team', teamSchema);
