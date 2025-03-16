import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

class CreateSubscriptionDto {
  @ApiProperty({
    example: 'Selected Plan (Basic, Standard, Premium)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  planId: string;
}
export { CreateSubscriptionDto };
