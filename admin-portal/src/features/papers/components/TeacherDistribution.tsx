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
import type { TeacherDistribution } from '../types';
import type { IdNameDto } from '../../../shared/api/types';

type TeacherDistributionProps = {
  distribution: TeacherDistribution[];
  availableTeachers: IdNameDto[];
  onChange: (distribution: TeacherDistribution[]) => void;
  error?: string;
};

export function TeacherDistribution({
  distribution,
  availableTeachers,
  onChange,
  error,
}: TeacherDistributionProps) {
  const totalPercentage = distribution.reduce((sum, item) => sum + item.percentage, 0);
  const hasError = Math.abs(totalPercentage - 100) > 0.01;

  const addTeacher = () => {
    const existingTeacherIds = distribution.map((d) => d.teacherId);
    const availableTeacher = availableTeachers.find((t) => !existingTeacherIds.includes(t.id));
    
    if (availableTeacher) {
      onChange([
        ...distribution,
        {
          teacherId: availableTeacher.id,
          teacherName: availableTeacher.name,
          percentage: 0,
        },
      ]);
    }
  };

  const updateTeacher = (index: number, field: 'teacherId' | 'teacherName' | 'percentage', value: string | number) => {
    const updated = [...distribution];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeTeacher = (index: number) => {
    onChange(distribution.filter((_, i) => i !== index));
  };

  const getAvailableTeachers = (currentIndex: number) => {
    const existingTeacherIds = distribution
      .map((d, i) => i === currentIndex ? null : d.teacherId)
      .filter(Boolean);
    return availableTeachers.filter((t) => !existingTeacherIds.includes(t.id));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" fontWeight={600}>
          Teacher Distribution
        </Typography>
        <Button
          size="small"
          startIcon={<Plus size={16} />}
          onClick={addTeacher}
          disabled={distribution.length >= availableTeachers.length || availableTeachers.length === 0}
        >
          Add Teacher
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
                <InputLabel>Teacher</InputLabel>
                <Select
                  label="Teacher"
                  value={item.teacherId}
                  onChange={(e) => {
                    const teacher = availableTeachers.find((t) => t.id === e.target.value);
                    updateTeacher(index, 'teacherId', e.target.value);
                    if (teacher) {
                      updateTeacher(index, 'teacherName', teacher.name);
                    }
                  }}
                >
                  {getAvailableTeachers(index).map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
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
                onClick={() => removeTeacher(index)}
                disabled={distribution.length === 1}
              >
                <Trash2 size={16} />
              </Button>
            </Stack>

            <Box>
              <Slider
                value={item.percentage}
                onChange={(_, value) => updateTeacher(index, 'percentage', value as number)}
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
            No teachers added. Click "Add Teacher" to begin.
          </Typography>
        </Box>
      )}

      {availableTeachers.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography color="text.secondary" variant="body2">
            No active teachers available. Please add teachers first.
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
