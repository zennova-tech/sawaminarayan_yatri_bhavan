import { Transaction } from "sequelize";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: User;
      language_id: string;
      timezone: string;
      language: string;
      transaction?: Transaction;
    }
  }
}
