import { Box, Card, CardContent, TextField, Switch, FormControlLabel, Typography, Divider, Slider } from '@mui/material';
import { ApprovalWorkflow } from '../../types';

interface ApprovalWorkflowProps {
  settings: ApprovalWorkflow;
  onChange: (settings: ApprovalWorkflow) => void;
}

export function ApprovalWorkflowSection({ settings, onChange }: ApprovalWorkflowProps) {
  const handleChange = (field: keyof ApprovalWorkflow, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question Approval Workflow
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure the approval process for new questions.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.requireApproval}
                  onChange={(e) => handleChange('requireApproval', e.target.checked)}
                />
              }
              label="Require Approval for New Questions"
            />

            {settings.requireApproval && (
              <>
                <Box>
                  <Typography gutterBottom>
                    Approval Levels: {settings.approvalLevels}
                  </Typography>
                  <Slider
                    value={settings.approvalLevels}
                    onChange={(_, value) => handleChange('approvalLevels', value)}
                    min={1}
                    max={5}
                    marks
                    step={1}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Number of approval levels required
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoApproveTrustedTeachers}
                      onChange={(e) => handleChange('autoApproveTrustedTeachers', e.target.checked)}
                    />
                  }
                  label="Auto-approve Trusted Teachers"
                />
              </>
            )}

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnApproval}
                  onChange={(e) => handleChange('notifyOnApproval', e.target.checked)}
                />
              }
              label="Notify on Approval"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnRejection}
                  onChange={(e) => handleChange('notifyOnRejection', e.target.checked)}
                />
              }
              label="Notify on Rejection"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.rejectionReasonRequired}
                  onChange={(e) => handleChange('rejectionReasonRequired', e.target.checked)}
                />
              }
              label="Require Rejection Reason"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
