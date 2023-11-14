import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

export type ViberDocument = Viber & Document;

@Schema({ versionKey: false, timestamps: true })
export class Viber extends Model<Viber> {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop()
  country: string;

  @Prop()
  language: string;

  @Prop()
  apiVersion: number;
}

export const ViberSchema = SchemaFactory.createForClass(Viber);
