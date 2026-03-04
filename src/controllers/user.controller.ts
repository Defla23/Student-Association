import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const UserController = {
  // GET /users
  async list(req: Request, res: Response) {
    try {
      const users = await UserService.list();
      // hide passwords
      const safeUsers = users.map(({ password, ...u }) => u);
      return res.json(safeUsers);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // GET /users/:id
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

  // POST /users
  async create(req: Request, res: Response) {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const user = await UserService.create(req.body);
      const { password, ...safeUser } = user; // remove password
      return res.status(201).json(safeUser);
    } catch (err: any) {
      console.error(err);
      if (err.message === "EmailExists") {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // PUT /users/:id
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

  // DELETE /users/:id
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

  // POST /users/login
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    try {
      const user = await UserService.login(email, password);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      return res.json(user); // password already removed in service
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // POST /users/verify-code
  async verifyCode(req: Request, res: Response) {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Missing fields" });

    try {
      const user = await UserService.verifyCode(email, code);
      if (!user) return res.status(400).json({ message: "Invalid code or email" });

      return res.json({ message: "User verified successfully", user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default UserController;