import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { routePaths } from '../../../app/router/routePaths';
import { QuestionUpsertForm } from '../components/QuestionUpsertForm';
import { useCreateQuestionMutation } from '../hooks/useQuestionQueries';
import type { QuestionUpsertPayload } from '../types';

export function QuestionCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateQuestionMutation();

  const handleSubmit = async (payload: QuestionUpsertPayload) => {
    const created = await createMutation.mutateAsync(payload);
    navigate(routePaths.questionDetails.replace(':questionId', created.id));
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Create Question"
        description="Add a new question to the bank with the required academic metadata."
      />

      {createMutation.isError ? <Alert severity="error">Unable to create the question.</Alert> : null}

      <QuestionUpsertForm
        submitLabel="Create Question"
        onSubmit={handleSubmit}
        saving={createMutation.isPending}
      />
    </PageContainer>
  );
}
