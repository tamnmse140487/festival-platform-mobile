import { Booth, BoothMenuItem, BoothImage } from '../types';
import { apiService } from './apiService';

export const boothService = {
  getBoothByLocationId: async (locationId: number): Promise<Booth | null> => {
    try {
      const response = await apiService.getBoothByLocationId(locationId) as Booth[];
      return response?.[0] || null;
    } catch (error) {
      console.error('Failed to load booth:', error);
      return null;
    }
  },

  getBoothMenuItems: async (boothId: number): Promise<BoothMenuItem[]> => {
    try {
      const response = await apiService.getBoothMenuItems(boothId) as BoothMenuItem[];
      return response || [];
    } catch (error) {
      console.error('Failed to load booth menu items:', error);
      return [];
    }
  },

  getBoothMenuItemImages: async (boothMenuItemId: number): Promise<BoothImage[]> => {
    try {
      const response = await apiService.getBoothMenuItemImages(boothMenuItemId) as BoothImage[];
      return response || [];
    } catch (error) {
      console.error('Failed to load booth menu item images:', error);
      return [];
    }
  }
};