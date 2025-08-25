import { User } from "../types";
import { apiService } from "./apiService";

interface UpdateUserData {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  status: boolean;
  updatedAt: string;
  className: string;
}

export const accountService = {
  updateProfile: async (
    userId: number,
    userData: UpdateUserData
  ): Promise<boolean> => {
    try {
      const response = await apiService.updateUser(userId, userData);
      if (!response.success) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return false;
    }
  },

  changePassword: async (
    accountId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await apiService.updatePassword(
        accountId,
        oldPassword,
        newPassword
      );
      if (!response.success) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to change password:", error);
      return false;
    }
  },
};
