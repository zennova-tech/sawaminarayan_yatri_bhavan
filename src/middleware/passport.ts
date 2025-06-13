import { Request } from 'express';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import { SECRET_KEY } from '@/config';
import { db } from '@/sequilizedir/models';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
    }
  }
}

const cookieExtractor = (req: Request) => {
  return req.headers.authorization?.split(' ')[1] ?? null;
};

const opts: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: SECRET_KEY,
};

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const result = await db.Admin.findByPk(payload.id);
        if (!result) return done(null, false);
        return done(null, result);
      } catch (err) {
        return done(err, false);
      }
    })
  );

export default passport;
