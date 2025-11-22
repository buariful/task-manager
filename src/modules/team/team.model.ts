import { model, Schema } from 'mongoose';
import { TTeam, TTeamModel } from './team.interface';
import { MemberModel } from '../member/member.schema';

const teamSchema = new Schema<TTeam, TTeamModel>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

teamSchema.virtual('members', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'teamId',
});

// teamSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
//   await MemberModel.deleteMany({ teamId: this._id });
//   next();
// });

teamSchema.post('deleteOne', async function (doc) {
  await MemberModel.deleteMany({ teamId: doc._id });
});

export const TeamModel = model<TTeam, TTeamModel>('Team', teamSchema);
