import { UserRepository } from "../repository/user.repository";
import { NewUser,UpdateUser, User } from "../types/user.types";

export const UserService = {
  async list(): Promise<User[]> {
    return UserRepository.getAll();
  },

  async get(id: number): Promise<User | null> {
    return UserRepository.getById(id);
  },

  async create(data: NewUser): Promise<User> {
    // Basic uniqueness check
    const existing = await UserRepository.getByEmail(data.email);
    if (existing) throw new Error("EmailExists");
    // NOTE: password should be hashed here in production
    return UserRepository.create(data);
  },

  async update(id: number, data: Partial<NewUser & { is_active?: boolean }>): Promise<User | null> {
    return UserRepository.update(id, data as any);
  },

  async delete(id: number): Promise<void> {
    return UserRepository.deleteUser(id);
  },

  async login(email: string, password: string): Promise<User | null> {
    const user = await UserRepository.getByEmail(email);
    if (!user) return null;
    // plaintext comparison for now — replace with bcrypt.compare in production
    if (user.password !== password) return null;
    // remove password before returning
    // @ts-ignore
    delete user.password;
    return user;
  },

  async verifyCode(email: string, code: string): Promise<User | null> {
    return UserRepository.verifyCode(email, code);
  }
};
