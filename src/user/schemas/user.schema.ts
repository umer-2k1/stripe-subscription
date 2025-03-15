import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

type UserDocument = User & Document;

@Schema({ timestamps: true })
class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ unique: true, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  refreshToken?: string;

  @Prop({ default: null })
  tokenCreatedAt?: Date;

  @Prop({ default: null })
  lastLogin?: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ default: true })
  isActive: boolean; // Account status

  @Prop({ default: 0 })
  failedLoginAttempts: number; // Track failed login attempts

  @Prop({ default: null })
  lockUntil?: Date; // Account lock time after multiple failed attempts

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
  }
}

const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre<UserDocument>('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

export { User, UserSchema };
export type { UserDocument };
