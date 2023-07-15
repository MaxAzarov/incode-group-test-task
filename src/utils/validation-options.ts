import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  stopAtFirstError: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: errors.reduce(
          (accumulator, currentValue) => ({
            ...accumulator,
            ...parseNestedErrors(currentValue),
          }),
          {},
        ),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
};

function parseNestedErrors(error: ValidationError) {
  if (error.constraints) {
    return {
      [error.property]: Object.values(error.constraints).join(', '),
    };
  }

  return {
    [error.property]: error.children.reduce(
      (acc, child) => ({
        ...acc,
        ...parseNestedErrors(child),
      }),
      {},
    ),
  };
}

export default validationOptions;
