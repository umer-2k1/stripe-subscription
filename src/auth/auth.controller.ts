import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiCommonResponses } from 'src/swagger/decorators/swagger.decorators';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCommonResponses()
  @ApiBody({ type: SignupDto })
  async register(@Body() createUserDto: SignupDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @ApiCommonResponses()
  @ApiResponse({ status: 200, description: 'Successful Login' })
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.findById(req.user._id);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.authService.findById(id);
  }
}
