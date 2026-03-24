import { ProfileRepository } from "../repository/profile.repository";
import { UserProfile } from "../types/profile.types";

export class ProfileService {
  static async getProfile(user_id: number): Promise<UserProfile | null> {
    const profile = await ProfileRepository.getProfile(user_id);
    return profile;
  }
}