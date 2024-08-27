import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UnitDocument = HydratedDocument<Unit>;

@Schema({ collection: 'tblUnit' })
export class Unit {
  @Prop({ type: String })
  strUnitId: string;

  @Prop({ type: String, maxlength: 255 })
  strUnitName: string; // VARCHAR(255)
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
