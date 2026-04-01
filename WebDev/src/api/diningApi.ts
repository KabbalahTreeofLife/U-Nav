import { API_ENDPOINTS } from './config';
import type { ResponseResult } from './responseHelper';

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

export const diningApi = {
    getLocations: async (universityId?: number): Promise<ResponseResult<DiningLocation[]>> => {
        try {
            const url = universityId 
                ? `${API_ENDPOINTS.DINING.LIST}?university_id=${universityId}`
                : API_ENDPOINTS.DINING.LIST;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            const data = await response.json();
            return { success: true, data: data.data?.locations || [] };
        } catch (error) {
            return { success: false, error: 'Failed to fetch dining locations' };
        }
    },

    getLocation: async (id: number): Promise<ResponseResult<DiningLocation>> => {
        try {
            const response = await fetch(API_ENDPOINTS.DINING.GET(id));
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            const data = await response.json();
            return { success: true, data: data.data?.location };
        } catch (error) {
            return { success: false, error: 'Failed to fetch dining location' };
        }
    },

    createLocation: async (location: CreateDiningRequest): Promise<ResponseResult<DiningLocation>> => {
        try {
            const response = await fetch(API_ENDPOINTS.DINING.CREATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(location),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            const data = await response.json();
            return { success: true, data: data.data?.location };
        } catch (error) {
            return { success: false, error: 'Failed to create dining location' };
        }
    },

    updateLocation: async (id: number, location: UpdateDiningRequest): Promise<ResponseResult<DiningLocation>> => {
        try {
            const response = await fetch(API_ENDPOINTS.DINING.UPDATE(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(location),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            const data = await response.json();
            return { success: true, data: data.data?.location };
        } catch (error) {
            return { success: false, error: 'Failed to update dining location' };
        }
    },

    deleteLocation: async (id: number): Promise<ResponseResult<void>> => {
        try {
            const response = await fetch(API_ENDPOINTS.DINING.DELETE(id), {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: 'Failed to delete dining location' };
        }
    },
};
