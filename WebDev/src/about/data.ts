export interface UniversityInfo {
    id: number;
    name: string;
    description: string;
    website?: string;
    email?: string;
}

export const UNIVERSITY_INFO: { [key: number]: UniversityInfo } = {
    1: {
        id: 1,
        name: 'Central Philippine University',
        description: 'CPU is a leading institution dedicated to providing quality education and fostering academic excellence. Our comprehensive campus navigation system helps students and visitors efficiently explore our facilities.',
        website: 'cpu.edu.ph',
        email: 'info@cpu.edu.ph'
    },
    2: {
        id: 2,
        name: 'West Visayas State University',
        description: 'WVSU is committed to excellence in education and research. U-Nav provides seamless navigation across our modern campus facilities and amenities.',
        website: 'wvsu.edu.ph',
        email: 'info@wvsu.edu.ph'
    },
    3: {
        id: 3,
        name: 'University of the Philippines - Visayas',
        description: 'UP Visayas stands as a beacon of academic excellence. Our interactive navigation system helps the campus community discover and access world-class educational facilities.',
        website: 'upv.edu.ph',
        email: 'info@upv.edu.ph'
    },
    4: {
        id: 4,
        name: 'Western Institute of Technology',
        description: 'WIT is a premier technology-focused institution. Our campus navigation system reflects our commitment to innovation and student convenience.',
        website: 'wit.edu.ph',
        email: 'info@wit.edu.ph'
    },
    5: {
        id: 5,
        name: 'University of San Agustin',
        description: 'USA is dedicated to developing well-rounded individuals with strong moral and academic foundations. U-Nav supports our community in navigating our historic campus.',
        website: 'usa.edu.ph',
        email: 'info@usa.edu.ph'
    },
    6: {
        id: 6,
        name: 'Institute of Science and Technology University',
        description: 'ISATU is at the forefront of science and technology education. Our navigation system showcases our modern facilities and research centers.',
        website: 'isatu.edu.ph',
        email: 'info@isatu.edu.ph'
    }
};

export const getUniversityInfo = (universityId: number): UniversityInfo => {
    return UNIVERSITY_INFO[universityId] || UNIVERSITY_INFO[1]; // Default to CPU if not found
};
