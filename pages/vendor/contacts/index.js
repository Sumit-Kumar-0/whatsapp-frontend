import React, { useEffect, useState, useRef } from "react";
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
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { 
  Search, 
  Download, 
  Upload, 
  Delete,
  Edit,
  Visibility,
  Close
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/Layout";
import CommonTable from "../../../components/common/CommonTable";
import CommonField from "../../../components/common/ComminField";
import CommonPopup from "../../../components/common/CommonPopup";
import {
  fetchContacts,
  addContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  bulkAddContacts,
} from "../../../store/slices/vendor/contactSlice";
import { Countries } from "../../../components/common/countries";
import { downloadContactTemplate, parseExcelFile } from "../../../components/vendor/exportTemplate";

// Constants
const CATEGORY_OPTIONS = [
  { value: 'customer', label: 'Customer' },
  { value: 'lead', label: 'Lead' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'other', label: 'Other' },
];

const ContactPage = () => {
  const dispatch = useDispatch();
  const { loading, list, error } = useSelector((state) => state.contacts);

  const [formOpen, setFormOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef(null);

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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryCode: '+91',
    phoneNumber: '',
    country: 'India',
    email: '',
    company: '',
    category: 'customer',
    tags: [],
    source: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // 🔹 Fetch Contacts
  const fetchContactsData = async () => {
    try {
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      await dispatch(fetchContacts(filters)).unwrap();
    } catch (error) {
      showSnackbar("Failed to fetch contacts", "error");
    }
  };

  useEffect(() => {
    fetchContactsData();
  }, [searchTerm]);

  // 🔹 Selection handler
  const handleSelectionChange = (selectedIds, selectedRows) => {
    setSelectedContacts(selectedRows);
  };

  // 🔹 Bulk delete function
  const handleBulkDelete = () => {
    if (selectedContacts.length === 0) {
      showErrorPopup("Please select contacts to delete");
      return;
    }

    showConfirmPopup(
      `Are you sure you want to delete ${selectedContacts.length} contact(s)? This action cannot be undone.`,
      async () => {
        setPopup(prev => ({ ...prev, loading: true }));
        try {
          const contactIds = selectedContacts.map(contact => contact._id);
          await dispatch(bulkDeleteContacts(contactIds)).unwrap();
          
          setSelectedContacts([]);
          closePopup();
          showSuccessPopup(`${selectedContacts.length} contact(s) deleted successfully!`);
          fetchContactsData();
        } catch (error) {
          closePopup();
          showErrorPopup(error || "Failed to delete contacts");
        }
      }
    );
  };

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

  const handleCountryChange = (e) => {
    const selectedCountry = Countries.find(c => c.name === e.target.value);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        country: selectedCountry.name,
        countryCode: selectedCountry.phoneCode
      }));
    }
  };

  // 🔹 Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.country) newErrors.country = 'Country is required';

    // Phone number validation based on country
    const selectedCountry = Countries.find(c => c.name === formData.country);
    if (selectedCountry && formData.phoneNumber) {
      const phoneLength = formData.phoneNumber.length;
      if (phoneLength < selectedCountry.minLength || phoneLength > selectedCountry.maxLength) {
        newErrors.phoneNumber = `Phone number must be ${selectedCountry.minLength}-${selectedCountry.maxLength} digits for ${selectedCountry.name}`;
      }
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      countryCode: '+91',
      phoneNumber: '',
      country: 'India',
      email: '',
      company: '',
      category: 'customer',
      tags: [],
      source: '',
      notes: ''
    });
    setErrors({});
  };

  const handleCloseForm = () => {
    resetForm();
    setEditData(null);
    setFormOpen(false);
  };

  // 🔹 Add Contact
  const handleAddContact = async (contactData) => {
    try {
      await dispatch(addContact(contactData)).unwrap();
      handleCloseForm();
      showSuccessPopup("Contact added successfully!");
      fetchContactsData();
    } catch (error) {
      showErrorPopup(error || "Failed to add contact");
    }
  };

  // 🔹 Update Contact
  const handleEditContact = async (contactData) => {
    try {
      await dispatch(
        updateContact({ contactId: editData._id, contactData: contactData })
      ).unwrap();
      handleCloseForm();
      showSuccessPopup("Contact updated successfully!");
      fetchContactsData();
    } catch (error) {
      showErrorPopup(error || "Failed to update contact");
    }
  };

  // 🔹 Delete Contact with Common Popup
  const handleDeleteContact = (contact) => {
    showConfirmPopup(
      `Are you sure you want to delete contact "${contact.firstName} ${contact.lastName}"? This action cannot be undone.`,
      async () => {
        setPopup(prev => ({ ...prev, loading: true }));
        try {
          await dispatch(deleteContact(contact._id)).unwrap();
          closePopup();
          showSuccessPopup("Contact deleted successfully!");
          fetchContactsData();
        } catch (error) {
          closePopup();
          showErrorPopup(error || "Failed to delete contact");
        }
      }
    );
  };

  // 🔹 View Contact with Common Popup
  const handleViewContact = (contact) => {
    const contactDetails = `
      Name: ${contact.firstName} ${contact.lastName}
      Phone: ${contact.countryCode} ${contact.phoneNumber}
      Country: ${contact.country}
      Email: ${contact.email || 'N/A'}
      Company: ${contact.company || 'N/A'}
      Category: ${contact.category}
      Source: ${contact.source || 'N/A'}
      Tags: ${contact.tags?.join(', ') || 'N/A'}
      Notes: ${contact.notes || 'N/A'}
    `.trim();
    
    showPopup(
      "Contact Details",
      contactDetails,
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

    const contactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      countryCode: formData.countryCode,
      phoneNumber: formData.phoneNumber,
      country: formData.country,
      email: formData.email,
      company: formData.company,
      category: formData.category,
      tags: formData.tags,
      source: formData.source,
      notes: formData.notes
    };

    if (editData) {
      handleEditContact(contactData);
    } else {
      handleAddContact(contactData);
    }
  };

  // 🔹 Open Add Form
  const openAddForm = () => {
    setEditData(null);
    resetForm();
    setFormOpen(true);
  };

  // 🔹 Open Edit Form
  const openEditForm = (contact) => {
    setEditData(contact);
    setFormData({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      countryCode: contact.countryCode || '+91',
      phoneNumber: contact.phoneNumber || '',
      country: contact.country || 'India',
      email: contact.email || '',
      company: contact.company || '',
      category: contact.category || 'customer',
      tags: contact.tags || [],
      source: contact.source || '',
      notes: contact.notes || ''
    });
    setFormOpen(true);
  };

  // 🔹 Download Template
  const handleDownloadTemplate = () => {
    downloadContactTemplate();
    showSnackbar("Template downloaded successfully!", "success");
  };

  // 🔹 Handle File Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is Excel
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      showErrorPopup("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setUploadLoading(true);
    try {
      const data = await parseExcelFile(file);
      
      // Map Excel columns to our contact fields
      const mappedContacts = data.map((row, index) => ({
        firstName: row['First Name*'] || row['First Name'] || '',
        lastName: row['Last Name'] || '',
        countryCode: row['Country Code*'] || row['Country Code'] || '+91',
        phoneNumber: String(row['Phone Number*'] || row['Phone Number'] || ''),
        country: row['Country*'] || row['Country'] || 'India',
        email: row['Email'] || '',
        company: row['Company'] || '',
        category: row['Category'] || 'customer',
        tags: row['Tags'] ? row['Tags'].split(',').map(tag => tag.trim()) : [],
        source: row['Source'] || '',
        notes: row['Notes'] || ''
      }));

      setUploadedData(mappedContacts);
      setUploadOpen(true);
      showSnackbar(`Successfully parsed ${mappedContacts.length} contacts`, "success");
    } catch (error) {
      showErrorPopup(error.message || "Failed to parse Excel file");
    } finally {
      setUploadLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 🔹 Process Bulk Upload
  const handleBulkUpload = async () => {
    if (uploadedData.length === 0) {
      showErrorPopup("No contacts to upload");
      return;
    }

    setUploadLoading(true);
    try {
      await dispatch(bulkAddContacts(uploadedData)).unwrap();
      
      setUploadOpen(false);
      setUploadedData([]);
      showSuccessPopup(`Successfully uploaded ${uploadedData.length} contacts!`);
      fetchContactsData();
    } catch (error) {
      showErrorPopup(error || "Failed to upload contacts");
    } finally {
      setUploadLoading(false);
    }
  };

  // 🔹 Table Columns
  const columns = [
    { 
      field: "firstName", 
      headerName: "First Name", 
    },
    { 
      field: "lastName", 
      headerName: "Last Name", 
    },
    { 
      field: "phoneNumber", 
      headerName: "Phone", 
    },
    { 
      field: "email", 
      headerName: "Email", 
    },
    { 
      field: "company", 
      headerName: "Company", 
    },
    { 
      field: "category", 
      headerName: "Category", 
    },
    { 
      field: "country", 
      headerName: "Country", 
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
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Contact Management
            </Typography>
            {selectedContacts.length > 0 && (
              <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                {selectedContacts.length} contact(s) selected
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Bulk Upload Buttons */}
            <Button 
              variant="outlined" 
              startIcon={<Download />}
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
            
            <Button 
              variant="outlined" 
              component="label"
              startIcon={<Upload />}
              disabled={uploadLoading}
            >
              {uploadLoading ? 'Processing...' : 'Upload Excel'}
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </Button>

            {selectedContacts.length > 0 && (
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedContacts.length})
              </Button>
            )}
            <Button variant="contained" onClick={openAddForm}>
              + Add Contact
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search contacts by name, phone, email or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
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
            onEdit={openEditForm}
            onDelete={handleDeleteContact}
            onView={handleViewContact}
            selectable={true}
            onSelectionChange={handleSelectionChange}
            searchable={false} // We have our own search
          />
        )}

        {/* Contact Form Dialog */}
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
              {editData ? 'Edit Contact' : 'Add New Contact'}
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <Box component="form" onSubmit={handleFormSubmit}>
              <Grid container spacing={3}>
                {/* First Name */}
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

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="text"
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    changeHandler={handleChange}
                  />
                </Grid>

                {/* Country */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="select"
                    label="Country"
                    name="country"
                    value={formData.country}
                    changeHandler={handleCountryChange}
                    options={Countries.map(c => ({ value: c.name, label: `${c.flag} ${c.name}` }))}
                    requiredField={true}
                    error={errors.country}
                  />
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="text"
                    label="Phone Number"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.phoneNumber}
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography color="textSecondary">
                            {formData.countryCode}
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="text"
                    label="Email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    changeHandler={handleChange}
                    error={errors.email}
                  />
                </Grid>

                {/* Company */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="text"
                    label="Company"
                    name="company"
                    placeholder="Enter company name"
                    value={formData.company}
                    changeHandler={handleChange}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="select"
                    label="Category"
                    name="category"
                    value={formData.category}
                    changeHandler={handleChange}
                    options={CATEGORY_OPTIONS}
                  />
                </Grid>

                {/* Source */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="text"
                    label="Source"
                    name="source"
                    placeholder="How did you find this contact?"
                    value={formData.source}
                    changeHandler={handleChange}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <CommonField
                    type="text"
                    label="Notes"
                    name="notes"
                    placeholder="Additional notes about this contact"
                    value={formData.notes}
                    changeHandler={handleChange}
                    multiline
                    rows={3}
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
              {loading ? 'Saving...' : (editData ? 'Update Contact' : 'Create Contact')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog
          open={uploadOpen}
          onClose={() => !uploadLoading && setUploadOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="div" fontWeight="bold">
                Bulk Upload Contacts
              </Typography>
              <IconButton 
                onClick={() => setUploadOpen(false)} 
                disabled={uploadLoading}
              >
                <Close />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Review the contacts before uploading
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" color="primary" fontWeight="bold">
                Found {uploadedData.length} contacts to upload
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Showing first 5 contacts as preview
              </Typography>
            </Box>
            
            {uploadedData.slice(0, 5).map((contact, index) => (
              <Card key={index} sx={{ mb: 1, bgcolor: 'background.default' }}>
                <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" fontWeight="medium">
                    {contact.firstName} {contact.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {contact.countryCode} {contact.phoneNumber} • {contact.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {contact.company && (
                      <Chip size="small" label={contact.company} variant="outlined" />
                    )}
                    <Chip size="small" label={contact.category} color="primary" />
                    <Chip size="small" label={contact.country} variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            ))}
            
            {uploadedData.length > 5 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ... and {uploadedData.length - 5} more contacts
              </Typography>
            )}

            {uploadedData.length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.dark">
                  <strong>Note:</strong> Required fields are First Name, Country Code, Phone Number, and Country.
                  Duplicate phone numbers will be skipped automatically.
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={() => setUploadOpen(false)} 
              disabled={uploadLoading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleBulkUpload}
              variant="contained"
              disabled={uploadLoading || uploadedData.length === 0}
              startIcon={uploadLoading ? <CircularProgress size={20} /> : <Upload />}
            >
              {uploadLoading ? 'Uploading...' : `Upload ${uploadedData.length} Contacts`}
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default ContactPage;