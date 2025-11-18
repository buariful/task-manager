import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TFullName, TUser, TUserModel } from './user.interface';
import config from '../../app/config';

const fullNameSchema = new Schema<TFullName>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const userSchema = new Schema<TUser, TUserModel>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: fullNameSchema, required: true },
  email: { type: String, required: true },
});

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, Number(config.bcrypt_salt));
  next();
});

// userSchema.pre('find', function () {
//   this.find({ isDeleted: false }).select('-password');
// });
// userSchema.pre('findOne', function () {
//   this.find({ isDeleted: false }).select('-password');
// });

userSchema.statics.findByUsername = async function (
  username: string,
): Promise<TUser | null> {
  const existingUser = await this.findOne({ username });
  return existingUser;
};

userSchema.statics.isUserExists = async function (
  id: number,
): Promise<TUser | null> {
  const existingUser = await this.findById(id);
  return existingUser;
};

export const UserModel = model<TUser, TUserModel>('User', userSchema);
