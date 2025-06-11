import { Request } from "express";
import { StrategyOptions, Strategy } from "passport-jwt";
import { SECRET_KEY } from "@/config";
import { db } from "@/sequilizedir/models";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
    }
  }
}

const cookieExtractor = (req: Request) => {
  return req.headers.authorization?.split(" ")[1] ?? null;
};

type DoneCallback = (err: any, user?: Express.User) => void;

const auth: DoneCallback = (passport) => {
  const opt: StrategyOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: SECRET_KEY,
  };
  passport.use(
    new Strategy(opt, async (payload, done) => {
      try {
        const result = await db.Admin.findByPk(payload.id);
        if (!result) return done(null, false);
        return done(null, payload);
      } catch (error) {
        console.log(error);
      }
    })
  );
};

export { cookieExtractor, auth };
