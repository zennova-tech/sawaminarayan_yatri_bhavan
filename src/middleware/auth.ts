import { generalResponse } from '@/utils/generalResponse';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (
      err ||
      !user ||
      (user.email !== 'swami.admin@yopmail.com' && user.email !== 'info@swaminarayanhotels.com')
    ) {
      return generalResponse(req, res, null, 'Access denied: Admins only', false, null, 403);
    }
    req.user = user;
    next();
  })(req, res, next);
};
