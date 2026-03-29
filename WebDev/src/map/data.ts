export interface Event {
    id: string;
    title: string;
    description: string;
    room: string;
    date: string;
    time: string;
    organizer: string;
    category: 'academic' | 'sports' | 'cultural' | 'social';
}

// CPU (ID: 1) Events
const CPU_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Engineering Fair 2026',
        description: 'Annual engineering exhibition showcasing student projects and innovations.',
        room: 'Engineering Building - Main Hall',
        date: '2026-04-15',
        time: '9:00 AM - 5:00 PM',
        organizer: 'College of Engineering',
        category: 'academic'
    },
    {
        id: '2',
        title: 'Basketball Tournament Finals',
        description: 'Inter-college basketball championship finals.',
        room: 'Sports Complex - Gymnasium',
        date: '2026-04-20',
        time: '2:00 PM - 6:00 PM',
        organizer: 'Athletics Office',
        category: 'sports'
    },
    {
        id: '3',
        title: 'Cultural Night',
        description: 'Annual cultural presentation featuring traditional dances and music.',
        room: 'Auditorium',
        date: '2026-04-25',
        time: '6:00 PM - 10:00 PM',
        organizer: 'Student Council',
        category: 'cultural'
    },
    {
        id: '4',
        title: 'Career Fair',
        description: 'Meet potential employers and explore career opportunities.',
        room: 'Student Center - Function Hall',
        date: '2026-05-01',
        time: '8:00 AM - 4:00 PM',
        organizer: 'Career Services',
        category: 'academic'
    },
    {
        id: '5',
        title: 'Welcome Week Social',
        description: 'Welcome gathering for new students.',
        room: 'Quad Area',
        date: '2026-05-10',
        time: '3:00 PM - 7:00 PM',
        organizer: 'Student Affairs',
        category: 'social'
    },
    {
        id: '6',
        title: 'Science Quiz Bowl',
        description: 'Inter-college science competition.',
        room: 'Science Building - Room 301',
        date: '2026-05-15',
        time: '1:00 PM - 5:00 PM',
        organizer: 'College of Science',
        category: 'academic'
    }
];

// ISATU (ID: 6) Events
const ISATU_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Tech Innovation Summit',
        description: 'Showcase of latest technological innovations and student projects.',
        room: 'Engineering Building - Auditorium',
        date: '2026-04-18',
        time: '9:00 AM - 4:00 PM',
        organizer: 'College of Engineering',
        category: 'academic'
    },
    {
        id: '2',
        title: 'ISATU Sports Day',
        description: 'Inter-department sports competition.',
        room: 'Sports Complex',
        date: '2026-04-22',
        time: '1:00 PM - 6:00 PM',
        organizer: 'Athletics Department',
        category: 'sports'
    },
    {
        id: '3',
        title: 'Science Expo 2026',
        description: 'Exhibition of scientific research and innovations.',
        room: 'Resource Center - Main Hall',
        date: '2026-05-05',
        time: '10:00 AM - 5:00 PM',
        organizer: 'College of Science',
        category: 'academic'
    }
];

// WVSU (ID: 2) Events
const WVSU_EVENTS: Event[] = [
    {
        id: '1',
        title: 'WVSU Education Forum',
        description: 'Forum discussing innovations in education.',
        room: 'Main Campus Building - Hall',
        date: '2026-04-16',
        time: '8:00 AM - 3:00 PM',
        organizer: 'College of Education',
        category: 'academic'
    },
    {
        id: '2',
        title: 'Volleyball Championship',
        description: 'Inter-college volleyball championship.',
        room: 'Sports Complex - Court 1',
        date: '2026-04-23',
        time: '2:00 PM - 7:00 PM',
        organizer: 'Sports Office',
        category: 'sports'
    }
];

// UPV (ID: 3) Events
const UPV_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Research Symposium',
        description: 'Presentation of academic research and studies.',
        room: 'Diliman Hall - Conference Room',
        date: '2026-04-17',
        time: '9:00 AM - 5:00 PM',
        organizer: 'Office of Research',
        category: 'academic'
    },
    {
        id: '2',
        title: 'UP Arts Festival',
        description: 'Festival celebrating arts and culture at UP.',
        room: 'Quadrangle',
        date: '2026-04-26',
        time: '5:00 PM - 11:00 PM',
        organizer: 'College of Arts',
        category: 'cultural'
    }
];

// WIT (ID: 4) Events
const WIT_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Tech Conference 2026',
        description: 'Annual technology conference featuring industry speakers.',
        room: 'Technology Building - Main Auditorium',
        date: '2026-04-19',
        time: '8:30 AM - 4:30 PM',
        organizer: 'Engineering Department',
        category: 'academic'
    },
    {
        id: '2',
        title: 'Robotics Competition',
        description: 'Student robotics teams compete in engineering challenges.',
        room: 'Research Center - Lab',
        date: '2026-05-02',
        time: '9:00 AM - 6:00 PM',
        organizer: 'Robotics Club',
        category: 'sports'
    }
];

// USA (ID: 5) Events
const USA_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Philosophy Seminar',
        description: 'Discussion on contemporary philosophical issues.',
        room: 'San Agustin Hall - Room 201',
        date: '2026-04-21',
        time: '10:00 AM - 1:00 PM',
        organizer: 'College of Liberal Arts',
        category: 'academic'
    },
    {
        id: '2',
        title: 'USA Cultural Show',
        description: 'Celebration of cultural heritage and traditions.',
        room: 'Auditorium',
        date: '2026-04-27',
        time: '6:30 PM - 9:30 PM',
        organizer: 'Student Organization',
        category: 'cultural'
    }
];

// Map of university ID to events
export const getEventsByUniversity = (universityId: number): Event[] => {
    const eventMap: { [key: number]: Event[] } = {
        1: CPU_EVENTS,
        2: WVSU_EVENTS,
        3: UPV_EVENTS,
        4: WIT_EVENTS,
        5: USA_EVENTS,
        6: ISATU_EVENTS,
    };
    return eventMap[universityId] || CPU_EVENTS; // Default to CPU if not found
};

export const sampleEvents: Event[] = CPU_EVENTS;

export const getCategoryColor = (category: Event['category']): string => {
    switch (category) {
        case 'academic':
            return '#3b82f6';
        case 'sports':
            return '#10b981';
        case 'cultural':
            return '#8b5cf6';
        case 'social':
            return '#f59e0b';
        default:
            return '#6b7280';
    }
};

export const getCategoryLabel = (category: Event['category']): string => {
    switch (category) {
        case 'academic':
            return 'Academic';
        case 'sports':
            return 'Sports';
        case 'cultural':
            return 'Cultural';
        case 'social':
            return 'Social';
        default:
            return category;
    }
};
