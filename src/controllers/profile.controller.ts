import { Request, Response } from "express";
import { ProfileService } from "../services/profile.services";

export class ProfileController {
  static async getProfile(req: Request, res: Response) {
    const userIdParam = req.params.user_id;

    if (Array.isArray(userIdParam)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user_id = parseInt(userIdParam, 10);
    if (isNaN(user_id)) return res.status(400).json({ message: "Invalid user ID" });

    const profile = await ProfileService.getProfile(user_id);
    if (!profile) return res.status(404).json({ message: "User not found" });

    res.json(profile);
  }
}