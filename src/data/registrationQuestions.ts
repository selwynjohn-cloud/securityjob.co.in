import type { RegistrationQuestion } from '../types';

/** EOI order matching securityjob.co.in registration form */
export const REGISTRATION_QUESTIONS: RegistrationQuestion[] = [
  { id: 'name', field: 'name', required: true, inputType: 'text' },
  { id: 'phone', field: 'phone', required: true, inputType: 'phone' },
  {
    id: 'location',
    field: 'location',
    required: true,
    inputType: 'select',
    optionsKey: 'location',
  },
  {
    id: 'experience',
    field: 'experience',
    required: true,
    inputType: 'select',
    optionsKey: 'experience',
  },
  {
    id: 'role',
    field: 'role',
    required: true,
    inputType: 'select',
    optionsKey: 'role',
  },
  {
    id: 'education',
    field: 'education',
    required: false,
    inputType: 'select',
    optionsKey: 'education',
  },
  {
    id: 'language',
    field: 'language',
    required: false,
    inputType: 'select',
    optionsKey: 'primaryLang',
  },
  { id: 'photo', field: 'photo', required: true, inputType: 'photo' },
];

export const SITE_CITIES = [
  'Hyderabad',
  'Warangal',
  'Karimnagar',
  'Visakhapatnam',
  'Vijayawada',
  'Guntur',
  'Tirupati',
  'Bengaluru',
  'Mysuru',
  'Mangaluru',
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Mumbai',
  'Pune',
  'Nagpur',
  'Delhi',
  'Gurugram',
  'Noida',
  'Lucknow',
  'Kolkata',
  'Ahmedabad',
  'Surat',
  'Jaipur',
  'Kochi',
  'Thiruvananthapuram',
  'Bhubaneswar',
  'Indore',
  'Bhopal',
  'Guwahati',
  'Chandigarh',
  'Goa',
  'Patna',
  'Other',
] as const;

export const SITE_ROLES = [
  'Security Guard',
  'Lady Security Guard',
  'Security Officer',
  'Security Supervisor',
  'Armed Guard / PSO',
  'Personal Security Officer (PSO)',
  'Escort Guard',
  'Fire & Safety Guard',
  'CCTV Operator',
  'STF',
  'Driver',
  'Facility Attendant',
  'Admin Executive',
  'Admin Manager',
  'Accounts Executive',
  'Sales Co-ordinator',
  'Area Sales Manager (ASM)',
  'Operations Manager (OM)',
  'Regional Manager (RM)',
  'General Manager (GM)',
  'Assistant Vice President (AVP)',
  'Vice President (VP)',
  'Any Suitable Role',
] as const;

export const SITE_EXPERIENCE = [
  'Fresher',
  '1–3 years',
  '3–5 years',
  '5+ years',
] as const;

export const SITE_EDUCATION = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'ITI / Diploma',
  'Graduate',
  'Post Graduate',
  'Ex-Serviceman',
  'Other',
] as const;

export const SITE_LANGUAGES = [
  'Hindi',
  'English',
  'Telugu',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Assamese',
  'Marathi',
  'Other',
] as const;

export const QUESTION_OPTIONS: Record<
  string,
  { value: string; labelKey?: string; label?: string }[]
> = {
  location: SITE_CITIES.map((c) => ({ value: c, label: c })),
  experience: SITE_EXPERIENCE.map((c) => ({ value: c, label: c })),
  role: SITE_ROLES.map((c) => ({ value: c, label: c })),
  education: SITE_EDUCATION.map((c) => ({ value: c, label: c })),
  primaryLang: SITE_LANGUAGES.map((c) => ({ value: c, label: c })),
};

export const SAMPLE_VOICE_TRANSCRIPTS: Record<string, string> = {
  name: 'Ravi Kumar',
  phone: '9876543210',
  location: 'Hyderabad',
  experience: '1–3 years',
  role: 'Security Guard',
  education: '10th Pass',
  language: 'Hindi',
};
