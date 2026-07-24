import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { BreadcrumbItem } from '../navigation';

type AppBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function AppBreadcrumbs({ items }: AppBreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs aria-label="Breadcrumb navigation" sx={{ mb: 2 }}>
      {items.map((item, index) =>
        index === items.length - 1 ? (
          <Typography key={item.path} color="text.primary" variant="body2" fontWeight={600}>
            {item.label}
          </Typography>
        ) : (
          <Link key={item.path} component={RouterLink} underline="hover" color="inherit" variant="body2" to={item.path}>
            {item.label}
          </Link>
        ),
      )}
    </Breadcrumbs>
  );
}

