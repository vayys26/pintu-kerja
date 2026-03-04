/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship';
  category: string;
  description: string;
  requirements: string[];
  logo: string;
  verified: boolean;
  postedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  title: string;
  interests: string[];
  bio: string;
  videoIntroUrl?: string;
  completionScore: number;
  role: UserRole;
  location?: string;
  isLoggedIn: boolean;
  experience: Experience[];
}

export type UserRole = 'applicant' | 'employer';

export interface Application {
  id: string;
  jobId: string;
  status: 'Terkirim' | 'Review' | 'Interview' | 'Ditolak';
  appliedAt: string;
}

export type ViewState = 'splash' | 'role-selection' | 'applicant-reg' | 'employer-reg' | 'main' | 'detail' | 'post-job' | 'edit-profile' | 'chat' | 'edit-experience';
export type TabState = 'home' | 'explore' | 'applications' | 'profile' | 'employer-dashboard';
