import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Credit Schema
type CreditDocument = Credit & Document;

@Schema({ timestamps: true })
class Credit {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: 0 })
  remainingCredits: number;
}

const CreditSchema = SchemaFactory.createForClass(Credit);

export { Credit, CreditSchema };
export type { CreditDocument };
