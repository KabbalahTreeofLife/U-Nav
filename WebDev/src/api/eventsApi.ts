import { API_ENDPOINTS } from './config';
import type { ResponseResult } from './responseHelper';

export interface Event {
    id: string;
    title: string;
    description: string;
    room: string;
    date: string;
    time: string;
    organizer: string;
    category: 'academic' | 'sports' | 'cultural' | 'social';
    universityId?: number;
    isFromDb?: boolean;
}

export interface CreateEventRequest {
    universityId: number;
    title: string;
    description: string;
    room: string;
    date: string;
    time: string;
    organizer: string;
    category: Event['category'];
}

export interface UpdateEventRequest {
    title?: string;
    description?: string;
    room?: string;
    date?: string;
    time?: string;
    organizer?: string;
    category?: Event['category'];
}

export const eventsApi = {
    getEvents: async (universityId?: number): Promise<ResponseResult<Event[]>> => {
        try {
            const url = universityId 
                ? `${API_ENDPOINTS.EVENTS.LIST}?university_id=${universityId}`
                : API_ENDPOINTS.EVENTS.LIST;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            const data = await response.json();
            return { success: true, data: data.data?.events || [] };
        } catch (error) {
            return { success: false, error: 'Failed to fetch events' };
        }
    },

    getEvent: async (id: number): Promise<ResponseResult<Event>> => {
        try {
            const response = await fetch(API_ENDPOINTS.EVENTS.GET(id));
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            const data = await response.json();
            return { success: true, data: data.data?.event };
        } catch (error) {
            return { success: false, error: 'Failed to fetch event' };
        }
    },

    createEvent: async (event: CreateEventRequest): Promise<ResponseResult<Event>> => {
        try {
            const response = await fetch(API_ENDPOINTS.EVENTS.CREATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            const data = await response.json();
            return { success: true, data: data.data?.event };
        } catch (error) {
            return { success: false, error: 'Failed to create event' };
        }
    },

    updateEvent: async (id: number, event: UpdateEventRequest): Promise<ResponseResult<Event>> => {
        try {
            const response = await fetch(API_ENDPOINTS.EVENTS.UPDATE(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            const data = await response.json();
            return { success: true, data: data.data?.event };
        } catch (error) {
            return { success: false, error: 'Failed to update event' };
        }
    },

    deleteEvent: async (id: number): Promise<ResponseResult<void>> => {
        try {
            const response = await fetch(API_ENDPOINTS.EVENTS.DELETE(id), {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                return { success: false, error: errorData.error };
            }
            
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: 'Failed to delete event' };
        }
    },
};
