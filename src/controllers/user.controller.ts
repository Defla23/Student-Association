import { Request, Response } from "express";
import { UserService, LoginPayload } from "../services/user.service";

export const UserController = {
  async list(req: Request, res: Response) {
    try {
      const users = await UserService.list();
      const safeUsers = users.map(({ password, ...u }) => u);
      return res.json(safeUsers);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async get(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    try {
      const user = await UserService.get(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...safeUser } = user;
      return res.json(safeUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async create(req: Request, res: Response) {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const user = await UserService.create(req.body);
      const { password, ...safeUser } = user;
      return res.status(201).json(safeUser);
    } catch (err: any) {
      console.error(err);
      if (err.message === "EmailExists") {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    try {
      const user = await UserService.update(id, req.body);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...safeUser } = user;
      return res.json({ message: "User updated successfully", user: safeUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    try {
      await UserService.delete(id);
      return res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    try {
      const payload: LoginPayload = await UserService.login(email, password);
      return res.json(payload);
    } catch (err: any) {
      console.error(err);
      if (err.message === "user not found" || err.message === "invalid credentials") {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async verifyCode(req: Request, res: Response) {
    const { email, verification_code } = req.body;
    if (!email || !verification_code) return res.status(400).json({ message: "Missing fields" });

    try {
      const user = await UserService.verifyCode(email, verification_code);
      if (!user) return res.status(400).json({ message: "Invalid verification_code or email" });

      const { password, ...safeUser } = user;
      return res.json({ message: "User verified successfully", user: safeUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default UserController;