import { Box, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Typography, Divider } from '@mui/material';
import { GeneralSettings } from '../../types';

interface GeneralSettingsProps {
  settings: GeneralSettings;
  onChange: (settings: GeneralSettings) => void;
}

export function GeneralSettingsSection({ settings, onChange }: GeneralSettingsProps) {
  const handleChange = (field: keyof GeneralSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            General Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure basic site settings and preferences.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              helperText="The name of your examination platform"
            />

            <TextField
              fullWidth
              label="Site Description"
              multiline
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              helperText="A brief description of your platform"
            />

            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                label="Language"
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="ar">Arabic</MenuItem>
                <MenuItem value="ur">Urdu</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={settings.timezone}
                label="Timezone"
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                <MenuItem value="Asia/Karachi">Pakistan (PKT)</MenuItem>
                <MenuItem value="Asia/Dubai">Dubai (GST)</MenuItem>
                <MenuItem value="Europe/London">London (GMT)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Date Format</InputLabel>
              <Select
                value={settings.dateFormat}
                label="Date Format"
                onChange={(e) => handleChange('dateFormat', e.target.value)}
              >
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Time Format</InputLabel>
              <Select
                value={settings.timeFormat}
                label="Time Format"
                onChange={(e) => handleChange('timeFormat', e.target.value)}
              >
                <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
                <MenuItem value="24h">24-hour</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
