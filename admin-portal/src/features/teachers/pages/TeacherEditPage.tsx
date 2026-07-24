import { Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { TeacherForm } from '../components/TeacherForm';
import { useTeacherFormOptions, useTeacherQuery, useUpdateTeacherMutation } from '../hooks/useTeacherQueries';
import type { TeacherUpsertPayload } from '../types';

export function TeacherEditPage() {
  const navigate = useNavigate();
  const { teacherId } = useParams<{ teacherId: string }>();

  if (!teacherId) {
    return (
      <PageContainer>
        <Alert severity="error">Teacher id is missing.</Alert>
      </PageContainer>
    );
  }

  const teacherQuery = useTeacherQuery(teacherId);
  const updateMutation = useUpdateTeacherMutation(teacherId);
  const { subjectsQuery, classesQuery } = useTeacherFormOptions();

  const handleSubmit = async (payload: TeacherUpsertPayload) => {
    const updated = await updateMutation.mutateAsync(payload);
    navigate(routePaths.teacherEdit.replace(':teacherId', updated.id));
  };

  if (teacherQuery.isError) {
    return (
      <PageContainer>
        <Alert severity="error">Unable to load the teacher for editing.</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Edit Teacher"
        description="Update teacher details, assignments, and access state."
      />

      <TeacherForm
        submitLabel="Save Changes"
        initialTeacher={teacherQuery.data}
        subjects={subjectsQuery.data ?? []}
        classes={classesQuery.data ?? []}
        onSubmit={handleSubmit}
        saving={updateMutation.isPending || teacherQuery.isLoading}
        submitError={updateMutation.isError ? 'Unable to update the teacher.' : null}
      />
    </PageContainer>
  );
}
