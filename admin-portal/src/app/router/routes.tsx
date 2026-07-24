import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminLayout } from '../layout/AdminLayout';
import { routePaths } from './routePaths';
import { ProtectedRoute, PublicRoute, RouteFallback } from './guards';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { TeachersPage } from '../../features/teachers/pages/TeachersPage';
import { SubjectsPage } from '../../features/subjects/pages/SubjectsPage';
import { ClassesPage } from '../../features/classes/pages/ClassesPage';
import { ChaptersPage } from '../../features/chapters/pages/ChaptersPage';
import { DifficultyLevelsPage } from '../../features/difficultyLevels/pages/DifficultyLevelsPage';
import { QuestionCategoriesPage } from '../../features/questionCategories/pages/QuestionCategoriesPage';
import { QuestionsPage } from '../../features/questions/pages/QuestionsPage';
import { PapersPage } from '../../features/papers/pages/PapersPage';
import { SyncPage } from '../../features/sync/pages/SyncPage';
import { UsersPage } from '../../features/users/pages/UsersPage';
import { ReportsPage } from '../../features/reports/pages/ReportsPage';
import { SettingsPage } from '../../features/settings/pages/SettingsPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';

const router = createBrowserRouter([
  {
    path: routePaths.login,
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: routePaths.forgotPassword,
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: routePaths.resetPassword.slice(1),
    element: (
      <PublicRoute>
        <ResetPasswordPage />
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
      { index: true, element: <DashboardPage /> },
      { path: routePaths.teachers.slice(1), element: <TeachersPage /> },
      { path: routePaths.subjects.slice(1), element: <SubjectsPage /> },
      { path: routePaths.classes.slice(1), element: <ClassesPage /> },
      { path: routePaths.chapters.slice(1), element: <ChaptersPage /> },
      { path: routePaths.difficultyLevels.slice(1), element: <DifficultyLevelsPage /> },
      { path: routePaths.questionCategories.slice(1), element: <QuestionCategoriesPage /> },
      { path: routePaths.questions.slice(1), element: <QuestionsPage /> },
      { path: routePaths.papers.slice(1), element: <PapersPage /> },
      { path: routePaths.sync.slice(1), element: <SyncPage /> },
      { path: routePaths.users.slice(1), element: <UsersPage /> },
      { path: routePaths.reports.slice(1), element: <ReportsPage /> },
      { path: routePaths.settings.slice(1), element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <RouteFallback />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

