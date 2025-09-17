import { apiService } from "./newApiService";

export interface Review {
  id: number;
  festivalId: number;
  accountId: number;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewCreatePayload {
  festivalId: number;
  accountId: number;
  rating: number;
  comment: string;
}

export interface ReviewUpdatePayload {
  reviewId: number;
  rating?: number;
  comment?: string;
}

export const reviewsService = {
  create(payload: ReviewCreatePayload) {
    return apiService.post("/reviews/create", payload);
  },

  update({ reviewId, rating, comment }: ReviewUpdatePayload) {
    return apiService.put("/reviews/update", undefined, {
      query: { reviewId, rating, comment },
    });
  },

  getByFestivalId(festivalId: number) {
    return apiService.get<Review[]>("/reviews/search", { query: { festivalId } });
  },

  delete(reviewId: number) {
    return apiService.delete("/reviews/delete", undefined, {
      query: { reviewId },
    });
  },
};
