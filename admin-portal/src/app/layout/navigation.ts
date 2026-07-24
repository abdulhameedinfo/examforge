import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Building2,
  Layers3,
  LayoutDashboard,
  RefreshCw,
  Settings2,
  Shield,
  Tags,
  Users,
  FileText,
} from 'lucide-react';
import { routePaths } from '../router/routePaths';

export type NavigationItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: routePaths.dashboard, icon: LayoutDashboard },
  { label: 'Teachers', path: routePaths.teachers, icon: Users },
  { label: 'Subjects', path: routePaths.subjects, icon: BookOpen },
  { label: 'Classes', path: routePaths.classes, icon: Building2 },
  { label: 'Chapters', path: routePaths.chapters, icon: Layers3 },
  { label: 'Question Categories', path: routePaths.questionCategories, icon: Tags },
  { label: 'Question Bank', path: routePaths.questions, icon: FileText },
  { label: 'Exam Papers', path: routePaths.papers, icon: FileText },
  { label: 'Synchronization', path: routePaths.sync, icon: RefreshCw },
  { label: 'Users & Permissions', path: routePaths.users, icon: Shield },
  { label: 'Reports', path: routePaths.reports, icon: BarChart3 },
  { label: 'Settings', path: routePaths.settings, icon: Settings2 },
];

