import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Plan Schema
type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
class Plan {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stripePriceId: string;

  @Prop({ required: true })
  stripeProductId: string;

  @Prop({ required: true })
  credits: number;

  @Prop({ required: true })
  interval: string;

  @Prop({ default: true })
  isActive: boolean;
}

const PlanSchema = SchemaFactory.createForClass(Plan);

export { Plan, PlanSchema };
export type { PlanDocument };
