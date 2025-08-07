

import React from 'react';

export interface Drill {
  drill_id: string;
  title: string;
  target_pm_level: PmLevel;
  skill_category: SkillCategory;
  core_scenario_text: string;
  stakeholder_1_role: string;
  stakeholder_1_quote: string;
  stakeholder_2_role: string;
  stakeholder_2_quote: string;
  stakeholder_3_role: string;
  stakeholder_3_quote: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  optimal_choice: 'A' | 'B' | 'C' | 'D';
  expert_analysis_text: string;
  rationale_for_a: string;
  rationale_for_b: string;
  rationale_for_c: string;
  rationale_for_d: string;
  peer_data_a: number;
  peer_data_b: number;
  peer_data_c: number;
  peer_data_d: number;
  strategic_alternative?: 'A' | 'B' | 'C' | 'D';
  strategic_alternative_rationale?: string;
}

export type PmLevel = "Associate PM (0-2 Yrs)" | "Product Manager (2-5 Yrs)" | "Senior PM (5+ Yrs)" | "Principal - Staff PM (9+ Yrs)";

export const PM_LEVELS: ReadonlyArray<PmLevel> = [
    "Associate PM (0-2 Yrs)",
    "Product Manager (2-5 Yrs)",
    "Senior PM (5+ Yrs)",
    "Principal - Staff PM (9+ Yrs)"
];

export type SkillCategory = "Strategic Thinking" | "Execution & Prioritization" | "Growth & Monetization" | "Technical Acumen" | "User Research & Empathy" | "Stakeholder Management";

export const SKILL_CATEGORIES: ReadonlyArray<SkillCategory> = [
    "Strategic Thinking",
    "Execution & Prioritization",
    "Growth & Monetization",
    "Technical Acumen",
    "User Research & Empathy",
    "Stakeholder Management"
];

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  pmLevel: PmLevel;
  plan: 'Free' | 'Plus' | 'Teams';
  createdAt: string;
}

export interface DrillAttempt {
  drillId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  confidence: number;
  calibrationScore: number;
  attemptedAt: string;
  nextShowAt: string;
  pmLevelAtAttempt?: PmLevel;
}

export interface UserProgress {
  userId: string;
  attempts: DrillAttempt[];
  savedDrills: string[];
  currentStreak: number;
  longestStreak: number;

  currentDailyStreak: number;
  longestDailyStreak: number;
  lastStreakDay: string | null;
  dailyDrillCompletions: {
    drillId: string;
    completedAt: string;
  }[];
  lastSeenStats?: {
    overallScore: number;
    longestDailyStreak: number;
    skillScores: Record<SkillCategory, number>;
  };
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface PricingPlan {
    name: string;
    recommended?: boolean;
    monthlyPrice: number | string;
    annualPrice: number | string;
    description: string;
    features: string[];
    ctaText: string;
    annualTag?: string;
}

export interface FaqItem {
    question: string;
    answer: React.ReactNode;
}

export interface BlogPost {
  id: string;
  title: string;
  publicationDate: string;
  author: string;
  summary: string;
  tags: string[];
  content: React.ReactNode;
}