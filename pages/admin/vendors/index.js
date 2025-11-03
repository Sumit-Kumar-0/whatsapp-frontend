import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/Layout";
import CommonTable from "../../../components/common/CommonTable";
import CommonField from "../../../components/common/ComminField";
import CommonPopup from "../../../components/common/CommonPopup";
import { Countries } from "../../../components/common/countries";
import {
  fetchVendors,
  addVendor,
  updateVendor,
  deleteVendor,
} from "../../../store/slices/admin/vendorSlice";

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

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const VendorPage = () => {
  const dispatch = useDispatch();
  const { loading, list, error } = useSelector((state) => state.vendors);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Common Popup State
  const [popup, setPopup] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    loading: false
  });

  // Country selection states
  const [selectedBusinessCountry, setSelectedBusinessCountry] = useState('');
  const [selectedWhatsAppCountry, setSelectedWhatsAppCountry] = useState('');

  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});

  const fetchVendorsData = async () => {
    try {
      await dispatch(fetchVendors()).unwrap();
    } catch (error) {
      showSnackbar("Failed to fetch vendors", "error");
    }
  };

  useEffect(() => {
    fetchVendorsData();
  }, []);

  // 🔹 Common Popup Functions
  const showPopup = (title, message, type = "info", onConfirm = null) => {
    setPopup({
      open: true,
      title,
      message,
      type,
      onConfirm,
      loading: false
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, open: false }));
  };

  const showSuccessPopup = (message) => {
    showPopup("Success!", message, "success");
  };

  const showErrorPopup = (message) => {
    showPopup("Error!", message, "error");
  };

  const showConfirmPopup = (message, onConfirm) => {
    showPopup("Are you sure?", message, "confirm", onConfirm);
  };

  // 🔹 Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // 🔹 Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
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

  // 🔹 Business Country Change
  const handleBusinessCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedBusinessCountry(countryCode);

    const selectedCountryData = Countries.find(country => country.code === countryCode);
    if (selectedCountryData) {
      setFormData((prevState) => ({
        ...prevState,
        businessCountry: selectedCountryData.name,
      }));
    }
  };

  // 🔹 WhatsApp Country Change
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

  // 🔹 WhatsApp Number Change with validation
  const handleWhatsAppNumberChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');

    const country = Countries.find(c => c.code === selectedWhatsAppCountry);
    if (country && value.length > country.maxLength) {
      showSnackbar(`Number cannot exceed ${country.maxLength} digits for this country`, "error");
      return;
    }

    setFormData(prev => ({ ...prev, whatsappNumber: value }));
  };

  // 🔹 WhatsApp Number Validation
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

  // 🔹 Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Personal Details Validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // WhatsApp validation
    const whatsappError = validateWhatsAppNumber();
    if (whatsappError) newErrors.whatsappNumber = whatsappError;
    if (!selectedWhatsAppCountry) newErrors.whatsappCountry = 'Country code is required';

    if (!formData.password && !editData) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Business Details Validation
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!selectedBusinessCountry) newErrors.businessCountry = 'Business country is required';

    if (formData.businessWebsite && !/^https?:\/\/.+\..+/.test(formData.businessWebsite)) {
      newErrors.businessWebsite = 'Please enter a valid website URL';
    }

    // Additional Details Validation
    if (!formData.useCase) newErrors.useCase = 'Please select a use case';
    if (!formData.contactSize) newErrors.contactSize = 'Contact size is required';
    if (!formData.monthlyBudget) newErrors.monthlyBudget = 'Monthly budget is required';
    if (!formData.businessCategory) newErrors.businessCategory = 'Business category is required';
    if (!formData.companySize) newErrors.companySize = 'Company size is required';
    if (!formData.roleInCompany) newErrors.roleInCompany = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
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
    setSelectedBusinessCountry('');
    setSelectedWhatsAppCountry('');
    setErrors({});
  };

  const handleCloseForm = () => {
    resetForm();
    setEditData(null);
    setFormOpen(false);
  };

  // 🔹 Add Vendor
  const handleAddVendor = async (vendorData) => {
    try {
      await dispatch(addVendor(vendorData)).unwrap();
      handleCloseForm();
      showSuccessPopup("Vendor added successfully!");
      fetchVendorsData();
    } catch (error) {
      showErrorPopup(error || "Failed to add vendor");
    }
  };

  // 🔹 Update Vendor
  const handleEditVendor = async (vendorData) => {
    try {
      await dispatch(
        updateVendor({ vendorId: editData._id, vendorData: vendorData })
      ).unwrap();
      handleCloseForm();
      showSuccessPopup("Vendor updated successfully!");
      fetchVendorsData();
    } catch (error) {
      showErrorPopup(error || "Failed to update vendor");
    }
  };

  // 🔹 Delete Vendor with Common Popup
  const handleDeleteVendor = (vendor) => {
    showConfirmPopup(
      `Are you sure you want to delete vendor "${vendor.firstName} ${vendor.lastName}"? This action cannot be undone.`,
      async () => {
        setPopup(prev => ({ ...prev, loading: true }));
        try {
          await dispatch(deleteVendor(vendor._id)).unwrap();
          closePopup();
          showSuccessPopup("Vendor deleted successfully!");
          fetchVendorsData();
        } catch (error) {
          closePopup();
          showErrorPopup(error || "Failed to delete vendor");
        }
      }
    );
  };

  // 🔹 View Vendor with Common Popup
  const handleViewVendor = (vendor) => {
    const vendorDetails = `
          Name: ${vendor.firstName} ${vendor.lastName}
          Email: ${vendor.email}
          Business: ${vendor.businessName}
          Country: ${vendor.businessCountry}
          Status: ${vendor.status}
          Use Case: ${vendor.useCase}
          Contact Size: ${vendor.contactSize}
          Monthly Budget: ${vendor.monthlyBudget}
          WhatsApp: ${vendor.whatsappCountryCode} ${vendor.whatsappNumber}
              `.trim();
    showPopup(
      "Vendor Details",
      vendorDetails,
      "info"
    );
  };

  // 🔹 Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorPopup("Please fix the errors in the form");
      return;
    }

    const vendorData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      whatsappNumber: formData.whatsappNumber,
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
    };

    if (editData) {
      handleEditVendor(vendorData);
    } else {
      handleAddVendor(vendorData);
    }
  };

  // 🔹 Open Add Form
  const openAddForm = () => {
    setEditData(null);
    resetForm();
    setFormOpen(true);
  };

  // 🔹 Open Edit Form
  const openEditForm = (vendor) => {
    setEditData(vendor);

    const businessCountryData = Countries.find(c => c.name === vendor.businessCountry);
    const whatsappCountryData = Countries.find(c => c.phoneCode === vendor.whatsappCountryCode);

    setFormData({
      firstName: vendor.firstName || '',
      lastName: vendor.lastName || '',
      email: vendor.email || '',
      password: '', // Don't pre-fill password for security
      whatsappCountryCode: vendor.whatsappCountryCode || '',
      whatsappNumber: vendor.whatsappNumber || '',
      businessName: vendor.businessName || '',
      businessCountry: vendor.businessCountry || '',
      businessWebsite: vendor.businessWebsite || '',
      useCase: vendor.useCase || '',
      contactSize: vendor.contactSize || '',
      monthlyBudget: vendor.monthlyBudget || '',
      businessCategory: vendor.businessCategory || '',
      companySize: vendor.companySize || '',
      roleInCompany: vendor.roleInCompany || '',
      referralSource: vendor.referralSource || '',
      status: vendor.status || 'active',
    });

    setSelectedBusinessCountry(businessCountryData?.code || '');
    setSelectedWhatsAppCountry(whatsappCountryData?.code || '');
    setFormOpen(true);
  };

  // 🔹 Table Columns
  const columns = [
    { field: "firstName", headerName: "First Name", sortable: true, flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "businessName", headerName: "Business Name", flex: 1 },
    { field: "businessCountry", headerName: "Country", flex: 1 },
    { field: "whatsappNumber", headerName: "Number", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      type: "chip",
      chipColor: (status) => {
        switch (status) {
          case 'active': return 'success';
          case 'pending': return 'warning';
          case 'inactive': return 'error';
          default: return 'primary';
        }
      },
      flex: 1
    }
  ];

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Vendors
          </Typography>
          <Button variant="contained" onClick={openAddForm}>
            + Add Vendor
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Table or Loader */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CommonTable
            data={list || []}
            columns={columns}
            actions={["view", "edit", "delete"]}
            onEdit={openEditForm}
            onDelete={handleDeleteVendor}
            onView={handleViewVendor}
          />
        )}

        {/* Vendor Form Dialog */}
        <Dialog
          open={formOpen}
          onClose={handleCloseForm}
          maxWidth="md"
          fullWidth
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: 2
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h5" component="div" fontWeight="bold">
              {editData ? 'Edit Vendor' : 'Add New Vendor'}
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <Box component="form" onSubmit={handleFormSubmit}>
              {/* Personal Details Section */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
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
                    error={errors.firstName}
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
                    error={errors.lastName}
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
                    error={errors.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CommonField
                    type="password"
                    label="New Password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    changeHandler={handleChange}
                    requiredField={!editData}
                    showPasswordToggle={true}
                    error={errors.password}
                    note={editData ? "Leave empty to keep current password OR type to create new password." : "Password must be at least 6 characters"}
                  />
                  {editData && <small style={{ marginTop: "-8px", marginBottom: "20px", display: "block", paddingLeft: "2px", color: "#FF9966" }}>Leave empty to keep current password <b>(OR)</b> type to create new password.</small>}
                </Grid>

                {/* WhatsApp Country Code */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.whatsappCountry}>
                    <InputLabel>WhatsApp Country Code</InputLabel>
                    <Select
                      value={selectedWhatsAppCountry}
                      label="WhatsApp Country Code"
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

                {/* WhatsApp Number */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="text"
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    placeholder="Enter WhatsApp number"
                    value={formData.whatsappNumber}
                    changeHandler={handleWhatsAppNumberChange}
                    requiredField={true}
                    error={errors.whatsappNumber}
                    inputProps={{
                      startAdornment: formData.whatsappCountryCode && (
                        <InputAdornment position="start">
                          <Typography variant="body2" color="text.secondary">
                            {formData.whatsappCountryCode}
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    note="Enter your WhatsApp number without country code"
                  />
                </Grid>
              </Grid>

              {/* Business Details Section */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3, mt: 4, color: 'primary.main', fontWeight: 'bold' }}>
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
                    error={errors.businessName}
                  />
                </Grid>

                {/* Business Country */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.businessCountry}>
                    <InputLabel>Business Country</InputLabel>
                    <Select
                      value={selectedBusinessCountry}
                      label="Business Country"
                      onChange={handleBusinessCountryChange}
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

                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="text"
                    label="Business Website"
                    name="businessWebsite"
                    placeholder="https://example.com"
                    value={formData.businessWebsite}
                    changeHandler={handleChange}
                    error={errors.businessWebsite}
                  />
                </Grid>
              </Grid>

              {/* Additional Details Section */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3, mt: 4, color: 'primary.main', fontWeight: 'bold' }}>
                Additional Details
              </Typography>

              <Grid container spacing={2}>
                {/* Use Case - Radio Button */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth error={!!errors.useCase} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
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
                    {errors.useCase && (
                      <Typography variant="caption" color="error">
                        {errors.useCase}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Other dropdown fields */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="select"
                    label="Contact List Size"
                    name="contactSize"
                    value={formData.contactSize}
                    changeHandler={handleChange}
                    options={CONTACT_SIZES}
                    requiredField={true}
                    error={errors.contactSize}
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
                    error={errors.monthlyBudget}
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
                    error={errors.businessCategory}
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
                    error={errors.companySize}
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
                    error={errors.roleInCompany}
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
            <Button onClick={handleCloseForm} disabled={loading}>
              Cancel
            </Button>

            <Button
              onClick={handleFormSubmit}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : (editData ? 'Update Vendor' : 'Create Vendor')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Common Popup */}
        <CommonPopup
          open={popup.open}
          onClose={closePopup}
          title={popup.title}
          message={popup.message}
          type={popup.type}
          onConfirm={popup.onConfirm}
          loading={popup.loading}
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default VendorPage;