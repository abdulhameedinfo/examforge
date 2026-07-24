import { Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { SubjectForm } from '../components/SubjectForm';
import { useSubjectQuery, useUpdateSubjectMutation } from '../hooks/useSubjectQueries';
import type { SubjectUpsertPayload } from '../types';

export function SubjectEditPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const subjectQuery = useSubjectQuery(subjectId);
  const updateMutation = useUpdateSubjectMutation(subjectId ?? '');

  const handleSubmit = async (payload: SubjectUpsertPayload) => {
    if (!subjectId) {
      return;
    }

    const updated = await updateMutation.mutateAsync(payload);
    navigate(routePaths.subjectEdit.replace(':subjectId', updated.id));
  };

  if (subjectQuery.isError) {
    return (
      <PageContainer>
        <Alert severity="error">Unable to load the subject for editing.</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader title="Edit Subject" description="Update the subject name, code, or active state." />

      <SubjectForm
        submitLabel="Save Changes"
        initialSubject={subjectQuery.data}
        onSubmit={handleSubmit}
        saving={updateMutation.isPending || subjectQuery.isLoading}
        submitError={updateMutation.error ? 'Unable to update the subject.' : null}
      />
    </PageContainer>
  );
}

