import { API_ENDPOINTS } from './config';
import { apiClient } from './client';
import type { ResponseResult } from './responseTypes';

export interface DiningLocation {
    id: string;
    name: string;
    type: 'restaurant' | 'cafe' | 'mess' | 'snack';
    building: string;
    floor: number;
    operatingHours: string;
    priceRange: '$' | '$$' | '$$$';
    cuisine: string[];
    rating: number;
    imageUrl?: string;
    coordinates?: { x: number; y: number };
    universityId?: number;
    isFromDb?: boolean;
}

export interface CreateDiningRequest {
    universityId: number;
    name: string;
    type: DiningLocation['type'];
    building: string;
    floor: number;
    operatingHours: string;
    priceRange: DiningLocation['priceRange'];
    cuisine: string[];
    rating: number;
    imageUrl?: string;
    coordinates?: { x: number; y: number };
}

export interface UpdateDiningRequest {
    name?: string;
    type?: DiningLocation['type'];
    building?: string;
    floor?: number;
    operatingHours?: string;
    priceRange?: DiningLocation['priceRange'];
    cuisine?: string[];
    rating?: number;
    imageUrl?: string;
    coordinates?: { x: number; y: number };
}

interface DiningResponse {
    success: boolean;
    data?: {
        locations?: DiningLocation[];
        location?: DiningLocation;
    };
    error?: string;
}

type DiningApiResult<T> = ResponseResult<T> & { data?: DiningResponse };

export const diningApi = {
    getLocations: async (universityId?: number): Promise<ResponseResult<DiningLocation[]>> => {
        const url = universityId 
            ? `${API_ENDPOINTS.DINING.LIST}?university_id=${universityId}`
            : API_ENDPOINTS.DINING.LIST;
        
        const result = await apiClient.get<DiningResponse>(url) as DiningApiResult<DiningResponse>;
        if (result.success && result.data?.data?.locations) {
            return { success: true, data: result.data.data.locations };
        }
        return { success: false, error: result.data?.error || 'Failed to fetch dining locations' };
    },

    getLocation: async (id: number): Promise<ResponseResult<DiningLocation>> => {
        const result = await apiClient.get<DiningResponse>(API_ENDPOINTS.DINING.GET(id)) as DiningApiResult<DiningResponse>;
        if (result.success && result.data?.data?.location) {
            return { success: true, data: result.data.data.location };
        }
        return { success: false, error: result.data?.error || 'Failed to fetch dining location' };
    },

    createLocation: async (location: CreateDiningRequest, userId: number): Promise<ResponseResult<DiningLocation>> => {
        const result = await apiClient.post<DiningResponse>(
            API_ENDPOINTS.DINING.CREATE, 
            location,
            { headers: { 'x-user-id': userId.toString() } }
        ) as DiningApiResult<DiningResponse>;
        if (result.success && result.data?.data?.location) {
            return { success: true, data: result.data.data.location };
        }
        return { success: false, error: result.data?.error || 'Failed to create dining location' };
    },

    updateLocation: async (id: number, location: UpdateDiningRequest, userId: number): Promise<ResponseResult<DiningLocation>> => {
        const result = await apiClient.put<DiningResponse>(
            API_ENDPOINTS.DINING.UPDATE(id), 
            location,
            { headers: { 'x-user-id': userId.toString() } }
        ) as DiningApiResult<DiningResponse>;
        if (result.success && result.data?.data?.location) {
            return { success: true, data: result.data.data.location };
        }
        return { success: false, error: result.data?.error || 'Failed to update dining location' };
    },

    deleteLocation: async (id: number, userId: number): Promise<ResponseResult<void>> => {
        return apiClient.delete<void>(
            API_ENDPOINTS.DINING.DELETE(id),
            { headers: { 'x-user-id': userId.toString() } }
        );
    },
};
