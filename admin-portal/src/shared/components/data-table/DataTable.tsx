import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';

export type DataTableColumn<TItem> = {
  key: string;
  header: string;
  render: (item: TItem) => ReactNode;
  sortKey?: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
};

export type DataTablePagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export type DataTableSorting = {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
};

type DataTableProps<TItem> = {
  columns: DataTableColumn<TItem>[];
  rows: TItem[];
  rowKey: (item: TItem) => string;
  loading?: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  onRowClick?: (item: TItem) => void;
  pagination: DataTablePagination;
  sorting?: DataTableSorting;
  toolbar?: ReactNode;
};

export function DataTable<TItem>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyTitle,
  emptyDescription,
  onRowClick,
  pagination,
  sorting,
  toolbar,
}: DataTableProps<TItem>) {
  const handleSortClick = (sortKey: string) => {
    if (!sorting) {
      return;
    }

    const nextDirection =
      sorting.sortBy === sortKey && sorting.sortDirection === 'asc' ? 'desc' : 'asc';
    sorting.onSortChange(sortKey, nextDirection);
  };

  const rowCount = rows.length;

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {toolbar ? <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>{toolbar}</Box> : null}

      <TableContainer>
        <Table aria-label="Data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const isSorted = sorting?.sortBy === column.sortKey;
                const activeDirection = isSorted ? sorting?.sortDirection : false;

                return (
                  <TableCell
                    key={column.key}
                    align={column.align ?? 'left'}
                    sortDirection={isSorted ? sorting?.sortDirection : false}
                    sx={{ width: column.width }}
                  >
                    {column.sortKey && sorting ? (
                      <TableSortLabel
                        active={isSorted}
                        direction={activeDirection || 'asc'}
                        onClick={() => handleSortClick(column.sortKey!)}
                      >
                        {column.header}
                      </TableSortLabel>
                    ) : (
                      column.header
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rowCount > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  hover={Boolean(onRowClick)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} align={column.align ?? 'left'}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ py: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{emptyTitle}</Typography>
                    {emptyDescription ? (
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {emptyDescription}
                      </Typography>
                    ) : null}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pagination.totalCount}
        page={Math.max(0, pagination.page - 1)}
        onPageChange={(_, nextPage) => pagination.onPageChange(nextPage + 1)}
        rowsPerPage={pagination.pageSize}
        onRowsPerPageChange={(event) => pagination.onPageSizeChange(Number(event.target.value))}
        rowsPerPageOptions={pagination.pageSizeOptions ?? [10, 25, 50]}
      />
    </Paper>
  );
}

