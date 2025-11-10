import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  FormHelperText,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add,
  Delete,
  ExpandMore,
  Image,
  VideoFile,
  Description,
  Link
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import CommonField from '../../components/common/ComminField';
import { addTemplate, updateTemplate } from '../../store/slices/vendor/templateSlice';

// Constants
const CATEGORY_OPTIONS = [
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'AUTHENTICATION', label: 'Authentication' }
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'en_US', label: 'English (US)' },
  { value: 'en_GB', label: 'English (UK)' },
  { value: 'es_ES', label: 'Spanish' },
  { value: 'fr_FR', label: 'French' },
  { value: 'de_DE', label: 'German' },
  { value: 'hi_IN', label: 'Hindi' },
  { value: 'pt_BR', label: 'Portuguese (BR)' }
];

const HEADER_TYPES = [
  { value: 'NONE', label: 'No Header', icon: null },
  { value: 'TEXT', label: 'Text Header', icon: null },
  { value: 'IMAGE', label: 'Image Header', icon: <Image /> },
  { value: 'VIDEO', label: 'Video Header', icon: <VideoFile /> },
  { value: 'DOCUMENT', label: 'Document Header', icon: <Description /> }
];

const BUTTON_TYPES = [
  { value: 'QUICK_REPLY', label: 'Quick Reply' },
  { value: 'URL', label: 'Website URL' },
  { value: 'PHONE_NUMBER', label: 'Call to Action' }
];

const TemplateForm = ({ open, onClose, editData, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.templates);

  const [formData, setFormData] = useState({
    name: '',
    category: 'UTILITY',
    language: 'en_US',
    header: {
      type: 'NONE',
      text: '',
      mediaLink: '',
      example: {
        header_handle: ['']
      }
    },
    body: {
      text: '',
      example: {
        body_text: ['']
      }
    },
    footer: {
      text: ''
    },
    buttons: []
  });

  const [errors, setErrors] = useState({});
  const [expandedSection, setExpandedSection] = useState('basic');

  // Initialize form with edit data
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        category: editData.category || 'UTILITY',
        language: editData.language || 'en_US',
        header: editData.header || { type: 'NONE', text: '', mediaLink: '', example: { header_handle: [''] } },
        body: editData.body || { text: '', example: { body_text: [''] } },
        footer: editData.footer || { text: '' },
        buttons: editData.buttons || []
      });
    } else {
      // Reset form for new template
      setFormData({
        name: '',
        category: 'UTILITY',
        language: 'en_US',
        header: {
          type: 'NONE',
          text: '',
          mediaLink: '',
          example: { header_handle: [''] }
        },
        body: {
          text: '',
          example: { body_text: [''] }
        },
        footer: {
          text: ''
        },
        buttons: []
      });
    }
    setErrors({});
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleHeaderTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      header: {
        ...prev.header,
        type,
        text: type === 'TEXT' ? prev.header.text : '',
        mediaLink: type !== 'TEXT' && type !== 'NONE' ? prev.header.mediaLink : ''
      }
    }));
  };

  const handleBodyExampleChange = (index, value) => {
    const newExamples = [...formData.body.example.body_text];
    newExamples[index] = value;
    
    setFormData(prev => ({
      ...prev,
      body: {
        ...prev.body,
        example: {
          body_text: newExamples
        }
      }
    }));
  };

  const addBodyExample = () => {
    setFormData(prev => ({
      ...prev,
      body: {
        ...prev.body,
        example: {
          body_text: [...prev.body.example.body_text, '']
        }
      }
    }));
  };

  const removeBodyExample = (index) => {
    const newExamples = formData.body.example.body_text.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      body: {
        ...prev.body,
        example: {
          body_text: newExamples
        }
      }
    }));
  };

  // Button management
  const addButton = () => {
    if (formData.buttons.length >= 3) {
      setErrors(prev => ({ ...prev, buttons: 'Maximum 3 buttons allowed' }));
      return;
    }

    const newButton = {
      type: 'QUICK_REPLY',
      text: '',
      url: '',
      phoneNumber: '',
      example: ['']
    };

    setFormData(prev => ({
      ...prev,
      buttons: [...prev.buttons, newButton]
    }));
  };

  const updateButton = (index, field, value) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons[index] = {
      ...updatedButtons[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      buttons: updatedButtons
    }));
  };

  const removeButton = (index) => {
    const updatedButtons = formData.buttons.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      buttons: updatedButtons
    }));
  };

  const handleButtonExampleChange = (buttonIndex, exampleIndex, value) => {
    const updatedButtons = [...formData.buttons];
    const examples = [...updatedButtons[buttonIndex].example];
    examples[exampleIndex] = value;
    updatedButtons[buttonIndex].example = examples;
    
    setFormData(prev => ({
      ...prev,
      buttons: updatedButtons
    }));
  };

  const addButtonExample = (buttonIndex) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons[buttonIndex].example.push('');
    
    setFormData(prev => ({
      ...prev,
      buttons: updatedButtons
    }));
  };

  const removeButtonExample = (buttonIndex, exampleIndex) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons[buttonIndex].example = updatedButtons[buttonIndex].example.filter((_, i) => i !== exampleIndex);
    
    setFormData(prev => ({
      ...prev,
      buttons: updatedButtons
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Basic info validation
    if (!formData.name.trim()) newErrors.name = 'Template name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.language) newErrors.language = 'Language is required';

    // Body validation
    if (!formData.body.text.trim()) newErrors.body = 'Body text is required';
    if (formData.body.text.length > 1024) newErrors.body = 'Body text cannot exceed 1024 characters';

    // Header validation
    if (formData.header.type === 'TEXT' && !formData.header.text.trim()) {
      newErrors.header = 'Header text is required for text header';
    }
    if (formData.header.type === 'TEXT' && formData.header.text.length > 60) {
      newErrors.header = 'Header text cannot exceed 60 characters';
    }
    if ((formData.header.type === 'IMAGE' || formData.header.type === 'VIDEO' || formData.header.type === 'DOCUMENT') && !formData.header.mediaLink.trim()) {
      newErrors.header = 'Media URL is required for media header';
    }

    // Footer validation
    if (formData.footer.text && formData.footer.text.length > 60) {
      newErrors.footer = 'Footer text cannot exceed 60 characters';
    }

    // Button validation
    formData.buttons.forEach((button, index) => {
      if (!button.text.trim()) {
        newErrors[`button_${index}`] = 'Button text is required';
      }
      if (button.text.length > 20) {
        newErrors[`button_${index}`] = 'Button text cannot exceed 20 characters';
      }
      if (button.type === 'URL' && !button.url.trim()) {
        newErrors[`button_${index}_url`] = 'URL is required for website buttons';
      }
      if (button.type === 'PHONE_NUMBER' && !button.phoneNumber.trim()) {
        newErrors[`button_${index}_phone`] = 'Phone number is required for call to action buttons';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editData) {
        await dispatch(updateTemplate({
          templateId: editData._id,
          templateData: formData
        })).unwrap();
      } else {
        await dispatch(addTemplate(formData)).unwrap();
      }
      
      onSuccess();
    } catch (error) {
      setErrors({ submit: error });
    }
  };

  const handleSectionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="bold">
          {editData ? 'Edit Template' : 'Create New Template'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {editData ? 'Update your message template' : 'Create a new WhatsApp message template'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Accordion 
            expanded={expandedSection === 'basic'} 
            onChange={handleSectionChange('basic')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CommonField
                    type="text"
                    label="Template Name"
                    name="name"
                    placeholder="Enter template name (e.g., order_confirmation)"
                    value={formData.name}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.name}
                    note="Unique name for your template. Use lowercase letters and underscores."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      label="Category"
                      onChange={handleChange}
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormHelperText error>{errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.language}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      name="language"
                      value={formData.language}
                      label="Language"
                      onChange={handleChange}
                    >
                      {LANGUAGE_OPTIONS.map((language) => (
                        <MenuItem key={language.value} value={language.value}>
                          {language.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.language && (
                      <FormHelperText error>{errors.language}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Header Section */}
          <Accordion 
            expanded={expandedSection === 'header'} 
            onChange={handleSectionChange('header')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Header</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.header}>
                    <InputLabel>Header Type</InputLabel>
                    <Select
                      value={formData.header.type}
                      label="Header Type"
                      onChange={handleHeaderTypeChange}
                    >
                      {HEADER_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {type.icon}
                            {type.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.header && (
                      <FormHelperText error>{errors.header}</FormHelperText>
                    )}
                    <FormHelperText>
                      Choose the type of header for your template
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {formData.header.type === 'TEXT' && (
                  <Grid item xs={12}>
                    <CommonField
                      type="text"
                      label="Header Text"
                      name="header.text"
                      placeholder="Enter header text (max 60 characters)"
                      value={formData.header.text}
                      changeHandler={handleChange}
                      requiredField={true}
                      error={errors.header}
                      note="Text that appears at the top of your message"
                    />
                  </Grid>
                )}

                {(formData.header.type === 'IMAGE' || formData.header.type === 'VIDEO' || formData.header.type === 'DOCUMENT') && (
                  <Grid item xs={12}>
                    <CommonField
                      type="text"
                      label="Media URL"
                      name="header.mediaLink"
                      placeholder="https://example.com/image.jpg"
                      value={formData.header.mediaLink}
                      changeHandler={handleChange}
                      requiredField={true}
                      error={errors.header}
                      note="Public URL of the image, video, or document"
                    />
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Body Section */}
          <Accordion 
            expanded={expandedSection === 'body'} 
            onChange={handleSectionChange('body')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Body</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CommonField
                    type="textarea"
                    label="Body Text"
                    name="body.text"
                    placeholder="Enter your main message content..."
                    value={formData.body.text}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.body}
                    note="Main content of your message. Use {{1}} for variables. Max 1024 characters."
                    rows={4}
                    maxLength={1024}
                  />
                </Grid>

                {/* Body Examples */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Example Messages
                  </Typography>
                  {formData.body.example.body_text.map((example, index) => (
                    <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder={`Example ${index + 1}`}
                        value={example}
                        onChange={(e) => handleBodyExampleChange(index, e.target.value)}
                        helperText={`Shown as preview when creating template`}
                      />
                      {formData.body.example.body_text.length > 1 && (
                        <IconButton 
                          size="small" 
                          onClick={() => removeBodyExample(index)}
                          sx={{ mt: 0.5 }}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={addBodyExample}
                    disabled={formData.body.example.body_text.length >= 3}
                  >
                    Add Example
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Footer Section */}
          <Accordion 
            expanded={expandedSection === 'footer'} 
            onChange={handleSectionChange('footer')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Footer</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CommonField
                    type="text"
                    label="Footer Text"
                    name="footer.text"
                    placeholder="Optional footer text (max 60 characters)"
                    value={formData.footer.text}
                    changeHandler={handleChange}
                    error={errors.footer}
                    note="Text that appears at the bottom of your message"
                    maxLength={60}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Buttons Section */}
          <Accordion 
            expanded={expandedSection === 'buttons'} 
            onChange={handleSectionChange('buttons')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">
                Buttons ({formData.buttons.length}/3)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {formData.buttons.map((button, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="subtitle1">
                            Button {index + 1}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => removeButton(index)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                              <InputLabel>Button Type</InputLabel>
                              <Select
                                value={button.type}
                                label="Button Type"
                                onChange={(e) => updateButton(index, 'type', e.target.value)}
                              >
                                {BUTTON_TYPES.map((type) => (
                                  <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} sm={8}>
                            <TextField
                              fullWidth
                              label="Button Text"
                              value={button.text}
                              onChange={(e) => updateButton(index, 'text', e.target.value)}
                              error={!!errors[`button_${index}`]}
                              helperText={errors[`button_${index}`] || 'Text displayed on the button (max 20 chars)'}
                              size="small"
                            />
                          </Grid>

                          {button.type === 'URL' && (
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Website URL"
                                value={button.url}
                                onChange={(e) => updateButton(index, 'url', e.target.value)}
                                error={!!errors[`button_${index}_url`]}
                                helperText={errors[`button_${index}_url`] || 'URL that opens when button is clicked'}
                                size="small"
                                placeholder="https://example.com"
                              />
                            </Grid>
                          )}

                          {button.type === 'PHONE_NUMBER' && (
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Phone Number"
                                value={button.phoneNumber}
                                onChange={(e) => updateButton(index, 'phoneNumber', e.target.value)}
                                error={!!errors[`button_${index}_phone`]}
                                helperText={errors[`button_${index}_phone`] || 'Phone number to call when button is clicked'}
                                size="small"
                                placeholder="+1234567890"
                              />
                            </Grid>
                          )}

                          {/* Button Examples */}
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                              Button Examples
                            </Typography>
                            {button.example.map((example, exampleIndex) => (
                              <Box key={exampleIndex} sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder={`Example ${exampleIndex + 1}`}
                                  value={example}
                                  onChange={(e) => handleButtonExampleChange(index, exampleIndex, e.target.value)}
                                />
                                {button.example.length > 1 && (
                                  <IconButton 
                                    size="small" 
                                    onClick={() => removeButtonExample(index, exampleIndex)}
                                  >
                                    <Delete />
                                  </IconButton>
                                )}
                              </Box>
                            ))}
                            <Button
                              size="small"
                              startIcon={<Add />}
                              onClick={() => addButtonExample(index)}
                            >
                              Add Example
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addButton}
                    disabled={formData.buttons.length >= 3}
                    fullWidth
                  >
                    Add Button ({3 - formData.buttons.length} remaining)
                  </Button>
                  {errors.buttons && (
                    <FormHelperText error sx={{ mt: 1 }}>
                      {errors.buttons}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Template Preview */}
          <Accordion 
            expanded={expandedSection === 'preview'} 
            onChange={handleSectionChange('preview')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Template Preview</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {formData.name || 'Template Name'}
                  </Typography>
                  
                  {/* Header Preview */}
                  {formData.header.type !== 'NONE' && (
                    <>
                      <Typography variant="caption" color="primary" display="block" gutterBottom>
                        HEADER
                      </Typography>
                      {formData.header.type === 'TEXT' ? (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {formData.header.text || '[Header text will appear here]'}
                        </Typography>
                      ) : (
                        <Box sx={{ 
                          bgcolor: 'grey.200', 
                          height: 60, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: 1,
                          mb: 2
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            {formData.header.type} HEADER
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  {/* Body Preview */}
                  <Typography variant="caption" color="primary" display="block" gutterBottom>
                    BODY
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                    {formData.body.text || '[Message body will appear here]'}
                  </Typography>

                  {/* Footer Preview */}
                  {formData.footer.text && (
                    <>
                      <Typography variant="caption" color="primary" display="block" gutterBottom>
                        FOOTER
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {formData.footer.text}
                      </Typography>
                    </>
                  )}

                  {/* Buttons Preview */}
                  {formData.buttons.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="caption" color="primary" display="block" gutterBottom>
                        BUTTONS
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {formData.buttons.map((button, index) => (
                          <Chip
                            key={index}
                            label={button.text || `Button ${index + 1}`}
                            variant="outlined"
                            size="small"
                            sx={{ alignSelf: 'flex-start' }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Submit Error */}
          {errors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.submit}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : (editData ? 'Update Template' : 'Create Template')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateForm;