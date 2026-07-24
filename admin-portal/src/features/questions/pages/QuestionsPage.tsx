import { Alert, Box, Button, Snackbar, Stack, Typography } from '@mui/material';
import { Copy, Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../shared/components/data-table/DataTable';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { routePaths } from '../../../app/router/routePaths';
import { QuestionListToolbar } from '../components/QuestionListToolbar';
import { QuestionPreviewDialog } from '../components/QuestionPreviewDialog';
import { QuestionStatisticsCards } from '../components/QuestionStatisticsCards';
import { QuestionStatusChip } from '../components/QuestionStatusChip';
import { QuestionTypeChip } from '../components/QuestionTypeChip';
import { useQuestionFormOptions, useQuestionQuery, useQuestionStatisticsQuery, useQuestionsQuery } from '../hooks/useQuestionQueries';
import { useQuestionListParams } from '../hooks/useQuestionListParams';
import { copyQuestionToClipboard } from '../utils/copyQuestion';

export function QuestionsPage() {
  const navigate = useNavigate();
  const { query, setPage, setPageSize, setSearch, setFilters, clearFilters } = useQuestionListParams();
  const questionsQuery = useQuestionsQuery(query);
  const { subjectsQuery, chaptersQuery, difficultiesQuery, teachersQuery } = useQuestionFormOptions(query.subjectId);
  const statisticsQuery = useQuestionStatisticsQuery();

  const [previewQuestionId, setPreviewQuestionId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const rows = questionsQuery.data?.items ?? [];
  const previewQuestionQuery = useQuestionQuery(previewQuestionId ?? undefined);

  const handlePreview = (questionId: string) => {
    setPreviewQuestionId(questionId);
  };

  const handleCopy = async (questionId: string) => {
    const question = rows.find((r) => r.id === questionId);
    if (!question) return;

    try {
      const questionDetail = await previewQuestionQuery.refetch().then((res) => res.data);
      if (questionDetail) {
        const success = await copyQuestionToClipboard(questionDetail);
        if (success) {
          setCopySuccess(true);
        } else {
          setCopyError(true);
        }
      }
    } catch (error) {
      setCopyError(true);
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Question Bank"
        description="Browse, search, and manage questions with server-side pagination and filters."
        actions={
          <Button variant="contained" onClick={() => navigate(routePaths.questionCreate)}>
            Create Question
          </Button>
        }
      />

      <Stack spacing={3}>
        <QuestionStatisticsCards statistics={statisticsQuery.data} loading={statisticsQuery.isLoading} />

        {statisticsQuery.error ? (
          <Alert severity="warning">Unable to load question statistics right now.</Alert>
        ) : null}

        {questionsQuery.error ? (
          <Alert severity="error">Unable to load questions right now.</Alert>
        ) : null}

        <DataTable
          rows={rows}
          rowKey={(row) => row.id}
          loading={questionsQuery.isFetching}
          emptyTitle="No questions found"
          emptyDescription="Try changing the search or filters."
          columns={[
            {
              key: 'text',
              header: 'Question',
              sortKey: 'text',
              width: '30%',
              render: (row) => (
                <Stack spacing={0.5}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {row.text}
                  </Typography>
                <Typography variant="caption" color="text.secondary">
                  Updated {new Date(row.updatedAt).toLocaleDateString()}
                </Typography>
              </Stack>
            ),
          },
          {
            key: 'subject',
            header: 'Subject',
            sortKey: 'subjectName',
            render: (row) => row.subject?.name ?? '-',
          },
          {
            key: 'chapter',
            header: 'Chapter',
            sortKey: 'chapterName',
            render: (row) => row.chapter?.name ?? '-',
          },
          {
            key: 'teacher',
            header: 'Teacher',
            sortKey: 'teacherName',
            render: (row) => row.teacher.fullName,
          },
          {
            key: 'type',
            header: 'Type',
            sortKey: 'type',
            render: (row) => <QuestionTypeChip type={row.type} />,
          },
          {
            key: 'difficulty',
            header: 'Difficulty',
            sortKey: 'difficultyName',
            render: (row) => row.difficulty?.name ?? '-',
          },
          {
            key: 'marks',
            header: 'Marks',
            sortKey: 'marks',
            align: 'right',
            render: (row) => row.marks.toFixed(1),
          },
          {
            key: 'status',
            header: 'Status',
            sortKey: 'isActive',
            render: (row) => <QuestionStatusChip isActive={row.isActive} />,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button
                  size="small"
                  startIcon={<Eye size={16} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    handlePreview(row.id);
                  }}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  startIcon={<Copy size={16} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCopy(row.id);
                  }}
                >
                  Copy
                </Button>
                <Button
                  size="small"
                  startIcon={<Pencil size={16} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(routePaths.questionEdit.replace(':questionId', row.id));
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Trash2 size={16} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(routePaths.questionDetails.replace(':questionId', row.id));
                  }}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
        ]}
        pagination={{
          page: query.pageNumber,
          pageSize: query.pageSize,
          totalCount: questionsQuery.data?.totalCount ?? 0,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [10, 25, 50],
        }}
        sorting={{
          sortBy: query.sortBy,
          sortDirection: query.sortDirection,
          onSortChange: (sortBy, sortDirection) => setFilters({ sortBy, sortDirection }),
        }}
        toolbar={
          <QuestionListToolbar
            search={query.search ?? ''}
            status={query.status ?? 'all'}
            type={query.type ?? 'all'}
            subjectId={query.subjectId}
            chapterId={query.chapterId}
            teacherId={query.teacherId}
            difficultyId={query.difficultyId}
            subjects={subjectsQuery.data ?? []}
            chapters={chaptersQuery.data ?? []}
            teachers={teachersQuery.data ?? []}
            difficulties={difficultiesQuery.data ?? []}
            onSearchChange={setSearch}
            onFilterChange={(name, value) => {
              if (name === 'subjectId') {
                setFilters({ subjectId: value || undefined, chapterId: undefined });
                return;
              }

              if (name === 'status') {
                setFilters({ status: (value as 'all' | 'active' | 'inactive') || 'all' });
                return;
              }

              if (name === 'type') {
                setFilters({ type: (value as 'all' | 'MultipleChoice' | 'ShortQuestion' | 'LongQuestion' | 'FillInTheBlank' | 'TrueFalse') || 'all' });
                return;
              }

              if (name === 'chapterId') {
                setFilters({ chapterId: value || undefined });
                return;
              }

              if (name === 'teacherId') {
                setFilters({ teacherId: value || undefined });
                return;
              }

              if (name === 'difficultyId') {
                setFilters({ difficultyId: value || undefined });
              }
            }}
            onClearFilters={clearFilters}
          />
        }
        onRowClick={(row) => navigate(routePaths.questionDetails.replace(':questionId', row.id))}
      />
      </Stack>

      <QuestionPreviewDialog
        question={previewQuestionQuery.data ?? null}
        open={Boolean(previewQuestionId)}
        onClose={() => setPreviewQuestionId(null)}
      />

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Question copied to clipboard"
      />

      <Snackbar
        open={copyError}
        autoHideDuration={3000}
        onClose={() => setCopyError(false)}
        message="Failed to copy question"
      />
    </PageContainer>
  );
}
