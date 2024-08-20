import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'tblUser' })
export class User {
  @Prop({ type: Number, index: true, unique: true, required: true })
  UserID: number; // Equivalent to SERIAL, Primary key in MongoDB

  @Prop({ type: String })
  unitId: string; // BIGINT (Stored as a string to accommodate large numbers in MongoDB)

  @Prop({ type: String, maxlength: 255 })
  email: string; // VARCHAR(255)

  @Prop({ type: String })
  userImage: string; // TEXT (to store image, voice, PDF, or other link as string)

  @Prop({ type: String })
  Password: string; // TEXT

  @Prop({ type: String })
  credential: string; // TEXT

  @Prop({ type: String })
  device_token: string; // TEXT

  @Prop({ type: String, maxlength: 50 })
  enroll: string; // VARCHAR(50)

  @Prop({ type: String, maxlength: 20 })
  mobile_number: string; // VARCHAR(20)

  @Prop({ type: String })
  profile_picture: string; // TEXT

  @Prop({ type: String, maxlength: 50 })
  role: string; // VARCHAR(50)

  @Prop({ type: String, maxlength: 50 })
  session: string; // VARCHAR(50)

  @Prop({ type: String, maxlength: 255 })
  user_name: string; // VARCHAR(255)
}

export const UserSchema = SchemaFactory.createForClass(User);
