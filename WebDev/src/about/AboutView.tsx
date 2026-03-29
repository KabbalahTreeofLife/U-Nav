import React from 'react';
import { TopNav, BottomNav } from '../common';
import { useAuth } from '../common/AuthContext';
import { getUniversityInfo } from './data';
import '../css/About/About.css';

export const AboutView: React.FC = () => {
    const { universityId } = useAuth();
    const universityInfo = getUniversityInfo(universityId || 1);
    
    const teamMembers = [
        { name: 'Xanth Reign Palmes', role: 'Team Leader' },
        { name: 'Daniel Koen Parcon', role: 'Team Member' },
        { name: 'Marc Francis Billiones', role: 'Team Member' },
        { name: 'Marco Daniel Castillo', role: 'Team Member' },
        { name: 'Seth Dofeliz', role: 'Team Member' },
    ];

    return (
        <div className="about-container">
            <TopNav title="U-Nav" />
            <div className="about-content">
                <div className="about-header">
                    <h1 className="about-title">U-Nav</h1>
                    <p className="about-subtitle">University Navigation System</p>
                    <p className="about-version">Version 1.0.0</p>
                </div>

                <section className="about-section">
                    <h2>About {universityInfo.name}</h2>
                    <p>
                        {universityInfo.description}
                    </p>
                </section>

                <section className="about-section">
                    <h2>University Information</h2>
                    <div className="university-info-grid">
                        <div className="info-item">
                            <span className="info-label">University Name</span>
                            <span className="info-value">{universityInfo.name}</span>
                        </div>
                        {universityInfo.website && (
                            <div className="info-item">
                                <span className="info-label">Website</span>
                                <span className="info-value">{universityInfo.website}</span>
                            </div>
                        )}
                        {universityInfo.email && (
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{universityInfo.email}</span>
                            </div>
                        )}
                    </div>
                </section>

                <section className="about-section">
                    <h2>Features</h2>
                    <ul className="about-features">
                        <li>Interactive 3D Campus Map</li>
                        <li>Real-time Crowd/Congestion Tracking</li>
                        <li>Dining Guide with Campus Eateries</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>Team Members</h2>
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="team-card">
                                <div className="team-avatar">
                                    {member.name.charAt(0)}
                                </div>
                                <div className="team-info">
                                    <h3>{member.name}</h3>
                                    <p>{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="about-section">
                    <h2>Technology Stack</h2>
                    <div className="tech-stack">
                        <div className="tech-item">
                            <span className="tech-label">Frontend</span>
                            <span className="tech-value">React + TypeScript</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-label">Backend</span>
                            <span className="tech-value">Express.js + TypeScript</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-label">Database</span>
                            <span className="tech-value">PostgreSQL</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-label">3D Graphics</span>
                            <span className="tech-value">Three.js</span>
                        </div>
                    </div>
                </section>

                <section className="about-section about-contact">
                    <h2>Contact {universityInfo.name}</h2>
                    <p>For questions or feedback, reach out to the development team or university administration.</p>
                    {universityInfo.email && <p className="about-email">{universityInfo.email}</p>}
                </section>

                <div className="about-footer">
                    <p>&copy; 2026 U-Nav. All rights reserved.</p>
                    <p>Built for Introduction to Engineering Design</p>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default AboutView;
