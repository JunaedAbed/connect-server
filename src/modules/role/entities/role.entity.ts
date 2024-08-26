import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ collection: 'tblRole' })
export class Role {
  @Prop({ type: Number, required: true })
  intRoleId: number;

  @Prop({
    type: String,
    enum: ['super-admin', 'admin', 'group-admin', 'user'],
    required: true,
  })
  strRoleName: string; // ENUM in MySQL, stored as string in MongoDB

  @Prop({ type: Number, required: true })
  intCreatedBy: number; // Foreign key or created by user ID

  @Prop({ type: Date, default: Date.now })
  dteCreatedAt: Date; // TIMESTAMP, default is current date

  @Prop({ type: Date, default: Date.now })
  dteUpdatedAt: Date; // TIMESTAMP, default is current date

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean; // BOOLEAN, default is true
}

export const RoleSchema = SchemaFactory.createForClass(Role);
