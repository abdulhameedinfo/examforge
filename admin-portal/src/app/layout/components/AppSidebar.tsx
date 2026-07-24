import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChevronDown, ChevronRight, PanelLeftClose } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { appEnv } from '../../config/env';
import { sidebarNavigation, type SidebarLink } from '../navigation';

type AppSidebarProps = {
  isDesktop: boolean;
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
};

export const SIDEBAR_WIDTH = 288;
export const SIDEBAR_COLLAPSED_WIDTH = 88;

function isActivePath(pathname: string, path: string) {
  return path === '/' ? pathname === '/' : pathname.startsWith(path);
}

function SidebarItem({
  item,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: SidebarLink;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const active = isActivePath(pathname, item.path);

  return (
    <Tooltip title={collapsed ? item.label : ''} placement="right" disableHoverListener={!collapsed} arrow>
      <ListItemButton
        component={RouterLink}
        to={item.path}
        selected={active}
        onClick={onNavigate}
        sx={{
          minHeight: 44,
          borderRadius: 1,
          justifyContent: collapsed ? 'center' : 'flex-start',
          px: collapsed ? 1 : 1.5,
          '&.Mui-selected': {
            bgcolor: 'action.selected',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
          <Icon size={18} />
        </ListItemIcon>
        {!collapsed ? <ListItemText primary={item.label} /> : null}
      </ListItemButton>
    </Tooltip>
  );
}

export function AppSidebar({ isDesktop, open, collapsed, onClose }: AppSidebarProps) {
  const pathname = useLocation().pathname;
  const [questionBankOpen, setQuestionBankOpen] = useState(true);

  useEffect(() => {
    if (collapsed) {
      setQuestionBankOpen(false);
    } else {
      setQuestionBankOpen(true);
    }
  }, [collapsed]);

  const drawerContent = useMemo(
    () => (
      <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            minHeight: 72,
            px: collapsed ? 1 : 2,
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
        >
          {!collapsed ? (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {appEnv.appName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                Education admin portal
              </Typography>
            </Box>
          ) : (
            <Typography variant="subtitle1" fontWeight={700}>
              EF
            </Typography>
          )}

          {!isDesktop ? (
            <IconButton onClick={onClose} aria-label="Close navigation">
              <PanelLeftClose size={18} />
            </IconButton>
          ) : null}
        </Stack>

        <Divider />

        <List sx={{ px: 1, py: 1, display: 'grid', gap: 0.25, overflowY: 'auto' }}>
          {sidebarNavigation.map((entry) => {
            if ('items' in entry) {
              const groupActive = entry.items.some((item) => isActivePath(pathname, item.path));

              return (
                <Box key={entry.label}>
                  <Tooltip title={collapsed ? entry.label : ''} placement="right" disableHoverListener={!collapsed} arrow>
                    <ListItemButton
                      onClick={() => setQuestionBankOpen((current) => !current)}
                      selected={groupActive}
                      sx={{
                        minHeight: 44,
                        borderRadius: 1,
                        px: collapsed ? 1 : 1.5,
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        '&.Mui-selected': {
                          bgcolor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
                        <entry.icon size={18} />
                      </ListItemIcon>
                      {!collapsed ? <ListItemText primary={entry.label} /> : null}
                      {!collapsed ? (questionBankOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : null}
                    </ListItemButton>
                  </Tooltip>

                  <Collapse in={!collapsed && questionBankOpen} timeout="auto" unmountOnExit>
                    <List sx={{ pl: 2, py: 0.5, display: 'grid', gap: 0.25 }}>
                      {entry.items.map((item) => (
                        <SidebarItem
                          key={item.path}
                          item={item}
                          collapsed={false}
                          pathname={pathname}
                          onNavigate={isDesktop ? undefined : onClose}
                        />
                      ))}
                    </List>
                  </Collapse>
                </Box>
              );
            }

            return <SidebarItem key={entry.path} item={entry} collapsed={collapsed} pathname={pathname} onNavigate={isDesktop ? undefined : onClose} />;
          })}
        </List>
      </Box>
    ),
    [collapsed, isDesktop, onClose, pathname, questionBankOpen],
  );

  return (
    <Drawer
      variant={isDesktop ? 'permanent' : 'temporary'}
      open={isDesktop ? true : open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isDesktop ? (collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH) : SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isDesktop ? (collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH) : SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          borderRightColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
