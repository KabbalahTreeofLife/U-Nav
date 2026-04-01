import { API_ENDPOINTS } from './config';
import { apiClient } from './client';
import type { ResponseResult } from './responseTypes';

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

interface EventsResponse {
    success: boolean;
    data?: {
        events?: Event[];
        event?: Event;
    };
    error?: string;
}

export const eventsApi = {
    getEvents: async (universityId?: number): Promise<ResponseResult<Event[]>> => {
        const url = universityId 
            ? `${API_ENDPOINTS.EVENTS.LIST}?university_id=${universityId}`
            : API_ENDPOINTS.EVENTS.LIST;
        
        const result = await apiClient.get<EventsResponse>(url);
        if (result.success && result.data) {
            return { success: true, data: result.data.data?.events || [] };
        }
        return { success: false, error: result.error || 'Failed to fetch events' };
    },

    getEvent: async (id: number): Promise<ResponseResult<Event>> => {
        const result = await apiClient.get<EventsResponse>(API_ENDPOINTS.EVENTS.GET(id));
        if (result.success && result.data) {
            return { success: true, data: result.data.data?.event };
        }
        return { success: false, error: result.error || 'Failed to fetch event' };
    },

    createEvent: async (event: CreateEventRequest): Promise<ResponseResult<Event>> => {
        const result = await apiClient.post<EventsResponse>(API_ENDPOINTS.EVENTS.CREATE, event);
        if (result.success && result.data) {
            return { success: true, data: result.data.data?.event };
        }
        return { success: false, error: result.error || 'Failed to create event' };
    },

    updateEvent: async (id: number, event: UpdateEventRequest): Promise<ResponseResult<Event>> => {
        const result = await apiClient.put<EventsResponse>(API_ENDPOINTS.EVENTS.UPDATE(id), event);
        if (result.success && result.data) {
            return { success: true, data: result.data.data?.event };
        }
        return { success: false, error: result.error || 'Failed to update event' };
    },

    deleteEvent: async (id: number): Promise<ResponseResult<void>> => {
        return apiClient.delete<void>(API_ENDPOINTS.EVENTS.DELETE(id));
    },
};