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
import type { NamedEntity, QuestionStatusValue, QuestionType } from '../types';
import { questionTypeOptions } from '../types';

type QuestionListToolbarProps = {
  search: string;
  status: QuestionStatusValue;
  type: QuestionType | 'all';
  subjectId?: string;
  chapterId?: string;
  teacherId?: string;
  difficultyId?: string;
  subjects: NamedEntity[];
  chapters: NamedEntity[];
  teachers: { id: string; fullName: string }[];
  difficulties: NamedEntity[];
  onSearchChange: (value: string) => void;
  onFilterChange: (name: 'status' | 'type' | 'subjectId' | 'chapterId' | 'teacherId' | 'difficultyId', value: string) => void;
  onClearFilters: () => void;
};

export function QuestionListToolbar({
  search,
  status,
  type,
  subjectId,
  chapterId,
  teacherId,
  difficultyId,
  subjects,
  chapters,
  teachers,
  difficulties,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}: QuestionListToolbarProps) {
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <TextField
          label="Search questions"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          fullWidth
        />

        <Button component={RouterLink} to={routePaths.questionCreate} variant="contained" startIcon={<Plus size={18} />}>
          Create Question
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
          <InputLabel id="question-type-label">Question Type</InputLabel>
          <Select
            labelId="question-type-label"
            label="Question Type"
            value={type}
            onChange={(event) => onFilterChange('type', event.target.value)}
          >
            <MenuItem value="all">All types</MenuItem>
            {questionTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="question-status-label">Status</InputLabel>
          <Select
            labelId="question-status-label"
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
          <InputLabel id="question-subject-label">Subject</InputLabel>
          <Select
            labelId="question-subject-label"
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
          <InputLabel id="question-chapter-label">Chapter</InputLabel>
          <Select
            labelId="question-chapter-label"
            label="Chapter"
            value={chapterId ?? ''}
            onChange={(event) => onFilterChange('chapterId', event.target.value)}
          >
            <MenuItem value="">All chapters</MenuItem>
            {chapters.map((chapter) => (
              <MenuItem key={chapter.id} value={chapter.id}>
                {chapter.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="question-teacher-label">Teacher</InputLabel>
          <Select
            labelId="question-teacher-label"
            label="Teacher"
            value={teacherId ?? ''}
            onChange={(event) => onFilterChange('teacherId', event.target.value)}
          >
            <MenuItem value="">All teachers</MenuItem>
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="question-difficulty-label">Difficulty</InputLabel>
          <Select
            labelId="question-difficulty-label"
            label="Difficulty"
            value={difficultyId ?? ''}
            onChange={(event) => onFilterChange('difficultyId', event.target.value)}
          >
            <MenuItem value="">All difficulties</MenuItem>
            {difficulties.map((difficulty) => (
              <MenuItem key={difficulty.id} value={difficulty.id}>
                {difficulty.name}
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

