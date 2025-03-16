// swagger.docs.ts
import { ApiResponseOptions } from '@nestjs/swagger';

// Common Bad Request Response
export const BAD_REQUEST_RESPONSE: ApiResponseOptions = {
  status: 400,
  description: 'Bad Request',
  schema: {
    example: {
      statusCode: 400,
      message: 'Invalid input',
      error: 'Bad Request',
    },
  },
};

// Common Unauthorized Response
export const UNAUTHORIZED_RESPONSE: ApiResponseOptions = {
  status: 401,
  description: 'Unauthorized',
  schema: {
    example: { statusCode: 401, message: 'Unauthorized' },
  },
};

// Success Response Template
export const SUCCESS_RESPONSE = (example: any): ApiResponseOptions => ({
  status: 200,
  description: 'Success',
  schema: { example },
});
