import { Types, Document, Model } from 'mongoose';
export interface TTeamMember {
  name: string;
  role: string;
  capacity: number;
}
export interface TTeam extends Document {
  name: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface TTeamModel extends Model<TTeam> {}
