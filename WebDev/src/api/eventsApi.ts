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
    isPinned?: boolean;
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
    isPinned?: boolean;
}

export interface UpdateEventRequest {
    title?: string;
    description?: string;
    room?: string;
    date?: string;
    time?: string;
    organizer?: string;
    category?: Event['category'];
    isPinned?: boolean;
}

interface EventsResponse {
    success: boolean;
    data?: {
        events?: Event[];
        event?: Event;
    };
    error?: string;
}

type EventsApiResult<T> = ResponseResult<T> & { data?: EventsResponse };

export const eventsApi = {
    getEvents: async (universityId?: number): Promise<ResponseResult<Event[]>> => {
        const url = universityId 
            ? `${API_ENDPOINTS.EVENTS.LIST}?university_id=${universityId}`
            : API_ENDPOINTS.EVENTS.LIST;
        
        const result = await apiClient.get<EventsResponse>(url) as EventsApiResult<EventsResponse>;
        if (result.success && result.data?.data?.events) {
            return { success: true, data: result.data.data.events };
        }
        return { success: false, error: result.data?.error || 'Failed to fetch events' };
    },

    getEvent: async (id: number): Promise<ResponseResult<Event>> => {
        const result = await apiClient.get<EventsResponse>(API_ENDPOINTS.EVENTS.GET(id)) as EventsApiResult<EventsResponse>;
        if (result.success && result.data?.data?.event) {
            return { success: true, data: result.data.data.event };
        }
        return { success: false, error: result.data?.error || 'Failed to fetch event' };
    },

    createEvent: async (event: CreateEventRequest, _userId?: number): Promise<ResponseResult<Event>> => {
        const result = await apiClient.post<EventsResponse>(
            API_ENDPOINTS.EVENTS.CREATE, 
            event
        ) as EventsApiResult<EventsResponse>;
        if (result.success && result.data?.data?.event) {
            return { success: true, data: result.data.data.event };
        }
        return { success: false, error: result.data?.error || 'Failed to create event' };
    },

    updateEvent: async (id: number, event: UpdateEventRequest, _userId?: number): Promise<ResponseResult<Event>> => {
        const result = await apiClient.put<EventsResponse>(
            API_ENDPOINTS.EVENTS.UPDATE(id), 
            event
        ) as EventsApiResult<EventsResponse>;
        if (result.success && result.data?.data?.event) {
            return { success: true, data: result.data.data.event };
        }
        return { success: false, error: result.data?.error || 'Failed to update event' };
    },

    deleteEvent: async (id: number, _userId?: number): Promise<ResponseResult<void>> => {
        return apiClient.delete<void>(
            API_ENDPOINTS.EVENTS.DELETE(id)
        );
    },
};
