import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import type { QuestionTypeDistribution } from '../types';
import type { QuestionType } from '../../questions/types';
import { questionTypeOptions } from '../../questions/types';

type QuestionTypeDistributionProps = {
  distribution: QuestionTypeDistribution[];
  onChange: (distribution: QuestionTypeDistribution[]) => void;
  error?: string;
};

export function QuestionTypeDistribution({
  distribution,
  onChange,
  error,
}: QuestionTypeDistributionProps) {
  const totalPercentage = distribution.reduce((sum, item) => sum + item.percentage, 0);
  const hasError = Math.abs(totalPercentage - 100) > 0.01;

  const addQuestionType = () => {
    const existingTypes = distribution.map((d) => d.questionType);
    const availableType = questionTypeOptions.find((opt) => !existingTypes.includes(opt.value));
    
    if (availableType) {
      onChange([
        ...distribution,
        {
          questionType: availableType.value,
          percentage: 0,
        },
      ]);
    }
  };

  const updateQuestionType = (index: number, field: 'questionType' | 'percentage', value: QuestionType | number) => {
    const updated = [...distribution];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeQuestionType = (index: number) => {
    onChange(distribution.filter((_, i) => i !== index));
  };

  const getAvailableTypes = (currentIndex: number) => {
    const existingTypes = distribution
      .map((d, i) => i === currentIndex ? null : d.questionType)
      .filter(Boolean);
    return questionTypeOptions.filter((opt) => !existingTypes.includes(opt.value));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" fontWeight={600}>
          Question Type Distribution
        </Typography>
        <Button
          size="small"
          startIcon={<Plus size={16} />}
          onClick={addQuestionType}
          disabled={distribution.length >= questionTypeOptions.length}
        >
          Add Type
        </Button>
      </Stack>

      {distribution.map((item, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth size="small">
                <InputLabel>Question Type</InputLabel>
                <Select
                  label="Question Type"
                  value={item.questionType}
                  onChange={(e) => updateQuestionType(index, 'questionType', e.target.value as QuestionType)}
                >
                  {getAvailableTypes(index).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ width: 120 }}>
                <TextField
                  label="Percentage"
                  type="number"
                  size="small"
                  fullWidth
                  value={item.percentage}
                  onChange={(e) => updateQuestionType(index, 'percentage', Number(e.target.value) || 0)}
                  inputProps={{ min: 0, max: 100, step: 1 }}
                />
              </Box>

              <Button
                size="small"
                color="error"
                onClick={() => removeQuestionType(index)}
                disabled={distribution.length === 1}
              >
                <Trash2 size={16} />
              </Button>
            </Stack>

            <Box>
              <Slider
                value={item.percentage}
                onChange={(_, value) => updateQuestionType(index, 'percentage', value as number)}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>
          </Stack>
        </Box>
      ))}

      {distribution.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography color="text.secondary" variant="body2">
            No question types added. Click "Add Type" to begin.
          </Typography>
        </Box>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color={hasError ? 'error' : 'text.secondary'}>
          Total: {totalPercentage.toFixed(1)}%
        </Typography>
        {hasError && (
          <Typography variant="caption" color="error">
            Must equal 100%
          </Typography>
        )}
      </Stack>

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Stack>
  );
}
