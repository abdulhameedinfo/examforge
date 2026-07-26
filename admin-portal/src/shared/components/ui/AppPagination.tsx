import { Pagination, PaginationItem, Box, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from 'lucide-react';

export interface AppPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  pageSize?: number;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  disabled?: boolean;
}

export function AppPagination({
  count,
  page,
  onChange,
  pageSize = 10,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstButton = true,
  showLastButton = true,
  disabled = false,
}: AppPaginationProps) {
  const totalPages = Math.ceil(count / pageSize);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Page {page} of {totalPages}
      </Typography>
      <Pagination
        count={totalPages}
        page={page}
        onChange={onChange}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        disabled={disabled}
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: ChevronLeft,
              next: ChevronRight,
              first: showFirstButton ? FirstPage : () => null,
              last: showLastButton ? LastPage : () => null,
            }}
            {...item}
          />
        )}
      />
    </Box>
  );
}
