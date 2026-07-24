import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { Ban, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { DataTable } from '../../../shared/components/data-table/DataTable';
import { TeacherListToolbar } from '../components/TeacherListToolbar';
import { TeacherStatisticsCards } from '../components/TeacherStatisticsCards';
import { useDisableTeacherMutation, useTeacherFormOptions, useTeacherStatisticsQuery, useTeachersQuery } from '../hooks/useTeacherQueries';
import { useTeacherListParams } from '../hooks/useTeacherListParams';
import type { TeacherListItem } from '../types';

function formatEntityNames(items: Array<{ id: string; name: string }>, limit = 2) {
  const visible = items.slice(0, limit).map((item) => item.name);
  const remaining = items.length - visible.length;
  return remaining > 0 ? `${visible.join(', ')} +${remaining} more` : visible.join(', ');
}

function TeacherAssignmentsCell({ items, emptyLabel }: { items: Array<{ id: string; name: string }>; emptyLabel: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" fontWeight={600}>
        {items.length}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {items.length > 0 ? formatEntityNames(items) : emptyLabel}
      </Typography>
    </Stack>
  );
}

export function TeachersPage() {
  const navigate = useNavigate();
  const { query, setPage, setPageSize, setSearch, setFilters, clearFilters } = useTeacherListParams();
  const teachersQuery = useTeachersQuery(query);
  const statisticsQuery = useTeacherStatisticsQuery();
  const { subjectsQuery, classesQuery } = useTeacherFormOptions();
  const disableMutation = useDisableTeacherMutation();
  const [pendingDisableTeacherId, setPendingDisableTeacherId] = useState<string | null>(null);

  const rows = teachersQuery.data?.items ?? [];
  const pendingDisableTeacher = useMemo(
    () => rows.find((item) => item.id === pendingDisableTeacherId),
    [pendingDisableTeacherId, rows],
  );

  const handleDisable = async () => {
    if (!pendingDisableTeacherId) {
      return;
    }

    await disableMutation.mutateAsync(pendingDisableTeacherId);
    setPendingDisableTeacherId(null);
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Teachers"
        description="Manage teacher accounts, subject coverage, class assignments, and account status."
        actions={
          <Button variant="contained" onClick={() => navigate(routePaths.teacherCreate)}>
            Create Teacher
          </Button>
        }
      />

      <Stack spacing={3}>
        <TeacherStatisticsCards statistics={statisticsQuery.data} loading={statisticsQuery.isLoading} />

        {statisticsQuery.error ? <Alert severity="warning">Unable to load teacher statistics right now.</Alert> : null}

        {teachersQuery.error ? <Alert severity="error">Unable to load teachers right now.</Alert> : null}

        <DataTable
          rows={rows}
          rowKey={(row) => row.id}
          loading={teachersQuery.isFetching}
          emptyTitle="No teachers found"
          emptyDescription="Try changing the search or filters, or create a new teacher account."
          columns={[
            {
              key: 'teacher',
              header: 'Teacher',
              sortKey: 'fullName',
              width: '26%',
              render: (row) => (
                <Stack spacing={0.5}>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {row.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {row.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {row.employeeCode ? `Code ${row.employeeCode}` : row.phoneNumber ?? 'No employee code'}
                  </Typography>
                </Stack>
              ),
            },
            {
              key: 'subjects',
              header: 'Subjects',
              sortKey: 'subjectCount',
              render: (row) => <TeacherAssignmentsCell items={row.subjects} emptyLabel="No subjects assigned" />,
            },
            {
              key: 'classes',
              header: 'Classes',
              sortKey: 'classCount',
              render: (row) => <TeacherAssignmentsCell items={row.classes} emptyLabel="No classes assigned" />,
            },
            {
              key: 'status',
              header: 'Status',
              sortKey: 'isActive',
              render: (row) => (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    border: '1px solid',
                    borderColor: row.isActive ? 'success.main' : 'divider',
                    px: 1.25,
                    py: 0.5,
                    color: row.isActive ? 'success.main' : 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {row.isActive ? 'Active' : 'Disabled'}
                </Box>
              ),
            },
            {
              key: 'updatedAt',
              header: 'Updated',
              sortKey: 'updatedAt',
              render: (row) => new Date(row.updatedAt).toLocaleDateString(),
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
                      navigate(routePaths.teacherEdit.replace(':teacherId', row.id));
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Ban size={16} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (row.isActive) {
                        setPendingDisableTeacherId(row.id);
                      }
                    }}
                    disabled={!row.isActive}
                  >
                    Disable
                  </Button>
                </Box>
              ),
            },
          ]}
          pagination={{
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: teachersQuery.data?.totalCount ?? 0,
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
            <TeacherListToolbar
              search={query.search ?? ''}
              status={query.status ?? 'all'}
              subjectId={query.subjectId}
              classId={query.classId}
              subjects={subjectsQuery.data ?? []}
              classes={classesQuery.data ?? []}
              onSearchChange={setSearch}
              onFilterChange={(name, value) => {
                if (name === 'status') {
                  setFilters({ status: (value as 'all' | 'active' | 'inactive') || 'all' });
                  return;
                }

                if (name === 'subjectId') {
                  setFilters({ subjectId: value || undefined });
                  return;
                }

                if (name === 'classId') {
                  setFilters({ classId: value || undefined });
                }
              }}
              onClearFilters={clearFilters}
            />
          }
          onRowClick={(row: TeacherListItem) => navigate(routePaths.teacherEdit.replace(':teacherId', row.id))}
        />
      </Stack>

      <Dialog open={Boolean(pendingDisableTeacherId)} onClose={() => setPendingDisableTeacherId(null)}>
        <DialogTitle>Disable teacher?</DialogTitle>
        <DialogContent>
          {pendingDisableTeacher ? (
            <>
              <Typography sx={{ mb: 1 }}>
                Teacher <strong>{pendingDisableTeacher.fullName}</strong> will lose access to the portal.
              </Typography>
              <Typography color="text.secondary">
                The account will stay in the system but will no longer be able to sign in.
              </Typography>
            </>
          ) : (
            <Typography>The account will stay in the system but will no longer be able to sign in.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDisableTeacherId(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              void handleDisable();
            }}
            disabled={disableMutation.isPending}
          >
            Disable
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
