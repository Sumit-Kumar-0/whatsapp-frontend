import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import CommonField from '../common/ComminField';
// import CommonField from './CommonField';

// Constants
const REFERRAL_SOURCES = [
  'Recommended by friend / colleague',
  'Online search',
  'Online advertisement',
  'Event, conference or training',
  'Saw someone using it',
  'Youtube / Social media',
  'ChatGPT / Perplexity / other AI tool',
  'Other / don\'t remember'
].map(source => ({ value: source, label: source }));

const BUSINESS_CATEGORIES = [
  'Education',
  'eCommerce / DTC store',
  'Marketing Agency',
  'Healthcare',
  'Finance & Insurance',
  'Travel',
  'Automobile',
  'Real Estate',
  'IT Services & Internet',
  'Offline & Retail',
  'Events & Webinar',
  'Other'
].map(category => ({ value: category, label: category }));

const COMPANY_SIZES = [
  '1',
  '2 - 10',
  '11 - 50',
  '51 - 250',
  '251 - 1k',
  '1k - 5k',
  '5k+'
].map(size => ({ value: size, label: size }));

const ROLES = [
  'Executive (CXO / VP / Founder)',
  'Manager (Team Lead / Department Head)',
  'Marketing Professional',
  'Sales Representative',
  'Technical Team (Developer / Engineer)',
  'Freelancer / Consultant',
  'Other'
].map(role => ({ value: role, label: role }));

const CONTACT_SIZES = [
  'Less than 1,000 contacts',
  '1,000 to 5,000 contacts',
  '5,000 to 25,000 contacts',
  'Over 25,000 contacts'
].map(size => ({ value: size, label: size }));

const BUDGET_RANGES = [
  'Under $100',
  '$101 to $500',
  '$501 to $1000',
  '$1001 to $2000',
  '$2001 to $5000',
  '$5001 to $10000',
  '$10001 and above',
  'Not sure'
].map(budget => ({ value: budget, label: budget }));

const USE_CASES = [
  'Sending bulk marketing WhatsApp messages to my contacts',
  'Integrating WhatsApp on my website / 3rd party apps to send transactional messages',
  'Both'
].map(useCase => ({ value: useCase, label: useCase }));

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
];

const COUNTRY_CODES = [
  { value: '+1', label: '+1 (US/Canada)' },
  { value: '+91', label: '+91 (India)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+61', label: '+61 (Australia)' },
  { value: '+49', label: '+49 (Germany)' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const VendorForm = ({ open, onClose, editData = null }) => {
  const loading = false;
  
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Password field added
    whatsappCountryCode: '',
    whatsappNumber: '',
    
    // Business Details
    businessName: '',
    businessCountry: '',
    businessWebsite: '',
    
    // Additional Details
    useCase: '',
    contactSize: '',
    monthlyBudget: '',
    businessCategory: '',
    companySize: '',
    roleInCompany: '',
    referralSource: '',
    status: 'active',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        firstName: editData.firstName || '',
        lastName: editData.lastName || '',
        email: editData.email || '',
        password: editData.password || '', // Password for edit
        whatsappCountryCode: editData.whatsappCountryCode || '',
        whatsappNumber: editData.whatsappNumber || '',
        businessName: editData.businessName || '',
        businessCountry: editData.businessCountry || '',
        businessWebsite: editData.businessWebsite || '',
        useCase: editData.useCase || '',
        contactSize: editData.contactSize || '',
        monthlyBudget: editData.monthlyBudget || '',
        businessCategory: editData.businessCategory || '',
        companySize: editData.companySize || '',
        roleInCompany: editData.roleInCompany || '',
        referralSource: editData.referralSource || '',
        status: editData.status || 'active',
      });
    }
  }, [editData]);

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      whatsappCountryCode: '',
      whatsappNumber: '',
      businessName: '',
      businessCountry: '',
      businessWebsite: '',
      useCase: '',
      contactSize: '',
      monthlyBudget: '',
      businessCategory: '',
      companySize: '',
      roleInCompany: '',
      referralSource: '',
      status: 'active',
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    console.log(`Field Changed - ${name}:`, value);
    console.log('Current Form State:', { ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('🎯 FINAL FORM DATA TO SUBMIT:', formData);
    
    const fullWhatsAppNumber = formData.whatsappNumber;
    
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      whatsappNumber: fullWhatsAppNumber,
      whatsappCountryCode: formData.whatsappCountryCode,
      businessName: formData.businessName,
      businessCountry: formData.businessCountry,
      businessWebsite: formData.businessWebsite,
      useCase: formData.useCase,
      contactSize: formData.contactSize,
      monthlyBudget: formData.monthlyBudget,
      businessCategory: formData.businessCategory,
      companySize: formData.companySize,
      roleInCompany: formData.roleInCompany,
      referralSource: formData.referralSource,
      status: formData.status,
      createdBy: 'admin',
    };

    console.log('📤 SUBMITTING DATA:', userData);
    
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          {editData ? 'Edit Vendor' : 'Add New Vendor'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
            Personal Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CommonField
                type="text"
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                changeHandler={handleChange}
                requiredField={true}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CommonField
                type="text"
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                changeHandler={handleChange}
                requiredField={true}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CommonField
                type="email"
                label="Email Address"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                changeHandler={handleChange}
                requiredField={true}
              />
            </Grid>

            <Grid item xs={12}>
              <CommonField
                type="password"
                label="Password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                changeHandler={handleChange}
                requiredField={true}
                showPasswordToggle={true}
                // note={editData ? "Leave empty to keep current password" : "Default password is set"}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CommonField
                type="select"
                label="WhatsApp Country Code"
                name="whatsappCountryCode"
                value={formData.whatsappCountryCode}
                changeHandler={handleChange}
                options={COUNTRY_CODES}
                requiredField={true}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CommonField
                type="text"
                label="WhatsApp Number"
                name="whatsappNumber"
                placeholder="Enter WhatsApp number"
                value={formData.whatsappNumber}
                changeHandler={handleChange}
                requiredField={true}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
            Business Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CommonField
                type="text"
                label="Business Name"
                name="businessName"
                placeholder="Enter business name"
                value={formData.businessName}
                changeHandler={handleChange}
                requiredField={true}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CommonField
                type="select"
                label="Business Country"
                name="businessCountry"
                value={formData.businessCountry}
                changeHandler={handleChange}
                options={COUNTRIES}
                requiredField={true}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CommonField
                type="text"
                label="Business Website"
                name="businessWebsite"
                placeholder="https://example.com"
                value={formData.businessWebsite}
                changeHandler={handleChange}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mb: 3, mt: 4, color: 'primary.main' }}>
            Additional Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Use Case *
                </Typography>
                <RadioGroup
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleChange}
                >
                  {USE_CASES.map((useCase) => (
                    <FormControlLabel
                      key={useCase.value}
                      value={useCase.value}
                      control={<Radio />}
                      label={useCase.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CommonField
                type="select"
                label="Contact List Size"
                name="contactSize"
                value={formData.contactSize}
                changeHandler={handleChange}
                options={CONTACT_SIZES}
                requiredField={true}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CommonField
                type="select"
                label="Monthly Budget"
                name="monthlyBudget"
                value={formData.monthlyBudget}
                changeHandler={handleChange}
                options={BUDGET_RANGES}
                requiredField={true}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CommonField
                type="select"
                label="Business Category"
                name="businessCategory"
                value={formData.businessCategory}
                changeHandler={handleChange}
                options={BUSINESS_CATEGORIES}
                requiredField={true}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CommonField
                type="select"
                label="Company Size"
                name="companySize"
                value={formData.companySize}
                changeHandler={handleChange}
                options={COMPANY_SIZES}
                requiredField={true}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CommonField
                type="select"
                label="Role in Company"
                name="roleInCompany"
                value={formData.roleInCompany}
                changeHandler={handleChange}
                options={ROLES}
                requiredField={true}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CommonField
                type="select"
                label="Referral Source"
                name="referralSource"
                value={formData.referralSource}
                changeHandler={handleChange}
                options={REFERRAL_SOURCES}
                requiredField={true}
              />
            </Grid>

            <Grid item xs={12}>
              <CommonField
                type="select"
                label="Status"
                name="status"
                value={formData.status}
                changeHandler={handleChange}
                options={STATUS_OPTIONS}
                requiredField={true}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : (editData ? 'Update Vendor' : 'Create Vendor')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VendorForm;