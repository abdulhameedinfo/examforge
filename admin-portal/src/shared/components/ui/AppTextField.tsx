import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface AppTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  showPasswordToggle?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
}

export function AppTextField({
  type = 'text',
  showPasswordToggle = false,
  startIcon,
  endIcon,
  onEndIconClick,
  ...props
}: AppTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordType = type === 'password';
  const actualType = isPasswordType && showPassword ? 'text' : type;

  const endAdornment = (
    <InputAdornment position="end">
      {showPasswordToggle && isPasswordType ? (
        <IconButton
          onClick={togglePasswordVisibility}
          edge="end"
          size="small"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </IconButton>
      ) : endIcon ? (
        <IconButton onClick={onEndIconClick} edge="end" size="small">
          {endIcon}
        </IconButton>
      ) : null}
    </InputAdornment>
  );

  return (
    <TextField
      type={actualType}
      variant="outlined"
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: endAdornment || showPasswordToggle ? endAdornment : undefined,
      }}
      {...props}
    />
  );
}
