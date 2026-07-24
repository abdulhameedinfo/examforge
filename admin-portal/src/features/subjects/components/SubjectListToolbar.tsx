import { Box, Button, Stack, TextField } from '@mui/material';
import { Plus } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';

type SubjectListToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function SubjectListToolbar({ search, onSearchChange }: SubjectListToolbarProps) {
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <TextField
          label="Search subjects"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          fullWidth
        />

        <Button component={RouterLink} to={routePaths.subjectCreate} variant="contained" startIcon={<Plus size={18} />}>
          Create Subject
        </Button>
      </Stack>

      <Box />
    </Stack>
  );
}

