import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceMs?: number;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  debounceMs = 300,
  fullWidth = true,
  size = 'medium',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onClear?.();
  };

  return (
    <TextField
      fullWidth={fullWidth}
      size={size}
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={20} />
          </InputAdornment>
        ),
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small" edge="end">
              <X size={18} />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: 2,
        },
      }}
    />
  );
}
