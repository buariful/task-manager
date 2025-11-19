import { Document, Model, Types } from 'mongoose';

export enum MemberRole {
  ADMIN = 'admin',
  LEAD = 'lead',
  MEMBER = 'member',
}

export interface TMember extends Document {
  userId: Types.ObjectId;
  teamId: Types.ObjectId;
  role: MemberRole;
  capacity: number;
}

export interface TMemberModel extends Model<TMember> {
  findByUserAndTeam(
    _userId: Types.ObjectId,
    _teamId: Types.ObjectId,
  ): Promise<TMember | null>;
}
