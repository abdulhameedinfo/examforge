import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminLayout } from '../layout/AdminLayout';
import { routePaths } from './routePaths';
import { ProtectedRoute, PublicRoute, RouteFallback } from './guards';
import { AppLoader } from '../../shared/components/ui/AppLoader';

// Lazy load page components for code splitting
const DashboardPage = lazy(() => import('../../features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TeachersPage = lazy(() => import('../../features/teachers/pages/TeachersPage').then(m => ({ default: m.TeachersPage })));
const TeacherCreatePage = lazy(() => import('../../features/teachers/pages/TeacherCreatePage').then(m => ({ default: m.TeacherCreatePage })));
const TeacherEditPage = lazy(() => import('../../features/teachers/pages/TeacherEditPage').then(m => ({ default: m.TeacherEditPage })));
const SubjectsPage = lazy(() => import('../../features/subjects/pages/SubjectsPage').then(m => ({ default: m.SubjectsPage })));
const SubjectCreatePage = lazy(() => import('../../features/subjects/pages/SubjectCreatePage').then(m => ({ default: m.SubjectCreatePage })));
const SubjectEditPage = lazy(() => import('../../features/subjects/pages/SubjectEditPage').then(m => ({ default: m.SubjectEditPage })));
const ClassesPage = lazy(() => import('../../features/classes/pages/ClassesPage').then(m => ({ default: m.ClassesPage })));
const ChaptersPage = lazy(() => import('../../features/chapters/pages/ChaptersPage').then(m => ({ default: m.ChaptersPage })));
const DifficultyLevelsPage = lazy(() => import('../../features/difficultyLevels/pages/DifficultyLevelsPage').then(m => ({ default: m.DifficultyLevelsPage })));
const QuestionCategoriesPage = lazy(() => import('../../features/questionCategories/pages/QuestionCategoriesPage').then(m => ({ default: m.QuestionCategoriesPage })));
const QuestionsPage = lazy(() => import('../../features/questions/pages/QuestionsPage').then(m => ({ default: m.QuestionsPage })));
const QuestionCreatePage = lazy(() => import('../../features/questions/pages/QuestionCreatePage').then(m => ({ default: m.QuestionCreatePage })));
const QuestionDetailsPage = lazy(() => import('../../features/questions/pages/QuestionDetailsPage').then(m => ({ default: m.QuestionDetailsPage })));
const QuestionEditPage = lazy(() => import('../../features/questions/pages/QuestionEditPage').then(m => ({ default: m.QuestionEditPage })));
const PapersPage = lazy(() => import('../../features/papers/pages/PapersPage').then(m => ({ default: m.PapersPage })));
const ExamPaperGeneratorPage = lazy(() => import('../../features/papers/pages/ExamPaperGeneratorPage').then(m => ({ default: m.ExamPaperGeneratorPage })));
const SyncPage = lazy(() => import('../../features/sync/pages/SyncPage').then(m => ({ default: m.SyncPage })));
const UsersPage = lazy(() => import('../../features/users/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const ReportsPage = lazy(() => import('../../features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('../../features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('../../features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../../features/auth/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));

// Loading wrapper for lazy loaded components
function LazyWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AppLoader fullScreen message="Loading..." />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: routePaths.login,
    element: (
      <PublicRoute>
        <LazyWrapper>
          <LoginPage />
        </LazyWrapper>
      </PublicRoute>
    ),
  },
  {
    path: routePaths.forgotPassword,
    element: (
      <PublicRoute>
        <LazyWrapper>
          <ForgotPasswordPage />
        </LazyWrapper>
      </PublicRoute>
    ),
  },
  {
    path: routePaths.resetPassword.slice(1),
    element: (
      <PublicRoute>
        <LazyWrapper>
          <ResetPasswordPage />
        </LazyWrapper>
      </PublicRoute>
    ),
  },
  {
    path: routePaths.dashboard,
    element: (
      <ProtectedRoute allowedRoles={['Administrator']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LazyWrapper><DashboardPage /></LazyWrapper> },
      { path: routePaths.teachers.slice(1), element: <LazyWrapper><TeachersPage /></LazyWrapper> },
      { path: routePaths.teacherCreate.slice(1), element: <LazyWrapper><TeacherCreatePage /></LazyWrapper> },
      { path: routePaths.teacherEdit.slice(1), element: <LazyWrapper><TeacherEditPage /></LazyWrapper> },
      { path: routePaths.subjects.slice(1), element: <LazyWrapper><SubjectsPage /></LazyWrapper> },
      { path: routePaths.subjectCreate.slice(1), element: <LazyWrapper><SubjectCreatePage /></LazyWrapper> },
      { path: routePaths.subjectEdit.slice(1), element: <LazyWrapper><SubjectEditPage /></LazyWrapper> },
      { path: routePaths.classes.slice(1), element: <LazyWrapper><ClassesPage /></LazyWrapper> },
      { path: routePaths.chapters.slice(1), element: <LazyWrapper><ChaptersPage /></LazyWrapper> },
      { path: routePaths.difficultyLevels.slice(1), element: <LazyWrapper><DifficultyLevelsPage /></LazyWrapper> },
      { path: routePaths.questionCategories.slice(1), element: <LazyWrapper><QuestionCategoriesPage /></LazyWrapper> },
      { path: routePaths.questions.slice(1), element: <LazyWrapper><QuestionsPage /></LazyWrapper> },
      { path: routePaths.questionCreate.slice(1), element: <LazyWrapper><QuestionCreatePage /></LazyWrapper> },
      { path: routePaths.questionDetails.slice(1), element: <LazyWrapper><QuestionDetailsPage /></LazyWrapper> },
      { path: routePaths.questionEdit.slice(1), element: <LazyWrapper><QuestionEditPage /></LazyWrapper> },
      { path: routePaths.papers.slice(1), element: <LazyWrapper><PapersPage /></LazyWrapper> },
      { path: routePaths.examPaperGenerator.slice(1), element: <LazyWrapper><ExamPaperGeneratorPage /></LazyWrapper> },
      { path: routePaths.sync.slice(1), element: <LazyWrapper><SyncPage /></LazyWrapper> },
      { path: routePaths.users.slice(1), element: <LazyWrapper><UsersPage /></LazyWrapper> },
      { path: routePaths.reports.slice(1), element: <LazyWrapper><ReportsPage /></LazyWrapper> },
      { path: routePaths.settings.slice(1), element: <LazyWrapper><SettingsPage /></LazyWrapper> },
    ],
  },
  {
    path: '*',
    element: <RouteFallback />,
  },
]);

import { ErrorBoundary } from '../../shared/components/ErrorBoundary';

export function AppRouter() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
