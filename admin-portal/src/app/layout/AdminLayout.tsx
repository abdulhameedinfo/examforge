import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { AppBreadcrumbs } from './components/AppBreadcrumbs';
import { AppSidebar, SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from './components/AppSidebar';
import { AppTopBar } from './components/AppTopBar';
import { getBreadcrumbsForPath } from './navigation';
import { useUiStore } from '../state/useUiStore';

export function AdminLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const location = useLocation();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const toggleSidebarCollapsed = useUiStore((state) => state.toggleSidebarCollapsed);

  const breadcrumbs = getBreadcrumbsForPath(location.pathname);
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label ?? 'Dashboard';
  const sidebarWidth = isDesktop && sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppSidebar
        isDesktop={isDesktop}
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <AppTopBar
        title={pageTitle}
        isDesktop={isDesktop}
        sidebarCollapsed={sidebarCollapsed}
        sidebarWidth={sidebarWidth}
        onOpenSidebar={() => setSidebarOpen(true)}
        onToggleSidebarCollapse={toggleSidebarCollapsed}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          pt: 11,
          ml: { lg: `${sidebarWidth}px` },
          transition: theme.transitions.create(['margin-left', 'width'], {
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 3, lg: 4 }, pb: 3 }}>
          <AppBreadcrumbs items={breadcrumbs} />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
