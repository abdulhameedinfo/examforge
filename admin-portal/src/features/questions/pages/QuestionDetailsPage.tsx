import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography } from '@mui/material';
import { Trash2, Pencil, ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { QuestionStatusChip } from '../components/QuestionStatusChip';
import { QuestionTypeChip } from '../components/QuestionTypeChip';
import { useDeleteQuestionMutation, useQuestionQuery } from '../hooks/useQuestionQueries';

function DetailField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {value ?? '-'}
      </Typography>
    </Box>
  );
}

export function QuestionDetailsPage() {
  const navigate = useNavigate();
  const { questionId } = useParams<{ questionId: string }>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const questionQuery = useQuestionQuery(questionId);
  const deleteMutation = useDeleteQuestionMutation();

  const question = questionQuery.data;
  const options = useMemo(
    () => (question?.mcqOptions ? Object.entries(question.mcqOptions) : []),
    [question?.mcqOptions],
  );

  const handleDelete = async () => {
    if (!questionId) {
      return;
    }

    await deleteMutation.mutateAsync(questionId);
    navigate(routePaths.questions);
  };

  if (questionQuery.isError) {
    return (
      <PageContainer>
        <Alert severity="error">Unable to load the question details.</Alert>
      </PageContainer>
    );
  }

  if (!question) {
    return (
      <PageContainer>
        <Alert severity="info">Question not found.</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Question Details"
        description={question.text}
        actions={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate(routePaths.questions)}>
              Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<Pencil size={16} />}
              onClick={() => navigate(routePaths.questionEdit.replace(':questionId', question.id))}
            >
              Edit
            </Button>
            <Button color="error" variant="contained" startIcon={<Trash2 size={16} />} onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </Stack>
        }
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <QuestionTypeChip type={question.type} />
            <QuestionStatusChip isActive={question.isActive} />
            <Chip label={`${question.marks} marks`} variant="outlined" />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
            }}
          >
            <DetailField label="Subject" value={question.subject?.name} />
            <DetailField label="Chapter" value={question.chapter?.name} />
            <DetailField label="Teacher" value={question.teacher.fullName} />
            <DetailField label="Difficulty" value={question.difficulty?.name} />
          </Box>

          <DetailField label="Question Text" value={question.text} />
          <DetailField label="Created By" value={question.createdBy.fullName} />
          <DetailField label="Updated" value={new Date(question.updatedAt).toLocaleString()} />
          <DetailField label="Created" value={new Date(question.createdAt).toLocaleString()} />

          {question.modelAnswer ? (
            <DetailField label="Model Answer" value={question.modelAnswer} />
          ) : null}

          {question.trueFalseAnswer !== null && question.trueFalseAnswer !== undefined ? (
            <DetailField label="Correct Answer" value={question.trueFalseAnswer ? 'True' : 'False'} />
          ) : null}

          {options.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={700}>
                MCQ Options
              </Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                {options.map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', py: 1 }}
                  >
                    <Typography fontWeight={600}>{key.toUpperCase()}</Typography>
                    <Typography>{value as string}</Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          ) : null}

          {question.blankAnswers.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={700}>
                Acceptable Blank Answers
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {question.blankAnswers.map((answer) => (
                  <Chip key={answer} label={answer} variant="outlined" />
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Paper>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete question?</DialogTitle>
        <DialogContent>
          This question will be removed from the bank. This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setDeleteOpen(false);
              void handleDelete();
            }}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

