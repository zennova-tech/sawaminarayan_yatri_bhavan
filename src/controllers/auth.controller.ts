import { checkUserService } from "@/repository/auth.repository";
import Admin from "@/sequilizedir/models/users.model";
import { generalResponse } from "@/utils/generalResponse";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/config";

const AdminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: Admin | null = await checkUserService(email);
    if (!user) {
      return generalResponse(
        req,
        res,
        null,
        "username or password is invalid",
        false,
        "error",
        401
      );
    }
    const passwordMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!passwordMatch) {
      return generalResponse(
        req,
        res,
        null,
        "username or password is invalid",
        false,
        "error",
        401
      );
    }
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token: string = jwt.sign(payload, SECRET_KEY, { expiresIn: "10h" });
    return generalResponse(
      req,
      res,
      {
        token: token,
        user,
      },
      "login success"
    );
  } catch (error) {
    console.log("🚀 ~ :54 ~ AdminLogin ~ error:", error);
    return generalResponse(req, res, null, "Login failed", false, "error", 500);
  }
};

export { AdminLogin };
