import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UnitDocument = HydratedDocument<Unit>;

@Schema({ collection: 'tblUnit' })
export class Unit {
  @Prop({
    type: String,
    maxlength: 255,
  })
  strUnitName: string; // VARCHAR(255)

  @Prop({ type: Date, default: Date.now })
  dteCreatedAt: Date; // TIMESTAMP, default is current date

  @Prop({ type: Date, default: Date.now })
  dteUpdatedAt: Date; // TIMESTAMP, default is current date

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean; // BOOLEAN, default is true
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
