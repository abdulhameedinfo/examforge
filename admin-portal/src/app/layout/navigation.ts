import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Building2,
  FileText,
  LayoutDashboard,
  RefreshCw,
  Settings2,
  Shield,
  SlidersHorizontal,
  Users,
  Layers3,
} from 'lucide-react';
import { matchPath } from 'react-router-dom';
import { routePaths } from '../router/routePaths';

export type BreadcrumbItem = {
  label: string;
  path: string;
};

export type SidebarLink = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export type SidebarGroup = {
  label: string;
  icon: LucideIcon;
  items: SidebarLink[];
};

export type SidebarEntry = SidebarLink | SidebarGroup;

export const sidebarNavigation: SidebarEntry[] = [
  { label: 'Dashboard', path: routePaths.dashboard, icon: LayoutDashboard },
  {
    label: 'Question Bank',
    icon: BookOpen,
    items: [
      { label: 'Questions', path: routePaths.questions, icon: FileText },
      { label: 'Subjects', path: routePaths.subjects, icon: BookOpen },
      { label: 'Chapters', path: routePaths.chapters, icon: Layers3 },
      { label: 'Difficulty Levels', path: routePaths.difficultyLevels, icon: SlidersHorizontal },
    ],
  },
  { label: 'Paper Generator', path: routePaths.papers, icon: FileText },
  { label: 'Teachers', path: routePaths.teachers, icon: Users },
  { label: 'Classes', path: routePaths.classes, icon: Building2 },
  { label: 'Reports', path: routePaths.reports, icon: BarChart3 },
  { label: 'Settings', path: routePaths.settings, icon: Settings2 },
  { label: 'User Management', path: routePaths.users, icon: Shield },
  { label: 'Sync Status', path: routePaths.sync, icon: RefreshCw },
];

const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  [routePaths.dashboard]: [{ label: 'Dashboard', path: routePaths.dashboard }],
  [routePaths.questions]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Question Bank', path: routePaths.questions },
    { label: 'Questions', path: routePaths.questions },
  ],
  [routePaths.questionCreate]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Question Bank', path: routePaths.questions },
    { label: 'Create Question', path: routePaths.questionCreate },
  ],
  [routePaths.subjects]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Question Bank', path: routePaths.subjects },
    { label: 'Subjects', path: routePaths.subjects },
  ],
  [routePaths.subjectCreate]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Question Bank', path: routePaths.subjects },
    { label: 'Create Subject', path: routePaths.subjectCreate },
  ],
  [routePaths.chapters]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Question Bank', path: routePaths.chapters },
    { label: 'Chapters', path: routePaths.chapters },
  ],
  [routePaths.difficultyLevels]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Question Bank', path: routePaths.difficultyLevels },
    { label: 'Difficulty Levels', path: routePaths.difficultyLevels },
  ],
  [routePaths.papers]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Paper Generator', path: routePaths.papers },
  ],
  [routePaths.teachers]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Teachers', path: routePaths.teachers },
  ],
  [routePaths.classes]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Classes', path: routePaths.classes },
  ],
  [routePaths.reports]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Reports', path: routePaths.reports },
  ],
  [routePaths.settings]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Settings', path: routePaths.settings },
  ],
  [routePaths.users]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'User Management', path: routePaths.users },
  ],
  [routePaths.sync]: [
    { label: 'Dashboard', path: routePaths.dashboard },
    { label: 'Sync Status', path: routePaths.sync },
  ],
};

export function getBreadcrumbsForPath(pathname: string): BreadcrumbItem[] {
  const dynamicPatterns: Array<{ pattern: string; breadcrumbs: BreadcrumbItem[] }> = [
    {
      pattern: routePaths.subjectEdit,
      breadcrumbs: [
        { label: 'Dashboard', path: routePaths.dashboard },
        { label: 'Question Bank', path: routePaths.subjects },
        { label: 'Edit Subject', path: routePaths.subjects },
      ],
    },
    {
      pattern: routePaths.questionEdit,
      breadcrumbs: [
        { label: 'Dashboard', path: routePaths.dashboard },
        { label: 'Question Bank', path: routePaths.questions },
        { label: 'Edit Question', path: routePaths.questions },
      ],
    },
    {
      pattern: routePaths.questionDetails,
      breadcrumbs: [
        { label: 'Dashboard', path: routePaths.dashboard },
        { label: 'Question Bank', path: routePaths.questions },
        { label: 'Question Details', path: routePaths.questions },
      ],
    },
  ];

  for (const entry of dynamicPatterns) {
    if (matchPath({ path: entry.pattern, end: true }, pathname)) {
      return entry.breadcrumbs;
    }
  }

  return breadcrumbMap[pathname] ?? [{ label: 'Dashboard', path: routePaths.dashboard }];
}
