import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, userpassword: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const passwordMatch = await bcrypt.compare(userpassword, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Invalid email or password');
    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.updateRefreshToken(user._id, refreshToken);
    await this.userModel.findByIdAndUpdate(
      user._id,
      { lastLogin: Date.now() },
      { new: true },
    );
    const { password, ...userWithoutPassword } = user.toObject();
    return { accessToken, refreshToken, user: userWithoutPassword };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.findById(decoded.sub);
      if (!user || user.refreshToken !== refreshToken)
        throw new UnauthorizedException();
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    return this.updateRefreshToken(userId, null);
  }

  async createUser(userDto: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    return this.userModel.create({ ...userDto, password: hashedPassword });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { refreshToken: refreshToken, tokenCreatedAt: Date.now() },

      { new: true },
    );
  }
}
