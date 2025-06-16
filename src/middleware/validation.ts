import { RequestHandler } from 'express';
import { generalResponse } from '@/utils/generalResponse';

type ErrorType = {
  message: string;
  path: object;
  type: string;
  context: any;
};

const cleanObj = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
};

const errorFilterValidator = (error: Array<ErrorType>): string => {
  return error.map((err) => err.message).join(', ');
};

const validationMiddleware = (
  schema: any,
  source: 'body' | 'query' | 'params' = 'body'
): RequestHandler => {
  return async (req, res, next) => {
    try {
      cleanObj(req[source]);
      const validated = await schema.validateAsync(req[source], { abortEarly: false });
      Object.keys(validated).forEach((key) => {
        (req as any)[source][key] = validated[key];
      });
      next();
    } catch (e) {
      const error: any = e;

      if (error.details) {
        const errorResponse = errorFilterValidator(error.details);
        return generalResponse(
          req,
          res,
          errorResponse,
          'VALIDATION_ERROR',
          true,
          'error',
          400
        );
      }

      return generalResponse(req, res, error.message, 'SOMETHING_WRONG', true, 'error', 400);
    }
  };
};

export default validationMiddleware;
