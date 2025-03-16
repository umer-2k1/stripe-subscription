import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';

import { SuccessResponse } from 'src/response/dto/response.dto';
import { ApiCommonResponses } from 'src/swagger/decorators/swagger.decorators';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCommonResponses()
  @ApiBody({ type: SignupDto })
  async register(@Body() createUserDto: SignupDto) {
    const user = await this.authService.createUser(createUserDto);
    return new SuccessResponse(
      HttpStatus.CREATED,
      'User registered successfully',
      {
        user,
      },
    );
  }

  @Post('login')
  @ApiCommonResponses()
  @ApiResponse({ status: 200, description: 'Successful Login' })
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);
    const loginResponse = await this.authService.login(user);
    return new SuccessResponse(
      HttpStatus.OK,
      'Login successful',
      loginResponse,
    );
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const newTokens = await this.authService.refreshToken(refreshToken);
    return new SuccessResponse(
      HttpStatus.OK,
      'Token refreshed successfully',
      newTokens,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    this.authService.logout(req.user._id);
    return new SuccessResponse(
      HttpStatus.OK,
      'User logged out successfully',
      null,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userProfile = await this.authService.findById(req.user._id);
    return new SuccessResponse(
      HttpStatus.OK,
      'User profile retrieved successfully',
      userProfile,
    );
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.authService.findById(id);
    return new SuccessResponse(
      HttpStatus.OK,
      'User retrieved successfully',
      user,
    );
  }
}
