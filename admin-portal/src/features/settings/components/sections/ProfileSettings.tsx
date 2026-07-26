import { Box, Card, CardContent, TextField, Switch, FormControlLabel, Typography, Divider, Avatar, Button } from '@mui/material';
import { ProfileSettings } from '../../types';

interface ProfileSettingsProps {
  settings: ProfileSettings;
  onChange: (settings: ProfileSettings) => void;
}

export function ProfileSettingsSection({ settings, onChange }: ProfileSettingsProps) {
  const handleChange = (field: keyof ProfileSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  const handleNotificationChange = (field: keyof ProfileSettings['notifications'], value: boolean) => {
    onChange({
      ...settings,
      notifications: { ...settings.notifications, [field]: value },
    });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage your personal information and notification preferences.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={settings.avatar}
                sx={{ width: 80, height: 80 }}
              />
              <Box>
                <Button variant="outlined" size="small">
                  Change Avatar
                </Button>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  JPG, PNG or GIF. Max 2MB.
                </Typography>
              </Box>
            </Box>

            <Divider />

            <TextField
              fullWidth
              label="First Name"
              value={settings.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />

            <TextField
              fullWidth
              label="Last Name"
              value={settings.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />

            <TextField
              fullWidth
              label="Phone"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />

            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={settings.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              helperText="Tell us about yourself"
            />

            <Divider />

            <Typography variant="subtitle1" fontWeight={600}>
              Notification Preferences
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                />
              }
              label="Email Notifications"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                />
              }
              label="Push Notifications"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.sms}
                  onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                />
              }
              label="SMS Notifications"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
