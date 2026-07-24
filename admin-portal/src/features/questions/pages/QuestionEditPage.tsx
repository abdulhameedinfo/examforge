import { Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { routePaths } from '../../../app/router/routePaths';
import { QuestionUpsertForm } from '../components/QuestionUpsertForm';
import { useQuestionQuery, useUpdateQuestionMutation } from '../hooks/useQuestionQueries';
import type { QuestionUpsertPayload } from '../types';

export function QuestionEditPage() {
  const navigate = useNavigate();
  const { questionId } = useParams<{ questionId: string }>();
  const questionQuery = useQuestionQuery(questionId);
  const updateMutation = useUpdateQuestionMutation(questionId ?? '');

  const handleSubmit = async (payload: QuestionUpsertPayload) => {
    if (!questionId) {
      return;
    }

    const updated = await updateMutation.mutateAsync(payload);
    navigate(routePaths.questionDetails.replace(':questionId', updated.id));
  };

  if (questionQuery.isError) {
    return (
      <PageContainer>
        <Alert severity="error">Unable to load the question for editing.</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Edit Question"
        description="Update the question text, marks, and answer metadata."
      />

      <QuestionUpsertForm
        submitLabel="Save Changes"
        initialQuestion={questionQuery.data}
        onSubmit={handleSubmit}
        saving={updateMutation.isPending || questionQuery.isLoading}
        submitError={updateMutation.error ? 'Unable to update the question.' : null}
      />
    </PageContainer>
  );
}

