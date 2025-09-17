import { apiService } from "./apiService";

export const festivalParticipantsService = {
  getFestivalParticipantsByAccIdAndFeslId: async (
    festivalId: number,
    accountId: number
  ): Promise<any> => {
    try {
      const response = (await apiService.getFestivalparticipants(
        festivalId,
        accountId
      )) as any;
      return response || [];
    } catch (error) {
      console.error("Failed to load festival participants:", error);
      return [];
    }
  },

  getMyParticipatingFestivals: async (accountId: number): Promise<any> => {
    try {
      const response = (await apiService.getFestivalParticipantsByAccountId(
        accountId
      )) as any;
      return response || [];
    } catch (error) {
      console.error("Failed to load festival participants:", error);
      return [];
    }
  },

  createFestivalParticipant: async (
    festivalId: number,
    accountId: number
  ): Promise<any | null> => {
    try {
      const response = (await apiService.createFestivalparticipants(
        festivalId,
        accountId
      )) as any;

      return response || null;
    } catch (error) {
      console.error("Failed to create festival participant:", error);
      return null;
    }
  },

  deleteFestivalParticipant: async (
    festivalId: number,
    accountId: number
  ): Promise<boolean> => {
    try {
      const response = (await apiService.deleteFestivalparticipants(
        festivalId,
        accountId
      )) as any;
      //   return response || false;
      return true;
    } catch (error) {
      console.error("Failed to delete festival participant:", error);
      return false;
    }
  },
};
