export enum CandidateStatus {
  NEW = 'New',
  CONTACT_ATTEMPTED = 'Contact Attempted',
  VOICEMAIL_LEFT = 'Voicemail Left',
  INTERVIEW_SCHEDULED = 'Interview Scheduled',
  REJECTED = 'Rejected',
  HIRED = 'Hired'
}

export type ScorecardStatus = 'Pass' | 'Concern' | 'Fail' | undefined;

export interface ScorecardItem {
  status: ScorecardStatus;
  notes: string;
}

export interface Scorecard {
  salesExperience: ScorecardItem;
  performanceAccountability: ScorecardItem;
  motivationStability: ScorecardItem;
  licensing: ScorecardItem;
  transportation: ScorecardItem;
  bilingual: ScorecardItem;
  evaluationTolerance: ScorecardItem;
  finalNotes: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  initialNotes: string;
  status: CandidateStatus;
  lastContactDate?: string; // ISO String
  scheduledDate?: string; // ISO String
  scorecard?: Scorecard;
}

export interface FilterState {
  role: string;
  city: string;
  status: string;
  search: string;
}
