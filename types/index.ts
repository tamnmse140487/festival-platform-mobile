export interface User {
  id: number;
  email: string;
  fullName: string;
  className: string | null;
  phoneNumber: string;
  roleId: number;
  avatarUrl: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
  walletId: number | null;
  balance: number | null;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  message: string | null;
  id: number;
  userName: string;
  fullName: string;
  role: string;
  statusCode: number;
}

export interface School {
  schoolId: number;
  accountId: number;
  schoolName: string;
  address: string;
  contactInfo: string;
  logoUrl: string;
  description: string;
}

export interface FestivalImage {
  imageId: number;
  imageUrl: string;
  imageName: string;
  createdAt: string;
  festivalId: number;
}

export interface Location {
  locationId: number;
  mapId: number;
  locationName: string;
  locationType: string;
  isOccupied: boolean;
  coordinates: string;
  createdAt: string;
}

export interface FestivalMap {
  mapId: number;
  festivalId: number;
  mapName: string;
  mapType: string;
  mapUrl: string;
  createdAt: string;
  locations: Location[];
}

export interface MenuItem {
  itemId: number;
  menuId: number;
  itemName: string;
  description: string;
  itemType: 'food' | 'beverage';
  minPrice: number;
  maxPrice: number;
  status: string;
  createdAt: string;
}

export interface FestivalMenu {
  menuId: number;
  festivalId: number;
  menuName: string;
  description: string;
  createdAt: string;
  menuItems: MenuItem[];
}

export interface FestivalBasic {
  festivalId: number;
  schoolId: number;
  festivalName: string;
  theme: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  location: string;
  maxFoodBooths: number;
  maxBeverageBooths: number;
  registeredFoodBooths: number;
  registeredBeverageBooths: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed' | 'ongoing';
  totalRevenue: number;
  description: string;
  cancellationReason: string | null;
  totalRegisteredParticipants: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface Festival extends FestivalBasic {
  images: FestivalImage[];
  festivalMaps: FestivalMap[];
  festivalMenus: FestivalMenu[];
}

export interface Booth {
  boothId: number;
  groupId: number;
  festivalId: number;
  locationId: number;
  boothName: string;
  boothType: 'food' | 'beverage';
  description: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  approvalDate: string;
}

export interface BoothMenuItem {
  boothMenuItemId: number;
  boothId: number;
  menuItemId: number;
  customPrice: number;
  quantityLimit: number;
  remainingQuantity: number | null;
  status?: string;
  menuItem: MenuItem;
}

export interface BoothImage {
  imageId: number;
  imageUrl: string;
  imageName: string;
  boothMenuItemId: number;
}