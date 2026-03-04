import { UserRepository } from "../repository/user.repository";
import { NewUser, UpdateUser, User } from "../types/user.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Type for login payload
export interface LoginPayload {
  message: string;
  token: string;
  user: Omit<User, "password">;
}

export const UserService = {
  async list(): Promise<User[]> {
    return UserRepository.getAll();
  },

  async get(id: number): Promise<User | null> {
    return UserRepository.getById(id);
  },

  async create(data: NewUser): Promise<User> {
    // Check if email already exists
    const existing = await UserRepository.getByEmail(data.email);
    if (existing) throw new Error("EmailExists");

    // Hash password
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return UserRepository.create(data);
  },

  async update(
    id: number,
    data: Partial<NewUser & { is_active?: boolean }>
  ): Promise<User | null> {
    // Hash password if it exists in update
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return UserRepository.update(id, data as any);
  },

  async delete(id: number): Promise<void> {
    return UserRepository.deleteUser(id);
  },

  async login(email: string, password: string): Promise<LoginPayload> {
    const user = await UserRepository.getByEmail(email);
    if (!user) throw new Error("user not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("invalid credentials");

    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    };

    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error("JWT secret not configured");

    const token = jwt.sign(payload, secret);

    // Hide password
    const { password: _, ...safeUser } = user;

    return {
      message: "Login successful",
      token,
      user: safeUser,
    };
  },

  async verifyCode(email: string, code: string): Promise<User | null> {
    return UserRepository.verifyCode(email, code);
  },
};