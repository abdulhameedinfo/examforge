import { Box, Card, CardContent, TextField, Switch, FormControlLabel, Typography, Divider, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { SystemConfiguration } from '../../types';

interface SystemConfigurationProps {
  settings: SystemConfiguration;
  onChange: (settings: SystemConfiguration) => void;
}

export function SystemConfigurationSection({ settings, onChange }: SystemConfigurationProps) {
  const handleChange = (field: keyof SystemConfiguration, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure system-wide settings and maintenance options.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                />
              }
              label="Maintenance Mode"
            />

            {settings.maintenanceMode && (
              <TextField
                fullWidth
                label="Maintenance Message"
                multiline
                rows={3}
                value={settings.maintenanceMessage}
                onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                helperText="Message shown to users during maintenance"
                sx={{ ml: 3 }}
              />
            )}

            <Divider />

            <TextField
              fullWidth
              label="Maximum File Size (MB)"
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value) || 0)}
              helperText="Maximum upload file size"
            />

            <FormControl fullWidth>
              <InputLabel>Allowed File Types</InputLabel>
              <Select
                multiple
                value={settings.allowedFileTypes}
                label="Allowed File Types"
                onChange={(e) => handleChange('allowedFileTypes', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value=".pdf">.pdf</MenuItem>
                <MenuItem value=".doc">.doc</MenuItem>
                <MenuItem value=".docx">.docx</MenuItem>
                <MenuItem value=".jpg">.jpg</MenuItem>
                <MenuItem value=".jpeg">.jpeg</MenuItem>
                <MenuItem value=".png">.png</MenuItem>
                <MenuItem value=".xls">.xls</MenuItem>
                <MenuItem value=".xlsx">.xlsx</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value) || 0)}
              helperText="Auto-logout after inactivity"
            />

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableAuditLog}
                  onChange={(e) => handleChange('enableAuditLog', e.target.checked)}
                />
              }
              label="Enable Audit Log"
            />

            <FormControl fullWidth>
              <InputLabel>Backup Frequency</InputLabel>
              <Select
                value={settings.backupFrequency}
                label="Backup Frequency"
                onChange={(e) => handleChange('backupFrequency', e.target.value)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
