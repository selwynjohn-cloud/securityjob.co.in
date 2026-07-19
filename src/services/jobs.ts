import type { JobVacancy } from '../types';
import { fetchLiveVacancies } from './vacancies';

let cache: JobVacancy[] = [];

export async function loadJobs(): Promise<JobVacancy[]> {
  cache = await fetchLiveVacancies();
  return cache;
}

export function getRecommendedJobs(limit = 3): JobVacancy[] {
  return (cache.length ? cache : []).slice(0, limit);
}

export function getJobById(id: string): JobVacancy | undefined {
  return cache.find((j) => j.id === id);
}

export async function getRecommendedJobsAsync(limit = 3): Promise<JobVacancy[]> {
  const list = await loadJobs();
  return list.slice(0, limit);
}

export async function getJobByIdAsync(id: string): Promise<JobVacancy | undefined> {
  if (!cache.length) await loadJobs();
  return getJobById(id);
}
