import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JobVacancy } from '../types';

const HOME_URL = 'https://www.securityjob.co.in/';
const CACHE_KEY = 'securityjob.vacancies.cache';

const FALLBACK: JobVacancy[] = [
  {
    id: 'sj-tirupati',
    position: 'Security Guard',
    clientSite: 'Near Airport',
    location: 'Tirupati',
    fullAddress: 'Near Airport, Tirupati',
    distanceKm: 0,
    grossSalary: 21000,
    takeHomeSalary: 21000,
    takeHomeLabel: 'Rs. 21000/-',
    dutyHours: 'As per site',
    shift: 'As per roster',
    epf: true,
    esic: true,
    accommodation: true,
    transport: false,
    food: false,
    overtime: 'As applicable',
    weeklyOff: 'As per site',
    bonus: 'Performance incentives',
    leave: 'As per policy',
    ageRequirement: 'As per site',
    experienceRequirement: 'Fresher / experienced',
    documentsRequired: ['Aadhaar', 'Photos', 'Bank details'],
    interviewProcess: 'Branch screening after free registration',
    joiningDate: 'As advised by recruiter',
    recruiterName: 'Agile Recruitment',
    recruiterPhone: '18005995599',
    vacancyStatus: 'open',
    branch: 'Tirupati',
    benefits: ['ESI & PF', 'Timely wages', 'Career growth'],
    source: 'sample',
  },
  {
    id: 'sj-hyd-hitech',
    position: 'Security Guard',
    clientSite: 'Hi-Tech City',
    location: 'Hyderabad',
    fullAddress: 'Hi-Tech City, Hyderabad',
    distanceKm: 0,
    grossSalary: 21000,
    takeHomeSalary: 21000,
    takeHomeLabel: 'Rs. 21,000/-',
    dutyHours: 'As per site',
    shift: 'As per roster',
    epf: true,
    esic: true,
    accommodation: true,
    transport: false,
    food: false,
    overtime: 'As applicable',
    weeklyOff: 'As per site',
    bonus: 'Performance incentives',
    leave: 'As per policy',
    ageRequirement: 'As per site',
    experienceRequirement: 'Fresher / experienced',
    documentsRequired: ['Aadhaar', 'Photos', 'Bank details'],
    interviewProcess: 'Branch screening after free registration',
    joiningDate: 'As advised by recruiter',
    recruiterName: 'Agile Recruitment',
    recruiterPhone: '18005995599',
    vacancyStatus: 'open',
    branch: 'Hyderabad',
    benefits: ['ESI & PF', 'Timely wages', 'Career growth'],
    source: 'sample',
  },
  {
    id: 'sj-zaheerabad',
    position: 'Security Guard',
    clientSite: 'Zaheerabad',
    location: 'Hyderabad',
    fullAddress: 'Zaheerabad, Hyderabad',
    distanceKm: 0,
    grossSalary: 16500,
    takeHomeSalary: 16500,
    takeHomeLabel: 'Rs. 16,500/-',
    dutyHours: 'As per site',
    shift: 'As per roster',
    epf: true,
    esic: true,
    accommodation: true,
    transport: false,
    food: false,
    overtime: 'As applicable',
    weeklyOff: 'Compulsory weekly off possible',
    bonus: 'Monthly bonus as applicable',
    leave: 'As per policy',
    ageRequirement: 'As per site',
    experienceRequirement: 'Fresher / experienced',
    documentsRequired: ['Aadhaar', 'Photos', 'Bank details'],
    interviewProcess: 'Branch screening after free registration',
    joiningDate: 'As advised by recruiter',
    recruiterName: 'Agile Recruitment',
    recruiterPhone: '18005995599',
    vacancyStatus: 'open',
    branch: 'Hyderabad',
    benefits: ['Free Accommodation', 'ESI & PF', 'Weekly Off'],
    source: 'sample',
  },
];

function parseSalary(label: string): number {
  const digits = label.replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

/** Parse job cards from securityjob.co.in homepage HTML */
export function parseOpeningsFromHtml(html: string): JobVacancy[] {
  const sectionMatch = html.match(
    /id=["']openings["'][\s\S]*?(?=<section|id=["']register["']|$)/i,
  );
  const chunk = sectionMatch?.[0] ?? html;
  const cards = [
    ...chunk.matchAll(
      /<h3>([^<]+)<\/h3>\s*<div class="jloc">([^<]+)<\/div>[\s\S]*?<div class="jwage">[\s\S]*?<b>([^<]+)<\/b>/gi,
    ),
  ];

  if (!cards.length) return [];

  return cards.map((m, i) => {
    const position = m[1].trim();
    const locRaw = m[2].replace(/📍/g, '').trim();
    const wageLabel = m[3].trim();
    const salary = parseSalary(wageLabel);
    const parts = locRaw.split(',').map((s) => s.trim());
    const location = parts[parts.length - 1] || locRaw;
    const site = parts.slice(0, -1).join(', ') || locRaw;

    return {
      id: `sj-live-${i}-${location.replace(/\s+/g, '-').toLowerCase()}`,
      position,
      clientSite: site,
      location,
      fullAddress: locRaw,
      distanceKm: 0,
      grossSalary: salary,
      takeHomeSalary: salary,
      takeHomeLabel: wageLabel,
      dutyHours: 'As per site',
      shift: 'As per roster',
      epf: true,
      esic: true,
      accommodation: true,
      transport: false,
      food: false,
      overtime: 'As applicable',
      weeklyOff: 'As per site',
      bonus: 'As per site benefits',
      leave: 'As per policy',
      ageRequirement: 'As per site',
      experienceRequirement: 'See securityjob.co.in',
      documentsRequired: ['Aadhaar', 'Photos', 'Bank details'],
      interviewProcess: 'Register free on Security Job — recruiter will contact you',
      joiningDate: 'As advised',
      recruiterName: 'Agile Recruitment',
      recruiterPhone: '18005995599',
      vacancyStatus: 'open' as const,
      branch: location,
      benefits: [],
      source: 'securityjob.co.in' as const,
    };
  });
}

export async function fetchLiveVacancies(): Promise<JobVacancy[]> {
  try {
    const res = await fetch(HOME_URL, {
      headers: { Accept: 'text/html' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const parsed = parseOpeningsFromHtml(html);
    if (parsed.length) {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
      return parsed;
    }
  } catch {
    // fall through to cache / fallback
  }

  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw) as JobVacancy[];
      if (cached.length) {
        return cached.map((j) => ({ ...j, source: 'cache' as const }));
      }
    }
  } catch {
    // ignore
  }

  return FALLBACK;
}

/** Short spoken line — keep TTS brief. */
export function vacanciesSpokenSummary(jobs: JobVacancy[]): string {
  if (!jobs.length) {
    return 'Open jobs are waiting. Register free to apply.';
  }
  const top = jobs.slice(0, 2);
  const bits = top.map((j) => `${j.position} in ${j.location}`);
  return `Open now: ${bits.join(', ')}. Register free.`;
}

/** Max 3 for suitable-jobs screen */
export function getRecommendedJobs(limit = 3): Promise<JobVacancy[]> {
  return fetchLiveVacancies().then((list) => list.slice(0, limit));
}

export function getJobByIdSync(
  id: string,
  list: JobVacancy[],
): JobVacancy | undefined {
  return list.find((j) => j.id === id);
}
