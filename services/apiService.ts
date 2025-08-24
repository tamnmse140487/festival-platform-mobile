const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        return { success: false, message: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error(`API Error - ${endpoint}:`, error);
      return { success: false, message: error.message || "Unknown error" };
    }
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getUserById(id: number) {
    return this.request(`/accounts/search?id=${id}`);
  }

  async getAllFestivals() {
    return this.request("/festivals/search");
  }

  async getFestivalById(id: number) {
    return this.request(`/festivals/${id}`);
  }

  async getFestivalImages(festivalId: number) {
    return this.request(`/images/search?festivalId=${festivalId}`);
  }

  async getSchoolById(id: number) {
    return this.request(`/schools/search?id=${id}`);
  }

  async getBoothByLocationId(locationId: number) {
    return this.request(`/booths/search?locationId=${locationId}`);
  }

  async getBoothMenuItems(boothId: number) {
    return this.request(`/boothmenuitems/search?boothId=${boothId}`);
  }

  async getBoothMenuItemImages(boothMenuItemId: number) {
    return this.request(`/images/search?boothMenueItemid=${boothMenuItemId}`);
  }

  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  private defaultHeaders: Record<string, string> = {};
}

export const apiService = new ApiService();
