import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Subscription Schema
type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ unique: true, required: true })
  stripeSubscriptionId: string;

  @Prop({ default: 'active', enum: ['active', 'canceled', 'paused', 'unpaid'] })
  status: string;

  @Prop({ default: Date.now })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  canceledAt?: Date;
}

const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

export { Subscription, SubscriptionSchema };
export type { SubscriptionDocument };
