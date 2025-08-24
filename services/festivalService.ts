import { Festival, FestivalBasic, School } from '../types';
import { apiService } from './apiService';

export const festivalService = {
  getAllFestivals: async (): Promise<FestivalBasic[]> => {
    try {
      const response = await apiService.getAllFestivals() as FestivalBasic[];
      return response || [];
    } catch (error) {
      console.error('Failed to load festivals:', error);
      return [];
    }
  },

  getFestivalById: async (id: number): Promise<Festival | null> => {
    try {
      const response = await apiService.getFestivalById(id) as Festival;
      return response || null;
    } catch (error) {
      console.error('Failed to load festival detail:', error);
      return null;
    }
  },

  getSchoolById: async (id: number): Promise<School | null> => {
    try {
      const response = await apiService.getSchoolById(id) as School[];
      return response?.[0] || null;
    } catch (error) {
      console.error('Failed to load school:', error);
      return null;
    }
  },

  getActiveFestivals: async (): Promise<FestivalBasic[]> => {
    try {
      const festivals = await festivalService.getAllFestivals();
      return festivals.filter(f => f.status === 'published');
    } catch (error) {
      console.error('Failed to load active festivals:', error);
      return [];
    }
  }
};