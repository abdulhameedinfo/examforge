import { Box, Collapse, Button, Stack, Typography, Divider, Chip } from '@mui/material';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export interface FilterItem {
  key: string;
  label: string;
  value: ReactNode;
  removable?: boolean;
}

export interface FilterPanelProps {
  filters: FilterItem[];
  onFilterChange: (key: string, value: unknown) => void;
  onFilterRemove?: (key: string) => void;
  onClearAll?: () => void;
  activeFilters?: Record<string, unknown>;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  title?: string;
}

export function FilterPanel({
  filters,
  onFilterChange,
  onFilterRemove,
  onClearAll,
  activeFilters = {},
  collapsible = true,
  defaultExpanded = true,
  title = 'Filters',
}: FilterPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const activeFilterCount = Object.keys(activeFilters).filter(
    (key) => activeFilters[key] !== undefined && activeFilters[key] !== ''
  ).length;

  const handleRemove = (key: string) => {
    onFilterRemove?.(key);
    onFilterChange(key, '');
  };

  const handleClearAll = () => {
    onClearAll?.();
    filters.forEach((filter) => {
      onFilterChange(filter.key, '');
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Filter size={18} />
            {title}
          </Typography>
          {activeFilterCount > 0 && (
            <Chip label={activeFilterCount} size="small" color="primary" />
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          {activeFilterCount > 0 && (
            <Button size="small" onClick={handleClearAll} startIcon={<X size={14} />}>
              Clear All
            </Button>
          )}
          {collapsible && (
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </Button>
          )}
        </Stack>
      </Box>

      <Collapse in={!collapsible || expanded}>
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
          <Stack spacing={3}>
            {filters.map((filter) => (
              <Box key={filter.key}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  {filter.label}
                </Typography>
                <Box sx={{ mt: 1 }}>{filter.value}</Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Collapse>

      {activeFilterCount > 0 && collapsible && !expanded && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {Object.entries(activeFilters).map(([key, value]) => {
            if (value === undefined || value === '') return null;
            const filter = filters.find((f) => f.key === key);
            if (!filter) return null;

            return (
              <Chip
                key={key}
                label={`${filter.label}: ${String(value)}`}
                onDelete={filter.removable !== false ? () => handleRemove(key) : undefined}
                size="small"
                variant="outlined"
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}
