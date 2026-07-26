import { FormControl, InputLabel, Select, MenuItem, SelectProps, FormHelperText } from '@mui/material';

export interface AppSelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface AppSelectProps<T = string> extends Omit<SelectProps<T>, 'variant'> {
  label?: string;
  options: AppSelectOption<T>[];
  helperText?: string;
  error?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
}

export function AppSelect<T = string>({
  label,
  options,
  helperText,
  error,
  variant = 'outlined',
  fullWidth = true,
  ...props
}: AppSelectProps<T>) {
  return (
    <FormControl fullWidth={fullWidth} variant={variant} error={error}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        label={label}
        {...props}
      >
        {options.map((option) => (
          <MenuItem
            key={String(option.value)}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
