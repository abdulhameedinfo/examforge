import { Box, Card, CardContent, TextField, Switch, FormControlLabel, Typography, Divider, Slider, Alert, Button } from '@mui/material';
import { SecuritySettings } from '../../types';

interface SecuritySettingsProps {
  settings: SecuritySettings;
  onChange: (settings: SecuritySettings) => void;
}

export function SecuritySettingsSection({ settings, onChange }: SecuritySettingsProps) {
  const handleChange = (field: keyof SecuritySettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Security Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure security policies and authentication requirements.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Security changes will affect all users on the platform.
            </Alert>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => handleChange('twoFactorEnabled', e.target.checked)}
                />
              }
              label="Enable Two-Factor Authentication (2FA)"
            />

            <Divider />

            <Typography variant="subtitle1" fontWeight={600}>
              Password Requirements
            </Typography>

            <Box>
              <Typography gutterBottom>
                Minimum Password Length: {settings.passwordMinLength} characters
              </Typography>
              <Slider
                value={settings.passwordMinLength}
                onChange={(_, value) => handleChange('passwordMinLength', value)}
                min={6}
                max={32}
                marks
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordRequireUppercase}
                  onChange={(e) => handleChange('passwordRequireUppercase', e.target.checked)}
                />
              }
              label="Require Uppercase Letters"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordRequireLowercase}
                  onChange={(e) => handleChange('passwordRequireLowercase', e.target.checked)}
                />
              }
              label="Require Lowercase Letters"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordRequireNumbers}
                  onChange={(e) => handleChange('passwordRequireNumbers', e.target.checked)}
                />
              }
              label="Require Numbers"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordRequireSpecialChars}
                  onChange={(e) => handleChange('passwordRequireSpecialChars', e.target.checked)}
                />
              }
              label="Require Special Characters"
            />

            <Divider />

            <Typography variant="subtitle1" fontWeight={600}>
              Session & Login Security
            </Typography>

            <TextField
              fullWidth
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value) || 0)}
              helperText="Auto-logout after inactivity"
            />

            <TextField
              fullWidth
              label="Maximum Login Attempts"
              type="number"
              value={settings.loginAttemptsLimit}
              onChange={(e) => handleChange('loginAttemptsLimit', parseInt(e.target.value) || 0)}
              helperText="Number of failed attempts before lockout"
            />

            <TextField
              fullWidth
              label="Lockout Duration (minutes)"
              type="number"
              value={settings.lockoutDuration}
              onChange={(e) => handleChange('lockoutDuration', parseInt(e.target.value) || 0)}
              helperText="How long to lock account after too many failed attempts"
            />

            <Divider />

            <Button variant="contained" color="primary">
              Save Security Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
