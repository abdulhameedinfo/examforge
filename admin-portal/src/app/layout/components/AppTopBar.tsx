import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { UserProfileMenu } from './UserProfileMenu';

type AppTopBarProps = {
  title: string;
  isDesktop: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  onOpenSidebar: () => void;
  onToggleSidebarCollapse: () => void;
};

export function AppTopBar({
  title,
  isDesktop,
  sidebarCollapsed,
  sidebarWidth,
  onOpenSidebar,
  onToggleSidebarCollapse,
}: AppTopBarProps) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        backgroundColor:
          theme.palette.mode === 'light'
            ? 'rgba(247, 249, 252, 0.88)'
            : 'rgba(11, 18, 32, 0.9)',
        ml: { lg: `${sidebarWidth}px` },
        width: { lg: `calc(100% - ${sidebarWidth}px)` },
      }}
    >
      <Toolbar sx={{ minHeight: 72, gap: 1.5 }}>
        {!isDesktop ? (
          <IconButton edge="start" onClick={onOpenSidebar} aria-label="Open navigation">
            <Menu size={18} />
          </IconButton>
        ) : (
          <IconButton onClick={onToggleSidebarCollapse} aria-label="Toggle sidebar collapse">
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </IconButton>
        )}

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            ExamForge admin workspace
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton aria-label="Notifications">
            <Badge color="error" variant="dot">
              <Bell size={18} />
            </Badge>
          </IconButton>
          <UserProfileMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
