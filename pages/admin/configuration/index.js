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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/Layout";
import CommonTable from "../../../components/common/CommonTable";
import CommonField from "../../../components/common/ComminField";
import CommonPopup from "../../../components/common/CommonPopup";
import {
  fetchConfigs,
  addConfig,
  updateConfig,
  deleteConfig,
} from "../../../store/slices/admin/configSlice";

// Constants
const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email' },
  { value: 'jwt', label: 'JWT' },
  { value: 'database', label: 'Database' },
];

const ConfigPage = () => {
  const dispatch = useDispatch();
  const { loading, list, error } = useSelector((state) => state.configs);

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

  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    category: 'general',
  });

  const [errors, setErrors] = useState({});

  const fetchConfigsData = async () => {
    try {
      await dispatch(fetchConfigs()).unwrap();
    } catch (error) {
      showSnackbar("Failed to fetch configurations", "error");
    }
  };

  useEffect(() => {
    fetchConfigsData();
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

  // 🔹 Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.key) newErrors.key = 'Key is required';
    if (!formData.value) newErrors.value = 'Value is required';
    if (!formData.category) newErrors.category = 'Category is required';

    // Key format validation
    if (formData.key && !/^[A-Z0-9_]+$/.test(formData.key)) {
      newErrors.key = 'Key must contain only uppercase letters, numbers and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      key: '',
      value: '',
      description: '',
      category: 'general',
    });
    setErrors({});
  };

  const handleCloseForm = () => {
    resetForm();
    setEditData(null);
    setFormOpen(false);
  };

  // 🔹 Add Config
  const handleAddConfig = async (configData) => {
    try {
      await dispatch(addConfig(configData)).unwrap();
      handleCloseForm();
      showSuccessPopup("Configuration added successfully!");
      fetchConfigsData();
    } catch (error) {
      showErrorPopup(error || "Failed to add configuration");
    }
  };

  // 🔹 Update Config
  const handleEditConfig = async (configData) => {
    try {
      await dispatch(
        updateConfig({ configId: editData._id, configData: configData })
      ).unwrap();
      handleCloseForm();
      showSuccessPopup("Configuration updated successfully!");
      fetchConfigsData();
    } catch (error) {
      showErrorPopup(error || "Failed to update configuration");
    }
  };

  // 🔹 Delete Config with Common Popup
  const handleDeleteConfig = (config) => {
    showConfirmPopup(
      `Are you sure you want to delete configuration "${config.key}"? This action cannot be undone.`,
      async () => {
        setPopup(prev => ({ ...prev, loading: true }));
        try {
          await dispatch(deleteConfig(config._id)).unwrap();
          closePopup();
          showSuccessPopup("Configuration deleted successfully!");
          fetchConfigsData();
        } catch (error) {
          closePopup();
          showErrorPopup(error || "Failed to delete configuration");
        }
      }
    );
  };

  // 🔹 View Config with Common Popup
  const handleViewConfig = (config) => {
    const configDetails = `
          Key: ${config.key}
          Value: ${config.value}
          Category: ${config.category}
          Description: ${config.description || 'N/A'}
    `.trim();
    
    showPopup(
      "Configuration Details",
      configDetails,
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

    const configData = {
      key: formData.key,
      value: formData.value,
      description: formData.description,
      category: formData.category,
    };

    if (editData) {
      handleEditConfig(configData);
    } else {
      handleAddConfig(configData);
    }
  };

  // 🔹 Open Add Form
  const openAddForm = () => {
    setEditData(null);
    resetForm();
    setFormOpen(true);
  };

  // 🔹 Open Edit Form
  const openEditForm = (config) => {
    setEditData(config);

    setFormData({
      key: config.key || '',
      value: config.value || '',
      description: config.description || '',
      category: config.category || 'general',
    });
    setFormOpen(true);
  };

  // 🔹 Table Columns
const columns = [
  { 
    field: "key", 
    headerName: "Key", 
    sortable: true, 
    flex: 1 
  },
  { 
    field: "value", 
    headerName: "Value", 
    flex: 1 
  },
  { 
    field: "category", 
    headerName: "Category", 
    type: "chip", 
    flex: 1,
    chipColor: (category) => {
      switch (category) {
        case 'general': return 'primary';
        case 'social': return 'secondary';
        case 'email': return 'info';
        case 'jwt': return 'warning';
        case 'database': return 'success';
        default: return 'default';
      }
    }
  },
  { 
    field: "description", 
    headerName: "Description", 
    flex: 1.5 
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
            Configuration Management
          </Typography>
          <Button variant="contained" onClick={openAddForm}>
            + Add Configuration
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
            onDelete={handleDeleteConfig}
            onView={handleViewConfig}
          />
        )}

        {/* Config Form Dialog */}
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
              {editData ? 'Edit Configuration' : 'Add New Configuration'}
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <Box component="form" onSubmit={handleFormSubmit}>
              <Grid container spacing={3}>
                {/* Key Field */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="text"
                    label="Configuration Key"
                    name="key"
                    placeholder="e.g., SMTP_HOST, JWT_SECRET"
                    value={formData.key}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.key}
                    disabled={!!editData} // Key cannot be changed in edit mode
                    note="Uppercase letters, numbers and underscores only"
                  />
                </Grid>

                {/* Category Field */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="select"
                    label="Category"
                    name="category"
                    value={formData.category}
                    changeHandler={handleChange}
                    options={CATEGORY_OPTIONS}
                    requiredField={true}
                    error={errors.category}
                  />
                </Grid>

                {/* Value Field */}
                <Grid item xs={12}>
                  <CommonField
                    type="text"
                    label="Value"
                    name="value"
                    placeholder="Enter configuration value"
                    value={formData.value}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.value}
                    multiline
                    rows={3}
                    note="This value will be automatically encrypted in database"
                  />
                </Grid>

                {/* Description Field */}
                <Grid item xs={12}>
                  <CommonField
                    type="text"
                    label="Description"
                    name="description"
                    placeholder="Brief description of this configuration"
                    value={formData.description}
                    changeHandler={handleChange}
                    multiline
                    rows={2}
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
              {loading ? 'Saving...' : (editData ? 'Update Configuration' : 'Create Configuration')}
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

export default ConfigPage;