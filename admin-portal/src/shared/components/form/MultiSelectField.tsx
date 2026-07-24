import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useId } from 'react';

export type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiSelectFieldProps = {
  label: string;
  value: string[];
  options: MultiSelectOption[];
  onChange: (value: string[]) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function MultiSelectField({
  label,
  value,
  options,
  onChange,
  error = false,
  helperText,
  placeholder = 'Select one or more items',
  disabled = false,
}: MultiSelectFieldProps) {
  const labelId = useId();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const nextValue = event.target.value;
    onChange(typeof nextValue === 'string' ? nextValue.split(',') : nextValue);
  };

  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        multiple
        label={label}
        value={value}
        onChange={handleChange}
        renderValue={(selected) =>
          selected.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {selected.map((selectedValue) => {
                const option = options.find((item) => item.value === selectedValue);
                return (
                  <Chip
                    key={selectedValue}
                    label={option?.label ?? selectedValue}
                    size="small"
                    variant="outlined"
                  />
                );
              })}
            </Box>
          ) : (
            <Typography color="text.disabled">{placeholder}</Typography>
          )
        }
      >
        {options.length > 0 ? (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
              <Checkbox checked={value.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No options available</MenuItem>
        )}
      </Select>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}
