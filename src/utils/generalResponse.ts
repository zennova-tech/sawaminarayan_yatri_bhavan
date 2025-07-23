import { Request, Response } from 'express';

export const generalResponse = async (
  request: Request,
  response: Response,
  data: any = null,
  message: string,
  toast = false,
  responseType = 'success',
  statusCode = 200,
) => {
  if (request.transaction) {
    if (responseType === 'success') await request.transaction.commit();
    else await request.transaction.rollback();
  }

  response.status(statusCode).send({
    data,
    message,
    toast,
    responseType,
  });
};
