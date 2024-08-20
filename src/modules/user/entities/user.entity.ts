import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'tblUser' })
export class User {
  @Prop({ type: Number, index: true, unique: true, required: true })
  intUserID: number; // Equivalent to SERIAL, Primary key in MongoDB

  @Prop({ type: String })
  strUnitId: string; // BIGINT (Stored as a string to accommodate large numbers in MongoDB)

  @Prop({ type: String, maxlength: 255 })
  strEmail: string; // VARCHAR(255)

  @Prop({ type: String })
  strUserImage: string; // TEXT (to store image, voice, PDF, or other link as string)

  @Prop({ type: String })
  strPassword: string; // TEXT

  @Prop({ type: String })
  strCredential: string; // TEXT

  @Prop({ type: String })
  strDeviceToken: string; // TEXT

  @Prop({ type: String, maxlength: 50 })
  strEnroll: string; // VARCHAR(50)

  @Prop({ type: String, maxlength: 20 })
  strMobileNumber: string; // VARCHAR(20)

  @Prop({ type: String })
  strProfilePicture: string; // TEXT

  @Prop({ type: String, maxlength: 50 })
  strRole: string; // VARCHAR(50)

  @Prop({ type: String, maxlength: 50 })
  strSession: string; // VARCHAR(50)

  @Prop({ type: String, maxlength: 255 })
  strUsername: string; // VARCHAR(255)
}

export const UserSchema = SchemaFactory.createForClass(User);
