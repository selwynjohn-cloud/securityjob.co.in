import type { AppNotification } from '../types';

export const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'new_job',
    titleKey: 'notifications.n1Title',
    bodyKey: 'notifications.n1Body',
    createdAt: '2026-07-18T08:00:00Z',
    read: false,
  },
  {
    id: 'n2',
    type: 'recruiter_contact',
    titleKey: 'notifications.n2Title',
    bodyKey: 'notifications.n2Body',
    createdAt: '2026-07-17T14:30:00Z',
    read: false,
  },
  {
    id: 'n3',
    type: 'interview',
    titleKey: 'notifications.n3Title',
    bodyKey: 'notifications.n3Body',
    createdAt: '2026-07-16T10:00:00Z',
    read: true,
  },
  {
    id: 'n4',
    type: 'status_change',
    titleKey: 'notifications.n4Title',
    bodyKey: 'notifications.n4Body',
    createdAt: '2026-07-15T09:00:00Z',
    read: true,
  },
  {
    id: 'n5',
    type: 'joining',
    titleKey: 'notifications.n5Title',
    bodyKey: 'notifications.n5Body',
    createdAt: '2026-07-14T11:00:00Z',
    read: true,
  },
  {
    id: 'n6',
    type: 'library',
    titleKey: 'notifications.n6Title',
    bodyKey: 'notifications.n6Body',
    createdAt: '2026-07-13T16:00:00Z',
    read: true,
  },
];
