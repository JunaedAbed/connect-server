import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoginInfoDocument = HydratedDocument<LoginInfo>;

@Schema({ collection: 'tblLoginInfo' })
export class LoginInfo {
  @Prop({ type: Number, required: false })
  intUserId?: number;

  @Prop({ type: String, unique: true, required: false, maxlength: 255 })
  strEmail?: string;

  @Prop({ type: String, required: false, maxlength: 512 })
  strPhone?: string;

  @Prop({ type: String, required: false, maxlength: 512 })
  strPassword?: string;

  @Prop({ type: Number, required: false })
  intOtp?: number;

  @Prop({ type: String, required: false, maxlength: 512 })
  strAccess_token?: string;

  @Prop({ type: String, required: false, maxlength: 512 })
  strRefresh_token?: string;

  @Prop({ type: Date, default: Date.now, required: false })
  dteCreatedAt?: Date;

  @Prop({ type: Date, default: Date.now, required: false })
  dteUpdatedAt?: Date;

  @Prop({ type: Date, default: Date.now, required: false })
  dteLastLogin?: Date;
}

export const LoginInfoSchema = SchemaFactory.createForClass(LoginInfo);
