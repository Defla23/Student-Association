import { UserRepository } from "../repository/user.repository";
import { NewUser,UpdateUser, User } from "../types/user.types";
import  bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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
    if(data.password){
      data.password = await bcrypt.hash(data.password, 10);
      console.log("Hashed password:", data.password);
    }
    
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
  if (!user) throw new Error("user not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("invalid credentials");

  const { password: _, ...safeUser } = user; // hide password
  return safeUser as User;


  const payload ={
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiry
  }
  const secret = process.env.JWT_SECRET as string;
  if(!secret) throw new Error("JWT secret not configured");
  const token = jwt.sign(payload, secret);
  return { 
    message: "Login successful",
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
    }
  };
},
  

  async verifyCode(email: string, code: string): Promise<User | null> {
    return UserRepository.verifyCode(email, code);
  }
};
