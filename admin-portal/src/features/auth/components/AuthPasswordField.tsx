import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type AuthPasswordFieldProps = TextFieldProps;

export const AuthPasswordField = forwardRef<HTMLInputElement, AuthPasswordFieldProps>(function AuthPasswordField(
  props,
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      inputRef={ref}
      type={visible ? 'text' : 'password'}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              type="button"
              onClick={() => setVisible((current) => !current)}
              edge="end"
              aria-label={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
});

