import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu, MoonStar, SunMedium } from 'lucide-react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { appEnv } from '../config/env';
import { navigationItems } from './navigation';
import { useUiStore } from '../state/useUiStore';

const drawerWidth = 280;

export function AdminLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const location = useLocation();
  const mode = useUiStore((state) => state.mode);
  const toggleMode = useUiStore((state) => state.toggleMode);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const mobileOpen = sidebarOpen && !isDesktop;

  const drawerContent = (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography component={RouterLink} to="/" variant="h6" sx={{ color: 'inherit', textDecoration: 'none' }}>
          {appEnv.appName}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon size={18} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" color="inherit" sx={{ ml: isDesktop ? `${drawerWidth}px` : 0, width: isDesktop ? `calc(100% - ${drawerWidth}px)` : '100%' }}>
        <Toolbar sx={{ gap: 1.5 }}>
          {!isDesktop ? (
            <IconButton edge="start" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu size={18} />
            </IconButton>
          ) : null}
          <Typography variant="h6" sx={{ flex: 1 }}>
            Admin Portal
          </Typography>
          <IconButton onClick={toggleMode} aria-label="Toggle color mode">
            {mode === 'light' ? <MoonStar size={18} /> : <SunMedium size={18} />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }} aria-label="Main navigation">
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop ? true : mobileOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, pt: 10, px: { xs: 2, sm: 3 }, pb: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
