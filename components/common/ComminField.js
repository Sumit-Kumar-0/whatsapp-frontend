import React, { useState } from 'react';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    OutlinedInput,
    FormHelperText,
    InputAdornment,
    IconButton,
    Typography,
    Tooltip,
    Chip,
    Autocomplete,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    InfoOutlined,
    CalendarToday,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CommonField = ({
    type = 'text',
    label,
    name,
    placeholder,
    value,
    options = [],
    changeHandler,
    error,
    multiple = false,
    minDate,
    maxDate,
    number = false,
    minValue,
    maxValue,
    disabled = false,
    requiredField = false,
    note = '',
    maxLength,
    onlyText = false,
    rows = 4,
    noteColor = '',
    showPasswordToggle = false,
    compactDisplay = false,
    autoHeight = false,
    minRows = 2,
    maxRows = 10,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (number) {
            if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                changeHandler(event);
            }
        } else if (onlyText) {
            if (/^[a-zA-Z\s]*$/.test(value)) {
                changeHandler(event);
            }
        } else {
            changeHandler(event);
        }
    };

    const handleAutocompleteChange = (event, newValue) => {
        const mockEvent = {
            target: {
                name,
                value: newValue
            }
        };
        changeHandler(mockEvent);
    };

    const handleDateChange = (newValue) => {
        const mockEvent = {
            target: {
                name,
                value: newValue
            }
        };
        changeHandler(mockEvent);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const renderLabel = () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {label}
            {requiredField && <span style={{ color: 'red' }}>*</span>}
            {note && (
                <Tooltip title={note}>
                    <InfoOutlined
                        sx={{
                            fontSize: '16px',
                            color: noteColor || 'text.secondary',
                            cursor: 'pointer'
                        }}
                    />
                </Tooltip>
            )}
        </div>
    );

    // Text, Number, Password, Textarea
    if (['text', 'number', 'password', 'textarea', 'email'].includes(type)) {
        return (
            <TextField
                size='small'
                fullWidth
                type={
                    type === 'password' && showPassword ? 'text' :
                        type === 'number' ? 'text' : type
                }
                label={renderLabel()}
                name={name}
                placeholder={placeholder}
                value={value || ''}
                onChange={handleChange}
                error={!!error}
                helperText={error}
                disabled={disabled}
                requiredField={requiredField}
                multiline={type === 'textarea'}
                rows={type === 'textarea' ? rows : undefined}
                inputProps={{
                    maxLength: maxLength,
                    ...(type === 'number' && {
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                    })
                }}
                InputProps={{
                    endAdornment: type === 'password' && showPasswordToggle ? (
                        <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ) : undefined,
                }}
                sx={{ mb: 2 }}
                {...props}
            />
        );
    }

    // Select Dropdown
    if (type === 'select') {
        return (
<FormControl
  fullWidth
  error={!!error}
  disabled={disabled}
  sx={{
    mb: 2,
    '& .MuiOutlinedInput-root': {
      height: 40, // match textfield height
    },
    '& .MuiInputLabel-root': {
      top: '-6px',
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 14px',
    },
  }}
>
  <InputLabel>{renderLabel()}</InputLabel>
  <Select
    size="small"
    name={name}
    value={multiple ? (value || []) : (value || '')}
    onChange={handleChange}
    multiple={multiple}
    input={<OutlinedInput label={renderLabel()} />}
    renderValue={
      multiple
        ? (selected) => (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {selected.map((value) => {
                const option = options.find((opt) =>
                  typeof opt === 'object' ? opt.value === value : opt === value
                );
                const label = typeof option === 'object' ? option.label : option;
                return <Chip key={value} label={label} size="small" />;
              })}
            </div>
          )
        : undefined
    }
  >
    {options.map((option) => {
      const optionValue = typeof option === 'object' ? option.value : option;
      const optionLabel = typeof option === 'object' ? option.label : option;

      return (
        <MenuItem key={optionValue} value={optionValue}>
          {multiple && (
            <Checkbox
              checked={Array.isArray(value) ? value.includes(optionValue) : false}
            />
          )}
          <ListItemText primary={optionLabel} />
        </MenuItem>
      );
    })}
  </Select>
  {error && <FormHelperText>{error}</FormHelperText>}
</FormControl>
        );
    }

    // Autocomplete
    if (type === 'autocomplete') {
        return (
            <Autocomplete
                multiple={multiple}
                options={options}
                value={value || (multiple ? [] : null)}
                onChange={handleAutocompleteChange}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                getOptionLabel={(option) =>
                    typeof option === 'object' ? option.label : option
                }
                isOptionEqualToValue={(option, value) =>
                    typeof option === 'object' ? option.value === value?.value : option === value
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={renderLabel()}
                        error={!!error}
                        helperText={error}
                        placeholder={placeholder}
                    />
                )}
                disabled={disabled}
                sx={{ mb: 2 }}
                {...props}
            />
        );
    }

    // Date Picker
    if (type === 'date') {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label={renderLabel()}
                    value={value || null}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    disabled={disabled}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            error={!!error}
                            helperText={error}
                            sx={{ mb: 2 }}
                        />
                    )}
                />
            </LocalizationProvider>
        );
    }

    return null;
};

export default CommonField;