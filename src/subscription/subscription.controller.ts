import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { SuccessResponse } from 'src/response/dto/response.dto';
import { ApiCommonResponses } from 'src/swagger/decorators/swagger.decorators';
import { CreatePlanDto } from './dto/plan/create-plan.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('plan')
  @Roles(Role.Admin)
  @ApiCommonResponses()
  @ApiBody({ type: CreatePlanDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createSubscriptionPlan(@Body() createPlanDto: CreatePlanDto) {
    const plan = await this.subscriptionService.createPlan(createPlanDto);
    return new SuccessResponse(HttpStatus.CREATED, 'Stripe Plan created', {
      stripe: plan,
    });
  }

  @Get('plans')
  @ApiCommonResponses()
  async getSubscriptionPlans() {
    const plans = await this.subscriptionService.getPlans();
    return new SuccessResponse(HttpStatus.OK, 'Stripe Plans fetched', plans);
  }
}
