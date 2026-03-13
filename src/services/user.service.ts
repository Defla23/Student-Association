import { UserRepository } from "../repository/user.repository";
import { NewUser, User } from "../types/user.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../mailer/mailer";
import { emailTemplate } from "../mailer/emailtemplate";

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

  async create(data: NewUser): Promise<User & { verification_code: string }> {
    const existing = await UserRepository.getByEmail(data.email);
    if (existing) throw new Error("EmailExists");

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await UserRepository.create(data);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await UserRepository.setVerificationCode(user.email, verificationCode, expiry);

    try {
      await sendEmail(
        user.email,
        "Verify Your Account",
        emailTemplate.verify(user.first_name, verificationCode)
      );
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    return {
      ...user,
      verification_code: verificationCode,
    };
  },

  async update(id: number, data: Partial<NewUser & { is_active?: boolean }>): Promise<User | null> {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return UserRepository.update(id, data as any);
  },

  async delete(id: number): Promise<void> {
    return UserRepository.deleteUser(id);
  },

  async login(email: string, password: string): Promise<LoginPayload> {
    const user = await UserRepository.getByEmail(email);
    if (!user) throw new Error("user not found");
    if (!user.is_verified) throw new Error("Please verify your email first");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("invalid credentials");

    const payload = { sub: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + 3600 };
    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error("JWT secret not configured");

    const token = jwt.sign(payload, secret);
    const { password: _, ...safeUser } = user;

    return { message: "Login successful", token, user: safeUser };
  },

  async verifyCode(email: string, verification_code: string): Promise<User> {
    const user = await UserRepository.getByEmail(email);
    if (!user) throw new Error("User not found");
    if (!user.verification_code) throw new Error("User already verified");

    const now = new Date();
    if (!user.verification_code_expiry || user.verification_code_expiry < now) throw new Error("Verification code expired");
    if (user.verification_code !== verification_code) throw new Error("Invalid verification code");

    const verifiedUser = await UserRepository.verifyCode(email, verification_code);
    if (!verifiedUser) throw new Error("Verification failed");

    return verifiedUser;
  },
};