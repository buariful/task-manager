import { Document, Model } from 'mongoose';

export type TFullName = {
  firstName: string;
  lastName: string;
};

export type TAddress = {
  street: string;
  city: string;
  country: string;
};

export type TOrder = {
  productName: string;
  price: number;
  quantity: number;
};

export interface TUser extends Document {
  username: string;
  password: string;
  fullName: TFullName;
  email: string;
}

export interface TUserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: number): Promise<TUser | null>;
  // eslint-disable-next-line no-unused-vars
  findByUsername(username: string): Promise<TUser | null>;
}
