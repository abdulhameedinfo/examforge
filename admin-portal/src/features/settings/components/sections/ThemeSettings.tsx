import { Box, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Typography, Divider, RadioGroup, Radio, FormControlLabel as RadioLabel } from '@mui/material';
import { ThemeSettings } from '../../types';

interface ThemeSettingsProps {
  settings: ThemeSettings;
  onChange: (settings: ThemeSettings) => void;
}

export function ThemeSettingsSection({ settings, onChange }: ThemeSettingsProps) {
  const handleChange = (field: keyof ThemeSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Theme Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Customize the appearance of the application.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Theme Mode</InputLabel>
              <Select
                value={settings.mode}
                label="Theme Mode"
                onChange={(e) => handleChange('mode', e.target.value)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Primary Color</InputLabel>
              <Select
                value={settings.primaryColor}
                label="Primary Color"
                onChange={(e) => handleChange('primaryColor', e.target.value)}
              >
                <MenuItem value="#1976d2">Blue</MenuItem>
                <MenuItem value="#388e3c">Green</MenuItem>
                <MenuItem value="#f57c00">Orange</MenuItem>
                <MenuItem value="#7b1fa2">Purple</MenuItem>
                <MenuItem value="#d32f2f">Red</MenuItem>
                <MenuItem value="#009688">Teal</MenuItem>
                <MenuItem value="#3f51b5">Indigo</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Secondary Color</InputLabel>
              <Select
                value={settings.secondaryColor}
                label="Secondary Color"
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
              >
                <MenuItem value="#ff4081">Pink</MenuItem>
                <MenuItem value="#64b5f6">Light Blue</MenuItem>
                <MenuItem value="#81c784">Light Green</MenuItem>
                <MenuItem value="#ffb74d">Light Orange</MenuItem>
                <MenuItem value="#ba68c8">Light Purple</MenuItem>
              </Select>
            </FormControl>

            <Divider />

            <Typography gutterBottom>Font Size</Typography>
            <RadioGroup
              value={settings.fontSize}
              onChange={(e) => handleChange('fontSize', e.target.value)}
            >
              <RadioLabel value="small" control={<Radio />} label="Small" />
              <RadioLabel value="medium" control={<Radio />} label="Medium" />
              <RadioLabel value="large" control={<Radio />} label="Large" />
            </RadioGroup>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.denseMode}
                  onChange={(e) => handleChange('denseMode', e.target.checked)}
                />
              }
              label="Dense Mode (Compact UI)"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
