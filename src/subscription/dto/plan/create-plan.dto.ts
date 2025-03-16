import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Starter', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Lorem Ipsum', required: true })
  @IsNotEmpty()
  @IsString()
  desc: string;

  @ApiProperty({ example: 20, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 20, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  credits: number;

  @ApiProperty({ example: 'month' })
  interval: string;
}
