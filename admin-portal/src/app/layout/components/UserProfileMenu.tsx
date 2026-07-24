import { Avatar, Divider, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { type MouseEvent, useState } from 'react';
import { ChevronDown, LogOut, Settings2, UserCircle2 } from 'lucide-react';

export function UserProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        onClick={handleOpen}
        sx={{ cursor: 'pointer', userSelect: 'none', borderRadius: 1, px: 1, py: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
        aria-label="User profile menu"
      >
        <Avatar sx={{ width: 32, height: 32 }}>EF</Avatar>
        <Stack spacing={0} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
            Administrator
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
            School Admin
          </Typography>
        </Stack>
        <ChevronDown size={16} />
      </Stack>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose} keepMounted>
        <MenuItem>
          <ListItemIcon>
            <UserCircle2 size={18} />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings2 size={18} />
          </ListItemIcon>
          Account settings
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <LogOut size={18} />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}

