import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

type AppTextFieldProps = TextFieldProps & { inputProps?: TextFieldProps['inputProps'] };

const fieldSx: TextFieldProps['sx'] = {
  '& .MuiInputBase-root': {
    backgroundColor: 'var(--widget-bg)',
    color: 'var(--text-h)',
    borderRadius: '0.5rem',
  },
  '& .MuiInputBase-input': {
    color: 'var(--text-h)',
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'var(--text)',
    opacity: 0.85,
  },
  '& .MuiInputLabel-root': {
    color: 'var(--text)',
    fontWeight: 600,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--common-btn-bg)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--border)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--common-btn-hover)',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--common-btn-bg)',
    borderWidth: '2px',
  },
  '& .MuiSelect-icon': {
    color: 'var(--text)',
  },
};

const AppTextField = ({ sx, ...props }: AppTextFieldProps) => (
  <TextField
    fullWidth
    size="small"
    variant="outlined"
    sx={[fieldSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    {...props}
  />
);

export default AppTextField;
