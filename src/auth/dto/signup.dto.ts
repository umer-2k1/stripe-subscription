import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}
