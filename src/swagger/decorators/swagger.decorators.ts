// swagger.decorators.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  BAD_REQUEST_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  SUCCESS_RESPONSE,
} from '../swagger.docs';

// Common Responses Decorator
export function ApiCommonResponses() {
  return applyDecorators(
    ApiResponse(BAD_REQUEST_RESPONSE),
    ApiResponse(UNAUTHORIZED_RESPONSE),
  );
}

// Success Response Decorator
export function ApiSuccessResponse(example: any) {
  return applyDecorators(ApiResponse(SUCCESS_RESPONSE(example)));
}
