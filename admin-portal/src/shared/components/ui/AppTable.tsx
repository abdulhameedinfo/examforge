import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  Checkbox,
  TableSortLabel,
} from '@mui/material';
import type { ReactNode } from 'react';

export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortKey?: string;
}

export interface AppTableProps<T = unknown> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey?: (row: T) => string;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (rowId: string) => void;
  onRowClick?: (row: T) => void;
  onSortChange?: (sortKey: string, direction: 'asc' | 'desc') => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
  };
}

export function AppTable<T = unknown>({
  columns,
  rows,
  rowKey = (_, index) => index.toString(),
  loading = false,
  empty = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no items to display',
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onRowClick,
  onSortChange,
  sortBy,
  sortDirection,
  pagination,
}: AppTableProps<T>) {
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !column.sortKey || !onSortChange) return;
    
    const direction = sortBy === column.sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(column.sortKey, direction);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allSelected = event.target.checked;
    rows.forEach((row) => {
      const id = rowKey(row, rows.indexOf(row));
      if (allSelected && !selectedRows.includes(id)) {
        onRowSelect?.(id);
      } else if (!allSelected && selectedRows.includes(id)) {
        onRowSelect?.(id);
      }
    });
  };

  const isAllSelected = rows.length > 0 && selectedRows.length === rows.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < rows.length;

  if (empty && !loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {emptyTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emptyDescription}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isSomeSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  width={column.width}
                  align={column.align || 'left'}
                  sortDirection={sortBy === column.sortKey ? sortDirection : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.sortKey}
                      direction={sortDirection || 'asc'}
                      onClick={() => handleSort(column)}
                    >
                      {column.header}
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                  <Typography color="text.secondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                  <Typography color="text.secondary">No data</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const id = rowKey(row, index);
                const isSelected = selectedRows.includes(id);

                return (
                  <TableRow
                    key={id}
                    hover
                    selected={isSelected}
                    onClick={() => onRowClick?.(row)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onRowSelect?.(id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        width={column.width}
                        align={column.align || 'left'}
                      >
                        {column.render ? column.render(row, index) : (row as any)[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.totalCount}
          page={pagination.page}
          onPageChange={(_, page) => pagination.onPageChange(page)}
          rowsPerPage={pagination.pageSize}
          onRowsPerPageChange={(e) => pagination.onPageSizeChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={pagination.pageSizeOptions || [10, 25, 50]}
        />
      )}
    </Box>
  );
}
