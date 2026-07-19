export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'as' | 'or';

/** Speech mode: auto-detect (Whisper) or force selected language */
export type SpeechMode = 'auto' | 'manual';

export type GuideGender = 'male' | 'female';

export type ApplicationStatus =
  | 'submitted'
  | 'recruiter_assigned'
  | 'contacted'
  | 'interview_scheduled'
  | 'selected'
  | 'ready_to_join'
  | 'joined'
  | 'rejected'
  | 'not_interested'
  | 'vacancy_closed';

export type VacancyStatus = 'open' | 'closing_soon' | 'closed';

export interface Consents {
  privacy: boolean;
  contact: boolean;
  whatsapp: boolean;
}

/**
 * EOI profile — same fields as securityjob.co.in register form.
 * API payload keys: name, phone, location, role, experience, education, language, photo
 */
export interface CandidateProfile {
  registrationNumber?: string;
  name: string;
  phone: string;
  location: string;
  role: string;
  experience: string;
  education: string;
  language: string;
  /** base64 data URL required by website */
  photo: string;
  consents: Consents;
}

export interface RegistrationQuestion {
  id: keyof CandidateProfile;
  field: keyof CandidateProfile;
  required: boolean;
  inputType: 'text' | 'phone' | 'select' | 'photo';
  optionsKey?: string;
}

export interface JobVacancy {
  id: string;
  position: string;
  clientSite: string;
  location: string;
  fullAddress: string;
  distanceKm: number;
  grossSalary: number;
  takeHomeSalary: number;
  takeHomeLabel: string;
  dutyHours: string;
  shift: string;
  epf: boolean;
  esic: boolean;
  accommodation: boolean;
  transport: boolean;
  food: boolean;
  overtime: string;
  weeklyOff: string;
  bonus: string;
  leave: string;
  ageRequirement: string;
  experienceRequirement: string;
  documentsRequired: string[];
  interviewProcess: string;
  joiningDate: string;
  recruiterName: string;
  recruiterPhone: string;
  vacancyStatus: VacancyStatus;
  branch: string;
  benefits: string[];
  source: 'securityjob.co.in' | 'cache' | 'sample';
}

export interface JobApplication {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  submittedAt: string;
}

export interface LibraryCategory {
  id: string;
  titleKey: string;
}

export interface LibraryFaq {
  id: string;
  categoryId: string;
  questionKey: string;
  answerKey: string;
}

export interface AppNotification {
  id: string;
  type:
    | 'new_job'
    | 'recruiter_contact'
    | 'interview'
    | 'status_change'
    | 'joining'
    | 'library';
  titleKey: string;
  bodyKey: string;
  createdAt: string;
  read: boolean;
}

export type RegistrationStepState =
  | 'idle'
  | 'listening'
  | 'review'
  | 'confirmed';

/** Exact payload posted by www.securityjob.co.in */
export interface SecurityJobRegisterPayload {
  name: string;
  phone: string;
  location: string;
  role: string;
  experience: string;
  education: string;
  language: string;
  photo: string;
}
