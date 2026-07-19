import type { LibraryCategory, LibraryFaq } from '../types';

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  { id: 'duties', titleKey: 'library.categories.duties' },
  { id: 'uniform', titleKey: 'library.categories.uniform' },
  { id: 'salary', titleKey: 'library.categories.salary' },
  { id: 'epf', titleKey: 'library.categories.epf' },
  { id: 'leave', titleKey: 'library.categories.leave' },
  { id: 'conduct', titleKey: 'library.categories.conduct' },
  { id: 'emergency', titleKey: 'library.categories.emergency' },
  { id: 'fire', titleKey: 'library.categories.fire' },
  { id: 'access', titleKey: 'library.categories.access' },
  { id: 'visitor', titleKey: 'library.categories.visitor' },
  { id: 'patrol', titleKey: 'library.categories.patrol' },
  { id: 'incident', titleKey: 'library.categories.incident' },
  { id: 'women', titleKey: 'library.categories.women' },
  { id: 'grievance', titleKey: 'library.categories.grievance' },
  { id: 'documents', titleKey: 'library.categories.documents' },
  { id: 'career', titleKey: 'library.categories.career' },
];

export const LIBRARY_FAQS: LibraryFaq[] = [
  {
    id: 'faq-1',
    categoryId: 'duties',
    questionKey: 'library.sampleQ1',
    answerKey: 'library.sampleA1',
  },
  {
    id: 'faq-2',
    categoryId: 'epf',
    questionKey: 'library.sampleQ2',
    answerKey: 'library.sampleA2',
  },
  {
    id: 'faq-3',
    categoryId: 'fire',
    questionKey: 'library.sampleQ3',
    answerKey: 'library.sampleA3',
  },
];
