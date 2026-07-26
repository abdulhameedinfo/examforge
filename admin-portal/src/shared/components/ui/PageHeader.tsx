import { Box, Stack, Typography, Breadcrumbs, BreadcrumbItem, Chip, IconButton, Tooltip } from '@mui/material';
import { Home, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
  showHomeIcon?: boolean;
  onBack?: () => void;
  loading?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  icon,
  badge,
  showHomeIcon = true,
  onBack,
  loading = false,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<ChevronRight size={16} />}
          sx={{ mb: 2 }}
          aria-label="breadcrumb"
        >
          {showHomeIcon && (
            <BreadcrumbItem
              component="a"
              href="/"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Home size={16} />
            </BreadcrumbItem>
          )}
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem
              key={index}
              component={item.href ? 'a' : 'span'}
              href={item.href}
              onClick={item.onClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: item.href || item.onClick ? 'pointer' : 'default',
                color: index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
                fontWeight: index === breadcrumbs.length - 1 ? 500 : 400,
              }}
            >
              {item.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {onBack && (
              <Tooltip title="Go back">
                <IconButton onClick={onBack} size="small">
                  <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </IconButton>
              </Tooltip>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
              <Typography variant="h4" fontWeight={600}>
                {loading ? 'Loading...' : title}
              </Typography>
              {badge && (
                <Chip label={badge} size="small" color="primary" variant="outlined" />
              )}
            </Box>
          </Box>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
        {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
      </Box>
    </Box>
  );
}
