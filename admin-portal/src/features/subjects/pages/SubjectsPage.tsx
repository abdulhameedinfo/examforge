import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { AppTable } from '../../../shared/components/ui/AppTable';
import { SubjectListToolbar } from '../components/SubjectListToolbar';
import { useDeleteSubjectMutation, useSubjectsQuery } from '../hooks/useSubjectQueries';
import { useSubjectListParams } from '../hooks/useSubjectListParams';

export function SubjectsPage() {
  const navigate = useNavigate();
  const { query, setPage, setPageSize, setSearch, setSort } = useSubjectListParams();
  const subjectsQuery = useSubjectsQuery(query);
  const deleteMutation = useDeleteSubjectMutation();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const rows = subjectsQuery.data?.items ?? [];
  const pendingDeleteSubject = rows.find((item) => item.id === pendingDeleteId);

  const handleDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    await deleteMutation.mutateAsync(pendingDeleteId);
    setPendingDeleteId(null);
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Subjects"
        description="Manage academic subjects for question assignment and paper generation."
        actions={
          <Button variant="contained" onClick={() => navigate(routePaths.subjectCreate)}>
            Create Subject
          </Button>
        }
      />

      {subjectsQuery.error ? <Alert severity="error">Unable to load subjects right now.</Alert> : null}

      <AppTable
        rows={rows}
        rowKey={(row) => row.id}
        loading={subjectsQuery.isFetching}
        emptyTitle="No subjects found"
        emptyDescription="Create a subject to start organizing the question bank."
        columns={[
          {
            key: 'name',
            header: 'Subject Name',
            sortKey: 'name',
            width: '28%',
            render: (row) => (
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {row.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Updated {new Date(row.updatedAt).toLocaleDateString()}
                </Typography>
              </Stack>
            ),
          },
          {
            key: 'code',
            header: 'Code',
            sortKey: 'code',
            render: (row) => row.code,
          },
          {
            key: 'description',
            header: 'Description',
            render: (row) => row.description ?? '-',
          },
          {
            key: 'status',
            header: 'Status',
            sortKey: 'isActive',
            render: (row) => (
              <Chip
                label={row.isActive ? 'Active' : 'Inactive'}
                color={row.isActive ? 'success' : 'default'}
                variant="outlined"
                size="small"
              />
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button
                  size="small"
                  startIcon={<Pencil size={16} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(routePaths.subjectEdit.replace(':subjectId', row.id));
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
                    setPendingDeleteId(row.id);
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
          totalCount: subjectsQuery.data?.totalCount ?? 0,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [10, 25, 50],
        }}
        sorting={{
          sortBy: query.sortBy,
          sortDirection: query.sortDirection,
          onSortChange: setSort,
        }}
        toolbar={<SubjectListToolbar search={query.search ?? ''} onSearchChange={setSearch} />}
        onRowClick={(row) => navigate(routePaths.subjectEdit.replace(':subjectId', row.id))}
      />

      <Dialog open={Boolean(pendingDeleteId)} onClose={() => setPendingDeleteId(null)}>
        <DialogTitle>Delete subject?</DialogTitle>
        <DialogContent>
          {pendingDeleteSubject ? (
            <>
              <Typography sx={{ mb: 1 }}>
                Subject <strong>{pendingDeleteSubject.name}</strong> will be removed from the system.
              </Typography>
              <Typography color="text.secondary">This action cannot be undone.</Typography>
            </>
          ) : (
            <Typography>This subject will be removed from the system. This action cannot be undone.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDeleteId(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
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
