import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Radio,
  RadioGroup,
  Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff, Business, Person, Info } from '@mui/icons-material';
import { register, reset } from '../../store/slices/authSlice';
import { Countries } from '../../components/common/countries';

const REFERRAL_SOURCES = [
  'Recommended by friend / colleague',
  'Online search',
  'Online advertisement',
  'Event, conference or training',
  'Saw someone using it',
  'Youtube / Social media',
  'ChatGPT / Perplexity / other AI tool',
  'Other / don\'t remember'
];

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
];

const COMPANY_SIZES = [
  '1',
  '2 - 10',
  '11 - 50',
  '51 - 250',
  '251 - 1k',
  '1k - 5k',
  '5k+'
];

const ROLES = [
  'Executive (CXO / VP / Founder)',
  'Manager (Team Lead / Department Head)',
  'Marketing Professional',
  'Sales Representative',
  'Technical Team (Developer / Engineer)',
  'Freelancer / Consultant',
  'Other'
];

const CONTACT_SIZES = [
  'Less than 1,000 contacts',
  '1,000 to 5,000 contacts',
  '5,000 to 25,000 contacts',
  'Over 25,000 contacts'
];

const BUDGET_RANGES = [
  'Under $100',
  '$101 to $500',
  '$501 to $1000',
  '$1001 to $2000',
  '$2001 to $5000',
  '$5001 to $10000',
  '$10001 and above',
  'Not sure'
];

const USE_CASES = [
  'Sending bulk marketing WhatsApp messages to my contacts',
  'Integrating WhatsApp on my website / 3rd party apps to send transactional messages',
  'Both'
];

const steps = ['Personal Details', 'Business Details', 'Complete Registration'];

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    whatsappCountryCode: '',
    whatsappNumber: '',
    password: '',
    confirmPassword: '',
    
    // Business Details
    businessName: '',
    businessCountry: '',
    businessWebsite: '',
    
    // New fields for step 3
    useCase: '',
    contactSize: '',
    monthlyBudget: '',
    businessCategory: '',
    companySize: '',
    role: '',
    referralSource: '',
  });

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedWhatsAppCountry, setSelectedWhatsAppCountry] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isError) {
      console.log('Register error:', message);
    }

    if (isSuccess && user) {
      setShowVerificationDialog(true);
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, dispatch]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    
    const selectedCountryData = Countries.find(country => country.code === countryCode);
    if (selectedCountryData) {
      setFormData((prevState) => ({
        ...prevState,
        businessCountry: selectedCountryData.name,
      }));
    }
  };

  const handleWhatsAppCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedWhatsAppCountry(countryCode);
    
    const selectedCountryData = Countries.find(country => country.code === countryCode);
    if (selectedCountryData) {
      setFormData((prevState) => ({
        ...prevState,
        whatsappCountryCode: selectedCountryData.phoneCode,
      }));
    }
  };

  const handleWhatsAppNumberChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Only numbers allowed
    
    // Check max length
    const country = Countries.find(c => c.code === selectedWhatsAppCountry);
    if (country && value.length > country.maxLength) {
      setSnackbar({
        open: true,
        message: `Number cannot exceed ${country.maxLength} digits for this country`
      });
      return;
    }
    
    setFormData(prev => ({ ...prev, whatsappNumber: value }));
  };

  const validateWhatsAppNumber = () => {
    if (!formData.whatsappNumber) return 'WhatsApp number is required';
    
    const country = Countries.find(c => c.code === selectedWhatsAppCountry);
    if (!country) return 'Please select a country code';
    
    const numberLength = formData.whatsappNumber.length;
    
    if (numberLength < country.minLength) {
      return `Number must be at least ${country.minLength} digits`;
    }
    
    if (numberLength > country.maxLength) {
      return `Number cannot exceed ${country.maxLength} digits`;
    }
    
    return '';
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      // Validate WhatsApp number
      const whatsappError = validateWhatsAppNumber();
      if (whatsappError) newErrors.whatsappNumber = whatsappError;
      if (!selectedWhatsAppCountry) newErrors.whatsappCountry = 'Country code is required';
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 1) {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!selectedCountry) newErrors.businessCountry = 'Business country is required';
      if (!formData.businessWebsite) {
        newErrors.businessWebsite = 'Business website is required';
      } else if (!/^https?:\/\/.+\..+/.test(formData.businessWebsite)) {
        newErrors.businessWebsite = 'Please enter a valid website URL';
      }
    }

    if (step === 2) {
      if (!formData.useCase) newErrors.useCase = 'Please select a use case';
      if (!formData.contactSize) newErrors.contactSize = 'Contact size is required';
      if (!formData.monthlyBudget) newErrors.monthlyBudget = 'Monthly budget is required';
      if (!formData.businessCategory) newErrors.businessCategory = 'Business category is required';
      if (!formData.companySize) newErrors.companySize = 'Company size is required';
      if (!formData.role) newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep(2)) {
      // Combine country code and number for final WhatsApp number
      const fullWhatsAppNumber = formData.whatsappNumber;
      
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        whatsappNumber: fullWhatsAppNumber,
        whatsappCountryCode: formData.whatsappCountryCode,
        password: formData.password,
        businessName: formData.businessName,
        businessCountry: formData.businessCountry,
        businessWebsite: formData.businessWebsite,
        useCase: formData.useCase,
        contactSize: formData.contactSize,
        monthlyBudget: formData.monthlyBudget,
        businessCategory: formData.businessCategory,
        companySize: formData.companySize,
        roleInCompany: formData.role,
        referralSource: formData.referralSource,
      };

      dispatch(register(userData));
    }
  };

  const handleVerifyNow = () => {
    setShowVerificationDialog(false);
    router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person sx={{ mr: 1 }} />
              Personal Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={onChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={onChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              
              {/* WhatsApp Country Code and Number */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.whatsappCountry}>
                  <InputLabel>Country Code</InputLabel>
                  <Select
                    value={selectedWhatsAppCountry}
                    label="Country Code"
                    onChange={handleWhatsAppCountryChange}
                  >
                    {Countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.phoneCode})
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.whatsappCountry && (
                    <Typography variant="caption" color="error">
                      {errors.whatsappCountry}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="whatsappNumber"
                  label="Personal WhatsApp Number"
                  placeholder="9818892580"
                  value={formData.whatsappNumber}
                  onChange={handleWhatsAppNumberChange}
                  error={!!errors.whatsappNumber}
                  helperText={errors.whatsappNumber || "Enter your WhatsApp number without country code"}
                  InputProps={{
                    startAdornment: formData.whatsappCountryCode && (
                      <InputAdornment position="start">
                        <Typography variant="body2" color="text.secondary">
                          {formData.whatsappCountryCode}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={onChange}
                  error={!!errors.password}
                  helperText={errors.password || "Password must be at least 8 characters"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={onChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Business sx={{ mr: 1 }} />
              Business Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Legal business entity with a live website is required to access WhatsApp API
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="businessName"
                  label="Business Name"
                  value={formData.businessName}
                  onChange={onChange}
                  error={!!errors.businessName}
                  helperText={errors.businessName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.businessCountry}>
                  <InputLabel>Business Country</InputLabel>
                  <Select
                    value={selectedCountry}
                    label="Business Country"
                    onChange={handleCountryChange}
                  >
                    {Countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.businessCountry && (
                    <Typography variant="caption" color="error">
                      {errors.businessCountry}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="businessWebsite"
                  label="Business Website URL (MUST BE LIVE)"
                  placeholder="https://yourbusiness.com"
                  value={formData.businessWebsite}
                  onChange={onChange}
                  error={!!errors.businessWebsite}
                  helperText={errors.businessWebsite}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Info sx={{ mr: 1 }} />
              Complete Registration
            </Typography>
            
            <Grid container spacing={3}>
              {/* Use Cases - Radio Button */}
              <Grid item xs={12}>
                <FormControl component="fieldset" error={!!errors.useCase} fullWidth>
                  <Typography variant="subtitle1" gutterBottom>
                    What will you use our tool for? *
                  </Typography>
                  <RadioGroup
                    name="useCase"
                    value={formData.useCase}
                    onChange={onChange}
                  >
                    {USE_CASES.map((useCase) => (
                      <FormControlLabel
                        key={useCase}
                        value={useCase}
                        control={<Radio />}
                        label={useCase}
                      />
                    ))}
                  </RadioGroup>
                  {errors.useCase && (
                    <Typography variant="caption" color="error">
                      {errors.useCase}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Contact Size */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.contactSize}>
                  <InputLabel>How big is your opted-in contacts list?</InputLabel>
                  <Select
                    name="contactSize"
                    value={formData.contactSize}
                    label="How big is your opted-in contacts list?"
                    onChange={onChange}
                  >
                    {CONTACT_SIZES.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.contactSize && (
                    <Typography variant="caption" color="error">
                      {errors.contactSize}
                    </Typography>
                  )}
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Important: Sending messages to new opted-in people is strictly prohibited and will get your number permanently banned.
                </Typography>
              </Grid>

              {/* Monthly Budget */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.monthlyBudget}>
                  <InputLabel>What is your approx monthly WhatsApp marketing budget?</InputLabel>
                  <Select
                    name="monthlyBudget"
                    value={formData.monthlyBudget}
                    label="What is your approx monthly WhatsApp marketing budget?"
                    onChange={onChange}
                  >
                    {BUDGET_RANGES.map((budget) => (
                      <MenuItem key={budget} value={budget}>
                        {budget}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.monthlyBudget && (
                    <Typography variant="caption" color="error">
                      {errors.monthlyBudget}
                    </Typography>
                  )}
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  WhatsApp API is not free. Learn about the official API pricing and calculate approximate costs.
                </Typography>
              </Grid>

              {/* Business Category */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.businessCategory}>
                  <InputLabel>What category does your business belong to?</InputLabel>
                  <Select
                    name="businessCategory"
                    value={formData.businessCategory}
                    label="What category does your business belong to?"
                    onChange={onChange}
                  >
                    {BUSINESS_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.businessCategory && (
                    <Typography variant="caption" color="error">
                      {errors.businessCategory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Company Size */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.companySize}>
                  <InputLabel>How big is your company / organization?</InputLabel>
                  <Select
                    name="companySize"
                    value={formData.companySize}
                    label="How big is your company / organization?"
                    onChange={onChange}
                  >
                    {COMPANY_SIZES.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.companySize && (
                    <Typography variant="caption" color="error">
                      {errors.companySize}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Role */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.role}>
                  <InputLabel>What is your role?</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    label="What is your role?"
                    onChange={onChange}
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.role && (
                    <Typography variant="caption" color="error">
                      {errors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Referral Source */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>How did you find us?</InputLabel>
                  <Select
                    name="referralSource"
                    value={formData.referralSource}
                    label="How did you find us?"
                    onChange={onChange}
                  >
                    {REFERRAL_SOURCES.map((source) => (
                      <MenuItem key={source} value={source}>
                        {source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                By creating your account, you agree to our{' '}
                <Link href="#" color="primary">Terms and Conditions</Link>,{' '}
                <Link href="#" color="primary">Privacy Policy</Link> and{' '}
                <Link href="#" color="primary">Refund Policy</Link>.
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', paddingBottom: '40px'}}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Link href="/" color="inherit" underline="none" sx={{ mr: 2 }}>Home</Link>
          <Link href="/login" color="inherit" underline="none">
            Already have an account? Sign in
          </Link>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 800 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography component="h1" variant="h3" gutterBottom color="primary" fontWeight="bold">
                Create Your Account
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Enter details below to create your WANotifier account
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {isError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit}>
              {renderStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    size="large"
                    sx={{ minWidth: 150 }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Sign up for free'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Success Dialog */}
        <Dialog open={showVerificationDialog} onClose={() => setShowVerificationDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            🎉 Registration Successful!
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }} align="center">
              Your account has been created successfully. We've sent a verification code to:
            </Typography>
            <Typography align="center" variant="h6" color="primary" sx={{ mb: 2 }}>
              {formData.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Please verify your email to access all features of WANotifier.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
            <Button
              onClick={handleVerifyNow}
              variant="contained"
            >
              Verify Email
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for validation messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          message={snackbar.message}
        />
      </Container>
    </div>
  );
}