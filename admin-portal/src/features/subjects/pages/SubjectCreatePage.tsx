import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { SubjectForm } from '../components/SubjectForm';
import { useCreateSubjectMutation } from '../hooks/useSubjectQueries';
import type { SubjectUpsertPayload } from '../types';

export function SubjectCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateSubjectMutation();

  const handleSubmit = async (payload: SubjectUpsertPayload) => {
    const created = await createMutation.mutateAsync(payload);
    navigate(routePaths.subjectEdit.replace(':subjectId', created.id));
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Create Subject"
        description="Add a subject code, display name, and optional description."
      />

      {createMutation.isError ? <Alert severity="error">Unable to create the subject.</Alert> : null}

      <SubjectForm submitLabel="Create Subject" onSubmit={handleSubmit} saving={createMutation.isPending} />
    </PageContainer>
  );
}

