import { apiClient } from './api';
import { buildMediaUrl } from './env';

export type YogaProgram = {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  iconKey: string;
  overview: string;
  details: string;
  benefits: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type YogaProgramsSectionContent = {
  title: string;
  description: string;
};

export type YogaChallenge = {
  id: string;
  title: string;
  desc: string;
  image: string;
  iconKey: string;
  days: string;
  level: string;
  category: string;
  color: string;
  overview: string;
  follow: string[];
  bestFor: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type YogaChallengesSectionContent = {
  eyebrow: string;
  title: string;
  description: string;
  quote: string;
};

export const fetchYogaPrograms = async () => {
  const response = await apiClient.get<YogaProgram[]>('/api/yoga-programs');
  return response.data;
};

export const fetchYogaProgramsSection = async () => {
  const response = await apiClient.get<YogaProgramsSectionContent>('/api/content/yoga-programs-section');
  return response.data;
};

export const fetchYogaChallenges = async () => {
  const response = await apiClient.get<YogaChallenge[]>('/api/yoga-challenges');
  return response.data;
};

export const fetchYogaChallengesSection = async () => {
  const response = await apiClient.get<YogaChallengesSectionContent>('/api/content/yoga-challenges-section');
  return response.data;
};

export const resolveYogaImageUrl = (value?: string | null) => {
  return buildMediaUrl(value);
};
