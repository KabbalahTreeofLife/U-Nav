import React from 'react';
import { TopNav, BottomNav } from '../common';
import { TEAM_MEMBERS } from './data';
import '../css/About/About.css';

export const AboutView: React.FC = () => {
    return (
        <div className="about-container">
            <TopNav showLogo={true} />
            <div className="about-content">
                <div className="about-header">
                    <div className="about-title-section">
                        <img src="/Unav_Logo.png" alt="U-Nav Logo" className="about-logo" />
                        <h1 className="about-title">U-Nav</h1>
                    </div>
                    <p className="about-subtitle">University Navigation System</p>
                    <p className="about-version">Version 1.0.0</p>
                </div>

                <section className="about-section">
                    <h2>About U-Nav</h2>
                    <p>
                        U-Nav is a comprehensive campus navigation application designed to help students and visitors 
                        efficiently navigate university campuses. It provides interactive maps, dining guides, events calendar, 
                        and real-time crowd tracking to enhance the campus experience.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Features</h2>
                    <ul className="about-features">
                        <li>Interactive 3D/2D Campus Map</li>
                        <li>Real-time Crowd/Congestion Heat Map</li>
                        <li>Dining Guide with Campus Eateries</li>
                        <li>Events Calendar by Category</li>
                        <li>User Authentication with University Email</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>Team Members</h2>
                    <div className="team-grid">
                        {TEAM_MEMBERS.map((member, index) => (
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
                            <span className="tech-value">React + TypeScript + Vite</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-label">3D Graphics</span>
                            <span className="tech-value">React Three Fiber + Three.js</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-label">Backend</span>
                            <span className="tech-value">Express.js + TypeScript</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-label">Database</span>
                            <span className="tech-value">Supabase (PostgreSQL)</span>
                        </div>
                    </div>
                </section>

                <section className="about-section about-contact">
                    <h2>Contact Us</h2>
                    <p>For questions or feedback, reach out to the development team.</p>
                    <p className="about-email">team@unav.edu.ph</p>
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
