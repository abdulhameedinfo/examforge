import { Button } from '@mui/material';
import { Plus } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { routePaths } from '../../../app/router/routePaths';

export function PapersPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Exam Papers"
        description="Generate and manage exam papers with automatic question distribution."
        actions={
          <Button
            component={RouterLink}
            to={routePaths.examPaperGenerator}
            variant="contained"
            startIcon={<Plus size={18} />}
          >
            Generate Paper
          </Button>
        }
      />
      <EmptyState title="No exam papers yet" description="Click 'Generate Paper' to create your first exam paper." />
    </PageContainer>
  );
}

