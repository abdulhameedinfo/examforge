import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import type { DifficultyDistribution } from '../types';
import type { IdNameDto } from '../../../shared/api/types';

type DifficultyDistributionProps = {
  distribution: DifficultyDistribution[];
  availableDifficulties: IdNameDto[];
  onChange: (distribution: DifficultyDistribution[]) => void;
  error?: string;
};

export function DifficultyDistribution({
  distribution,
  availableDifficulties,
  onChange,
  error,
}: DifficultyDistributionProps) {
  const totalPercentage = distribution.reduce((sum, item) => sum + item.percentage, 0);
  const hasError = Math.abs(totalPercentage - 100) > 0.01;

  const addDifficulty = () => {
    const existingDifficultyIds = distribution.map((d) => d.difficultyId);
    const availableDifficulty = availableDifficulties.find((d) => !existingDifficultyIds.includes(d.id));
    
    if (availableDifficulty) {
      onChange([
        ...distribution,
        {
          difficultyId: availableDifficulty.id,
          difficultyName: availableDifficulty.name,
          percentage: 0,
        },
      ]);
    }
  };

  const updateDifficulty = (index: number, field: 'difficultyId' | 'difficultyName' | 'percentage', value: string | number) => {
    const updated = [...distribution];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeDifficulty = (index: number) => {
    onChange(distribution.filter((_, i) => i !== index));
  };

  const getAvailableDifficulties = (currentIndex: number) => {
    const existingDifficultyIds = distribution
      .map((d, i) => i === currentIndex ? null : d.difficultyId)
      .filter(Boolean);
    return availableDifficulties.filter((d) => !existingDifficultyIds.includes(d.id));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" fontWeight={600}>
          Difficulty Distribution
        </Typography>
        <Button
          size="small"
          startIcon={<Plus size={16} />}
          onClick={addDifficulty}
          disabled={distribution.length >= availableDifficulties.length || availableDifficulties.length === 0}
        >
          Add Difficulty
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
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  label="Difficulty Level"
                  value={item.difficultyId}
                  onChange={(e) => {
                    const difficulty = availableDifficulties.find((d) => d.id === e.target.value);
                    updateDifficulty(index, 'difficultyId', e.target.value);
                    if (difficulty) {
                      updateDifficulty(index, 'difficultyName', difficulty.name);
                    }
                  }}
                >
                  {getAvailableDifficulties(index).map((difficulty) => (
                    <MenuItem key={difficulty.id} value={difficulty.id}>
                      {difficulty.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ width: 120 }}>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Percentage
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.percentage}%
                  </Typography>
                </Stack>
              </Box>

              <Button
                size="small"
                color="error"
                onClick={() => removeDifficulty(index)}
                disabled={distribution.length === 1}
              >
                <Trash2 size={16} />
              </Button>
            </Stack>

            <Box>
              <Slider
                value={item.percentage}
                onChange={(_, value) => updateDifficulty(index, 'percentage', value as number)}
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
            No difficulty levels added. Click "Add Difficulty" to begin.
          </Typography>
        </Box>
      )}

      {availableDifficulties.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography color="text.secondary" variant="body2">
            No active difficulty levels available. Please add difficulty levels first.
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
