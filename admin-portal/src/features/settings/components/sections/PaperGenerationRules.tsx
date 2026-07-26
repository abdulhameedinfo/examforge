import { Box, Card, CardContent, TextField, Switch, FormControlLabel, Typography, Divider, Grid } from '@mui/material';
import { PaperGenerationRules } from '../../types';

interface PaperGenerationRulesProps {
  settings: PaperGenerationRules;
  onChange: (settings: PaperGenerationRules) => void;
}

export function PaperGenerationRulesSection({ settings, onChange }: PaperGenerationRulesProps) {
  const handleChange = (field: keyof PaperGenerationRules, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Paper Generation Rules
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure rules for automatic question paper generation.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.randomizeQuestions}
                  onChange={(e) => handleChange('randomizeQuestions', e.target.checked)}
                />
              }
              label="Randomize Questions"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.randomizeOptions}
                  onChange={(e) => handleChange('randomizeOptions', e.target.checked)}
                />
              }
              label="Randomize Options (for MCQs)"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.balanceDifficulty}
                  onChange={(e) => handleChange('balanceDifficulty', e.target.checked)}
                />
              }
              label="Balance Difficulty Levels"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.balanceChapters}
                  onChange={(e) => handleChange('balanceChapters', e.target.checked)}
                />
              }
              label="Balance Across Chapters"
            />

            <Divider />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Questions per Chapter"
                  type="number"
                  value={settings.minimumQuestionsPerChapter}
                  onChange={(e) => handleChange('minimumQuestionsPerChapter', parseInt(e.target.value) || 0)}
                  helperText="Minimum questions from each chapter"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Questions per Chapter"
                  type="number"
                  value={settings.maximumQuestionsPerChapter}
                  onChange={(e) => handleChange('maximumQuestionsPerChapter', parseInt(e.target.value) || 0)}
                  helperText="Maximum questions from each chapter"
                />
              </Grid>
            </Grid>

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowQuestionReuse}
                  onChange={(e) => handleChange('allowQuestionReuse', e.target.checked)}
                />
              }
              label="Allow Question Reuse"
            />

            {settings.allowQuestionReuse && (
              <TextField
                fullWidth
                label="Reuse Cooldown (days)"
                type="number"
                value={settings.reuseCooldownDays}
                onChange={(e) => handleChange('reuseCooldownDays', parseInt(e.target.value) || 0)}
                helperText="Days before a question can be reused"
                sx={{ ml: 3 }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
