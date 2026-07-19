import type { GuideGender } from '../types';

export interface SecurityGuide {
  gender: GuideGender;
  name: string;
  idNo: string;
  rank: string;
  displayLine: string;
}

export const GUIDES: Record<GuideGender, SecurityGuide> = {
  female: {
    gender: 'female',
    name: 'SG. Priya',
    idNo: '010190073',
    rank: 'Security Guide',
    displayLine: 'SG. Priya · Id.No. 010190073',
  },
  male: {
    gender: 'male',
    name: 'SG. Arjun',
    idNo: '010190074',
    rank: 'Security Guide',
    displayLine: 'SG. Arjun · Id.No. 010190074',
  },
};

/** Pick male or female guide at random for each app opening */
export function pickRandomGuide(): GuideGender {
  return Math.random() < 0.5 ? 'male' : 'female';
}

export function getGuide(gender: GuideGender | null | undefined): SecurityGuide {
  return GUIDES[gender === 'male' ? 'male' : 'female'];
}

/** @deprecated use GUIDES.female — kept for older imports */
export const PRIYA = GUIDES.female;

export const AGILE_CONTACT = {
  phone: '18005995599',
  phoneAlt: '9248707070',
  email: 'recruitment@securityjob.co.in',
  site: 'https://www.securityjob.co.in',
  callbackHours: '24 hours',
};
