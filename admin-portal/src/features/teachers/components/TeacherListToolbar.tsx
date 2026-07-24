import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Plus } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import type { IdNameDto } from '../../../shared/api/types';
import type { TeacherStatusValue } from '../types';

type TeacherListToolbarProps = {
  search: string;
  status: TeacherStatusValue;
  subjectId?: string;
  classId?: string;
  subjects: IdNameDto[];
  classes: IdNameDto[];
  onSearchChange: (value: string) => void;
  onFilterChange: (name: 'status' | 'subjectId' | 'classId', value: string) => void;
  onClearFilters: () => void;
};

export function TeacherListToolbar({
  search,
  status,
  subjectId,
  classId,
  subjects,
  classes,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}: TeacherListToolbarProps) {
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <TextField
          label="Search teachers"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          fullWidth
        />

        <Button
          component={RouterLink}
          to={routePaths.teacherCreate}
          variant="contained"
          startIcon={<Plus size={18} />}
        >
          Create Teacher
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="teacher-status-label">Status</InputLabel>
          <Select
            labelId="teacher-status-label"
            label="Status"
            value={status}
            onChange={(event) => onFilterChange('status', event.target.value)}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="teacher-subject-label">Subject</InputLabel>
          <Select
            labelId="teacher-subject-label"
            label="Subject"
            value={subjectId ?? ''}
            onChange={(event) => onFilterChange('subjectId', event.target.value)}
          >
            <MenuItem value="">All subjects</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="teacher-class-label">Class</InputLabel>
          <Select
            labelId="teacher-class-label"
            label="Class"
            value={classId ?? ''}
            onChange={(event) => onFilterChange('classId', event.target.value)}
          >
            <MenuItem value="">All classes</MenuItem>
            {classes.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Button variant="text" onClick={onClearFilters}>
          Reset filters
        </Button>
        <Box />
      </Box>
    </Stack>
  );
}
