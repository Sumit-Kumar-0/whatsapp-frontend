import { Chip, makeStyles, TextField, Typography, Checkbox, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import Icon from '@material-ui/core/Icon';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        padding: '0px',
        position: 'relative',
        marginBottom: '4px',
    },
    labelContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '7px',
    },
    labelMain: {
        fontSize: '12px',
        fontWeight: '400',
        marginRight: theme.spacing(0.5),
    },
    error: {
        color: theme.palette.error.main,
        marginTop: theme.spacing(0.2),
        fontSize: '0.75rem',
    },
    noteIcon: (props) => ({
        fontSize: '1rem',
        color: props.noteColor || theme.palette.text.secondary,
        marginLeft: theme.spacing(0.5),
        cursor: 'pointer',
        pointerEvents: 'auto',
    }),
    labelWithNote: {
        display: 'flex',
        alignItems: 'center',
    },
    numberInput: {
        '& input[type=number]': {
            MozAppearance: 'textfield',
            appearance: 'textfield',
        },
        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
        },
    },
    checkbox: {
        padding: '4px 8px',
    },
    option: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '1.5',
        padding: '2px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
    },
    compactOption: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '1.5',
        padding: '2px 0',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
    },
    compactOptionCode: {
        fontWeight: 500,
        color: theme.palette.primary.main,
        flexShrink: 0,
        marginRight: '8px',
    },
    compactOptionDescription: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
    },
    tooltip: {
        zIndex: theme.zIndex.tooltip + 1,
        maxWidth: 300,
    },
    inputRoot: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            height: '40px',
            padding: '0',
        },
        '& .MuiOutlinedInput-input': {
            height: '40px',
            padding: '0 14px',
            boxSizing: 'border-box',
            fontSize: '14px',
        },
        '& .MuiOutlinedInput-adornedEnd': {
            paddingRight: '0',
            '& .MuiOutlinedInput-input': {
                paddingRight: '0',
            },
        },
        '& .MuiOutlinedInput-adornedStart': {
            paddingLeft: '0',
            '& .MuiOutlinedInput-input': {
                paddingLeft: '0',
            },
        },
        '& .MuiInputLabel-outlined': {
            transform: 'translate(14px, 12px) scale(1)',
        },
        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
            transform: 'translate(14px, -6px) scale(0.75)',
        },
    },
    textareaRoot: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            padding: '0',
            minHeight: '40px',
        },
        '& .MuiOutlinedInput-input': {
            padding: '10px 14px',
            boxSizing: 'border-box',
            fontSize: '14px',
            lineHeight: '1.5',
        },
        '& .MuiOutlinedInput-multiline': {
            padding: '0',
        },
        '& .MuiInputLabel-outlined': {
            transform: 'translate(14px, 12px) scale(1)',
        },
        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
            transform: 'translate(14px, -6px) scale(0.75)',
        },
    },
    autocompleteRoot: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            padding: '0 0 0 4px !important',
            minHeight: '40px',
            height: 'auto',
        },
        '& .MuiOutlinedInput-input': {
            padding: '0 14px !important',
            height: '40px',
            boxSizing: 'border-box',
        },
        '& .MuiAutocomplete-endAdornment': {
            right: '8px',
            top: 'calc(50% - 12px)',
        },
        '& .MuiAutocomplete-tag': {
            margin: '2px',
            maxWidth: 'calc(100% - 6px)',
        },
        '& .MuiChip-root': {
            height: '24px',
        },
        '& .MuiInputLabel-outlined': {
            transform: 'translate(14px, 12px) scale(1)',
        },
        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
            transform: 'translate(14px, -6px) scale(0.75)',
        },
    },
    datePickerRoot: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            height: '40px',
            padding: '0',
        },
        '& .MuiOutlinedInput-input': {
            height: '40px',
            padding: '0 14px',
            boxSizing: 'border-box',
            fontSize: '14px',
        },
        '& .MuiOutlinedInput-adornedEnd': {
            paddingRight: '8px',
        },
        '& .MuiInputAdornment-root': {
            marginLeft: '0',
        },
        '& .MuiInputLabel-outlined': {
            transform: 'translate(14px, 12px) scale(1)',
        },
        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
            transform: 'translate(14px, -6px) scale(0.75)',
        },
    },
    charCount: {
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(0.2),
        fontSize: '0.75rem',
        textAlign: 'right',
        paddingRight: '2px',
    },
    chip: {
        maxWidth: '120px',
        height: '24px',
        '& .MuiChip-label': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingLeft: '8px',
            paddingRight: '8px',
            fontSize: '13px',
        },
    },
    disabledField: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#f5f5f5',
        },
        '& .MuiOutlinedInput-input': {
            color: '#666666',
            WebkitTextFillColor: '#666666',
        },
    },
}));

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
    getOptionLabel = null,
    getOptionValue = null,
    isOptionEqualToValue = null,
    disabled = false,
    enter = true,
    required = true,
    note = '',
    InputLabelProps = false,
    maxLength = type === 'textarea' ? 1000 : null,
    onlyText = false,
    onInputChange = null,
    inputValue = '',
    filterOptions = null,
    noOptionsText = 'No options',
    loading = false,
    rows = 4,
    noteColor = '',
    maxDecimalPlaces = 2,
    compactDisplay = false,
    autoHeight = false,
    minRows = 2,
    maxRows = 10,
}) => {
    const classes = useStyles({ noteColor });

    const normalizedValue = multiple && (type === 'select' || type === 'searchSelect')
        ? Array.isArray(value) ? value : value ? [value] : []
        : value || ((type === 'select' || type === 'searchSelect') ? null : '');
    const finalGetOptionLabel = getOptionLabel || ((option) => {
        if (!option) return '';
        if (typeof option === 'string') return option;
        if (compactDisplay && option.Code && option.Description) {
            return `${option.Code} - ${option.Description}`;
        }
        return option.attributeTypeDescription || '';
    });
    const isValidText = (text) => onlyText ? /^[a-zA-Z\s.,'"()-]*$/.test(text) : true;
    const validateDecimalPlaces = (inputValue) => {
        if (!inputValue || !inputValue.includes('.')) return true;
        const decimalPart = inputValue.split('.')[1];
        return decimalPart ? decimalPart.length <= maxDecimalPlaces : true;
    };
    const handleChange = (e, newValue, reason) => {
        if (!multiple) {
            changeHandler(e, newValue);
            return;
        }
        if (options.length === 0) {
            changeHandler(e, []);
            return;
        }
        const selectAllOption = newValue?.find((opt) => opt?.isSelectAll);
        const regularOptions = options.filter((opt) => !opt?.isSelectAll);
        if (selectAllOption) {
            const allSelected = normalizedValue?.length === regularOptions.length;
            changeHandler(e, allSelected ? [] : regularOptions);
        } else {
            changeHandler(e, newValue?.filter((opt) => !opt?.isSelectAll));
        }
    };
    const handleInputChange = (e) => {
        const val = e.target.value;
        const trimmedVal = val.trim();
        if (type === 'text' && onlyText && !isValidText(val)) return;
        if (maxLength && val.length > maxLength && !number) return;
        if (number) {
            const numericVal = Number(trimmedVal);
            if (
                trimmedVal === '' ||
                (!isNaN(numericVal) &&
                    (minValue === undefined || numericVal >= minValue) &&
                    (maxValue === undefined || numericVal <= maxValue) &&
                    validateDecimalPlaces(val))
            ) {
                changeHandler(e);
            }
        } else {
            changeHandler(e);
        }
    };
    const handleDateChange = (date) => {
        changeHandler({
            target: {
                name,
                value: moment(date?._d).format('YYYY-MM-DD'),
            },
        });
    };
    const labelContent = (
        <span className={InputLabelProps ? classes.labelContainer : classes.labelWithNote}>
            {label} {required && <span style={{ color: 'red' }}>*</span>}
            {note && (
                <Tooltip
                    title={note}
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                    disableFocusListener
                    disableTouchListener
                >
                    <InfoOutlinedIcon className={classes.noteIcon} />
                </Tooltip>
            )}
        </span>
    );
    const autocompleteOptions = multiple && options?.length > 0
        ? [{ isSelectAll: true, attributeTypeDescription: 'Select All' }, ...options]
        : options;
    const currentLength = !number ? (normalizedValue || '').toString().length : 0;
    const isLengthError = !number && maxLength && currentLength > maxLength;
    const calculateRows = () => {
        if (!autoHeight || type !== 'textarea') return rows;
        const content = normalizedValue || '';
        const lineCount = content.split('\n').length;
        const estimatedRows = Math.max(lineCount, minRows);
        return Math.min(estimatedRows, maxRows);
    };
    const truncateLabel = (label, maxLength = 12) => {
        return label.length <= maxLength ? label : `${label.substring(0, maxLength - 3)}...`;
    };
    const getCurrentMonthFirstDate = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    };
    const renderTags = (value, getTagProps) => {
        const displayTags = value?.slice(0, 2) || [];
        const remainingCount = (value?.length || 0) - 2;
        return (
            <>
                {displayTags.map((option, index) => (
                    <Chip
                        size='small'
                        key={index}
                        color="primary"
                        label={truncateLabel(finalGetOptionLabel(option))}
                        className={classes.chip}
                        {...getTagProps({ index })}
                    />
                ))}
                {remainingCount > 0 && (
                    <Chip
                        size='small'
                        color='default'
                        label={`+${remainingCount}`}
                        className={classes.chip}
                    />
                )}
            </>
        );
    };
    const renderOption = (option, { selected }) => {
        if (multiple) {
            if (option?.isSelectAll) {
                const regularOptions = options.filter((opt) => !opt?.isSelectAll);
                const allSelected = normalizedValue?.length === regularOptions.length;
                return (
                    <>
                        <Checkbox
                            className={classes.checkbox}
                            checked={allSelected}
                            indeterminate={normalizedValue?.length > 0 && !allSelected}
                        />
                        <Typography className={classes.option}>Select All</Typography>
                    </>
                );
            }
            return (
                <>
                    <Checkbox
                        className={classes.checkbox}
                        checked={selected}
                    />
                    <Typography className={compactDisplay ? classes.compactOption : classes.option}>
                        {compactDisplay && option.Code && option.Description ? (
                            <>
                                <span className={classes.compactOptionCode}>{option.Code}</span>
                                <span className={classes.compactOptionDescription}>- {option.Description}</span>
                            </>
                        ) : (
                            finalGetOptionLabel(option)
                        )}
                    </Typography>
                </>
            );
        }
        return (
            <Typography className={compactDisplay ? classes.compactOption : classes.option}>
                {compactDisplay && option.Code && option.Description ? (
                    <>
                        <span className={classes.compactOptionCode}>{option.Code}</span>
                        <span className={classes.compactOptionDescription}>- {option.Description}</span>
                    </>
                ) : (
                    finalGetOptionLabel(option)
                )}
            </Typography>
        );
    };
    const renderInput = (params) => {
        const hasValue = multiple ? normalizedValue?.length > 0 : normalizedValue;
        return (
            <TextField
                {...params}
                label={!InputLabelProps ? labelContent : undefined}
                placeholder={!hasValue ? (placeholder || (type === 'searchSelect' ? 'Search...' : 'Select...')) : ''}
                variant="outlined"
                error={!!error}
                InputLabelProps={InputLabelProps ? { shrink: true } : undefined}
                InputProps={{
                    ...params.InputProps,
                    ...(type === 'searchSelect' && loading && {
                        endAdornment: (
                            <React.Fragment>
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }),
                }}
            />
        );
    };
    if (type === 'select' || type === 'searchSelect') {
        return (
            <div className={classes.container}>
                {InputLabelProps && labelContent}
                <Autocomplete
                    className={`${classes.autocompleteRoot} ${disabled ? classes.disabledField : ''}`}
                    disabled={disabled}
                    multiple={multiple}
                    id={name}
                    fullWidth
                    options={autocompleteOptions || []}
                    size="small"
                    value={normalizedValue}
                    disableCloseOnSelect={multiple}
                    getOptionLabel={(opt) => {
                        const label = finalGetOptionLabel(opt);
                        return typeof label === 'string' ? label : '';
                    }}
                    getOptionSelected={
                        isOptionEqualToValue ||
                        ((option, value) => getOptionValue ? getOptionValue(option) === getOptionValue(value) : option === value)
                    }
                    renderTags={renderTags}
                    onChange={handleChange}
                    {...(type === 'searchSelect' && {
                        onInputChange: onInputChange,
                        inputValue: inputValue,
                        filterOptions: filterOptions || ((options) => options),
                        noOptionsText: noOptionsText,
                        loading: loading
                    })}
                    renderOption={renderOption}
                    renderInput={renderInput}
                />
                {error && (
                    <Typography variant="body2" className={classes.error}>
                        {error}
                    </Typography>
                )}
            </div>
        );
    }
    if (type === 'date') {
        return (
            <div className={classes.container}>
                {InputLabelProps && labelContent}
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                        className={`${classes.datePickerRoot} ${disabled ? classes.disabledField : ''}`}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <Icon
                                    className="icon icon-calendar"
                                    style={{
                                        fontSize: 18,
                                        marginRight: '4px',
                                    }}
                                />
                            ),
                        }}
                        label={!InputLabelProps ? labelContent : undefined}
                        value={value ? new Date(value) : null}
                        name={name}
                        onChange={handleDateChange}
                        format="DD-MM-YYYY"
                        size="small"
                        inputVariant="outlined"
                        fullWidth
                        error={!!error}
                        disabled={disabled}
                        minDate={minDate ? new Date(minDate) : getCurrentMonthFirstDate()}
                        maxDate={maxDate ? new Date(maxDate) : undefined}
                        placeholder={placeholder || 'Select date'}
                        helperText=""
                        InputLabelProps={InputLabelProps ? { shrink: true } : undefined}
                    />
                </MuiPickersUtilsProvider>
                {error && (
                    <Typography variant="body2" className={classes.error}>
                        {error}
                    </Typography>
                )}
            </div>
        );
    }
    return (
        <div className={classes.container}>
            {InputLabelProps && labelContent}
            <TextField
                className={`${type === 'number' || number ? classes.numberInput : ''} ${type === 'textarea' ? classes.textareaRoot : classes.inputRoot} ${disabled ? classes.disabledField : ''}`}
                inputProps={{
                    maxLength: !number ? maxLength : undefined,
                }}
                fullWidth
                label={!InputLabelProps ? labelContent : undefined}
                name={name}
                type={type === 'textarea' ? undefined : number ? 'text' : type}
                variant="outlined"
                size="small"
                id={name}
                placeholder={placeholder || ''}
                InputLabelProps={InputLabelProps ? { shrink: true } : undefined}
                value={normalizedValue}
                onChange={handleInputChange}
                error={!!error || isLengthError}
                disabled={disabled}
                multiline={type === 'textarea'}
                rows={type === 'textarea' ? calculateRows() : undefined}
                {...(type === 'textarea' && autoHeight && {
                    minRows: minRows,
                    maxRows: maxRows,
                })}
            />
            {error && (
                <Typography variant="body2" className={classes.error}>
                    {error}
                </Typography>
            )}
            {!number && maxLength && type === 'textarea' && (
                <Typography variant="body2" className={isLengthError ? classes.error : classes.charCount}>
                    {currentLength}/{maxLength}
                </Typography>
            )}
        </div>
    );
};

export default CommonField;