import { Box, Card, CardContent, TextField, Switch, FormControlLabel, Typography, Divider, Grid } from '@mui/material';
import { ExamSettings } from '../../types';

interface ExamSettingsProps {
  settings: ExamSettings;
  onChange: (settings: ExamSettings) => void;
}

export function ExamSettingsSection({ settings, onChange }: ExamSettingsProps) {
  const handleChange = (field: keyof ExamSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Exam Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure default exam behavior and timing rules.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Default Duration (minutes)"
                  type="number"
                  value={settings.defaultExamDuration}
                  onChange={(e) => handleChange('defaultExamDuration', parseInt(e.target.value) || 0)}
                  helperText="Standard exam length"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Maximum Duration (minutes)"
                  type="number"
                  value={settings.maxExamDuration}
                  onChange={(e) => handleChange('maxExamDuration', parseInt(e.target.value) || 0)}
                  helperText="Upper limit for exams"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Minimum Duration (minutes)"
                  type="number"
                  value={settings.minExamDuration}
                  onChange={(e) => handleChange('minExamDuration', parseInt(e.target.value) || 0)}
                  helperText="Lower limit for exams"
                />
              </Grid>
            </Grid>

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowLateStart}
                  onChange={(e) => handleChange('allowLateStart', e.target.checked)}
                />
              }
              label="Allow Late Start"
            />

            {settings.allowLateStart && (
              <TextField
                fullWidth
                label="Late Start Grace Period (minutes)"
                type="number"
                value={settings.lateStartGracePeriod}
                onChange={(e) => handleChange('lateStartGracePeriod', parseInt(e.target.value) || 0)}
                helperText="How late students can join"
                sx={{ ml: 3 }}
              />
            )}

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSubmitOnTimeout}
                  onChange={(e) => handleChange('autoSubmitOnTimeout', e.target.checked)}
                />
              }
              label="Auto-submit on Timeout"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.showResultsImmediately}
                  onChange={(e) => handleChange('showResultsImmediately', e.target.checked)}
                />
              }
              label="Show Results Immediately"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
