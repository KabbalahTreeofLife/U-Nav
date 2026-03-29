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

export const sampleEvents: Event[] = [
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
