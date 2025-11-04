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
  FormControlLabel,
  Checkbox,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/Layout";
import CommonTable from "../../../components/common/CommonTable";
import CommonField from "../../../components/common/ComminField";
import CommonPopup from "../../../components/common/CommonPopup";
import {
  fetchSubscriptionPlans,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../../../store/slices/admin/subscriptionPlanSlice";

// Constants
const PLAN_NAMES = [
  { value: 'Free', label: 'Free' },
  { value: 'Basic', label: 'Basic' },
  { value: 'Premium', label: 'Premium' },
];

const SubscriptionPlansPage = () => {
  const dispatch = useDispatch();
  const { loading, list, error } = useSelector((state) => state.subscriptionPlans);

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
    name: '',
    description: '',
    contactsLimit: '',
    monthlyPrice: '',
    yearlyPrice: '',
    features: [''],
    isActive: true,
    position: 0,
  });

  const [errors, setErrors] = useState({});

  const fetchSubscriptionPlansData = async () => {
    try {
      await dispatch(fetchSubscriptionPlans()).unwrap();
    } catch (error) {
      showSnackbar("Failed to fetch subscription plans", "error");
    }
  };

  useEffect(() => {
    fetchSubscriptionPlansData();
  }, []);

  // 📊 Calculate Stats
  const calculateStats = () => {
    const totalPlans = list?.length || 0;
    const activePlans = list?.filter(plan => plan.isActive)?.length || 0;
    const inactivePlans = totalPlans - activePlans;
    const paidPlans = list?.filter(plan => plan.monthlyPrice > 0)?.length || 0;
    const freePlans = totalPlans - paidPlans;

    // Calculate total revenue potential (monthly)
    const totalMonthlyRevenue = list?.reduce((sum, plan) => {
      return sum + (plan.isActive ? plan.monthlyPrice : 0);
    }, 0) || 0;

    // Calculate average price
    const averagePrice = paidPlans > 0 
      ? Math.round(list?.reduce((sum, plan) => sum + plan.monthlyPrice, 0) / paidPlans)
      : 0;

    return {
      totalPlans,
      activePlans,
      inactivePlans,
      paidPlans,
      freePlans,
      totalMonthlyRevenue,
      averagePrice,
      activePercentage: totalPlans > 0 ? Math.round((activePlans / totalPlans) * 100) : 0,
      paidPercentage: totalPlans > 0 ? Math.round((paidPlans / totalPlans) * 100) : 0,
    };
  };

  const stats = calculateStats();

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
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 🔹 Features handlers
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ 
      ...prev, 
      features: [...prev.features, ''] 
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  // 🔹 Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Plan name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.contactsLimit || formData.contactsLimit < 0) newErrors.contactsLimit = 'Valid contacts limit is required';
    if (formData.monthlyPrice === '' || formData.monthlyPrice < 0) newErrors.monthlyPrice = 'Valid monthly price is required';
    if (formData.yearlyPrice === '' || formData.yearlyPrice < 0) newErrors.yearlyPrice = 'Valid yearly price is required';
    if (!formData.position || formData.position < 0) newErrors.position = 'Valid position is required';

    // Validate features
    const validFeatures = formData.features.filter(feature => feature.trim() !== '');
    if (validFeatures.length === 0) {
      newErrors.features = 'At least one feature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      contactsLimit: '',
      monthlyPrice: '',
      yearlyPrice: '',
      features: [''],
      isActive: true,
      position: 0,
    });
    setErrors({});
  };

  const handleCloseForm = () => {
    resetForm();
    setEditData(null);
    setFormOpen(false);
  };

  // 🔹 Add Subscription Plan
  const handleAddSubscriptionPlan = async (planData) => {
    try {
      const filteredFeatures = planData.features.filter(feature => feature.trim() !== '');
      const finalData = { ...planData, features: filteredFeatures };
      
      await dispatch(addSubscriptionPlan(finalData)).unwrap();
      handleCloseForm();
      showSuccessPopup("Subscription plan added successfully!");
      fetchSubscriptionPlansData();
    } catch (error) {
      showErrorPopup(error || "Failed to add subscription plan");
    }
  };

  // 🔹 Update Subscription Plan
  const handleEditSubscriptionPlan = async (planData) => {
    try {
      const filteredFeatures = planData.features.filter(feature => feature.trim() !== '');
      const finalData = { ...planData, features: filteredFeatures };
      
      await dispatch(
        updateSubscriptionPlan({ planId: editData._id, planData: finalData })
      ).unwrap();
      handleCloseForm();
      showSuccessPopup("Subscription plan updated successfully!");
      fetchSubscriptionPlansData();
    } catch (error) {
      showErrorPopup(error || "Failed to update subscription plan");
    }
  };

  // 🔹 Delete Subscription Plan with Common Popup
  const handleDeleteSubscriptionPlan = (plan) => {
    showConfirmPopup(
      `Are you sure you want to delete subscription plan "${plan.name}"? This action cannot be undone.`,
      async () => {
        setPopup(prev => ({ ...prev, loading: true }));
        try {
          await dispatch(deleteSubscriptionPlan(plan._id)).unwrap();
          closePopup();
          showSuccessPopup("Subscription plan deleted successfully!");
          fetchSubscriptionPlansData();
        } catch (error) {
          closePopup();
          showErrorPopup(error || "Failed to delete subscription plan");
        }
      }
    );
  };

  // 🔹 View Subscription Plan with Common Popup
  const handleViewSubscriptionPlan = (plan) => {
    const planDetails = `
Plan Name: ${plan.name}
Description: ${plan.description}
Contacts Limit: ${plan.contactsLimit?.toLocaleString()}
Monthly Price: ₹${plan.monthlyPrice}
Yearly Price: ₹${plan.yearlyPrice}
Status: ${plan.isActive ? 'Active' : 'Inactive'}
Position: ${plan.position}

Features:
${plan.features?.map(feature => `• ${feature}`).join('\n')}
    `.trim();
    
    showPopup(
      "Subscription Plan Details",
      planDetails,
      "info"
    );
  };

  // 🔹 Format price for display
  const formatPrice = (price) => {
    return `₹${price?.toLocaleString()}`;
  };

  // 🔹 Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorPopup("Please fix the errors in the form");
      return;
    }

    const planData = {
      name: formData.name,
      description: formData.description,
      contactsLimit: Number(formData.contactsLimit),
      monthlyPrice: Number(formData.monthlyPrice),
      yearlyPrice: Number(formData.yearlyPrice),
      features: formData.features,
      isActive: formData.isActive,
      position: Number(formData.position),
    };

    if (editData) {
      handleEditSubscriptionPlan(planData);
    } else {
      handleAddSubscriptionPlan(planData);
    }
  };

  // 🔹 Open Add Form
  const openAddForm = () => {
    setEditData(null);
    resetForm();
    setFormOpen(true);
  };

  // 🔹 Open Edit Form
  const openEditForm = (plan) => {
    setEditData(plan);

    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      contactsLimit: plan.contactsLimit || '',
      monthlyPrice: plan.monthlyPrice || '',
      yearlyPrice: plan.yearlyPrice || '',
      features: plan.features?.length > 0 ? [...plan.features] : [''],
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      position: plan.position || 0,
    });
    setFormOpen(true);
  };

  // 🔹 Table Columns
  const columns = [
    { 
      field: "name", 
      headerName: "Plan Name", 
      sortable: true, 
      flex: 1,
      render: (value) => (
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
      )
    },
    { 
      field: "contactsLimit", 
      headerName: "Contacts Limit", 
      flex: 1,
      render: (value) => (
        <Typography variant="body2">
          {value?.toLocaleString()}
        </Typography>
      )
    },
    { 
      field: "monthlyPrice", 
      headerName: "Monthly Price", 
      flex: 1,
      render: (value) => (
        <Typography variant="body2" fontWeight="medium">
          {formatPrice(value)}
        </Typography>
      )
    },
    { 
      field: "yearlyPrice", 
      headerName: "Yearly Price", 
      flex: 1,
      render: (value) => (
        <Typography variant="body2" fontWeight="medium">
          {formatPrice(value)}
        </Typography>
      )
    },
    { 
      field: "features", 
      headerName: "Features", 
      flex: 1.5,
      render: (value) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {value?.slice(0, 2).map((feature, index) => (
            <Chip 
              key={index}
              label={feature} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          ))}
          {value?.length > 2 && (
            <Chip 
              label={`+${value.length - 2} more`} 
              size="small" 
              color="default" 
              variant="outlined" 
            />
          )}
        </Box>
      )
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      type: "chip",
      chipColor: (isActive) => isActive ? 'success' : 'error'
    }
  ];

  // 📊 Stats Card Component (Simplified without icons)
  const StatsCard = ({ title, value, subtitle, color, trend, trendValue, bgColor }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color={trend === 'up' ? 'success.main' : 'error.main'}>
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: bgColor || `${color}.light`,
              color: `${color}.main`,
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            {value.toString().charAt(0)}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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
            Subscription Plans Management
          </Typography>
          <Button variant="contained" onClick={openAddForm}>
            + Add New Plan
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Plans"
              value={stats.totalPlans}
              subtitle={`${stats.activePlans} active, ${stats.inactivePlans} inactive`}
              color="primary"
              bgColor="#e3f2fd"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Plans"
              value={stats.activePlans}
              subtitle={`${stats.activePercentage}% of total plans`}
              color="success"
              bgColor="#e8f5e9"
              trend="up"
              trendValue={`${stats.activePercentage}%`}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Paid Plans"
              value={stats.paidPlans}
              subtitle={`${stats.freePlans} free plans available`}
              color="warning"
              bgColor="#fff3e0"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Revenue Potential"
              value={`₹${stats.totalMonthlyRevenue.toLocaleString()}`}
              subtitle={`Avg: ₹${stats.averagePrice.toLocaleString()}/mo`}
              color="info"
              bgColor="#e1f5fe"
            />
          </Grid>
        </Grid>

        {/* Additional Stats Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#ffebee',
                      color: '#d32f2f',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Inactive Plans
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.inactivePlans}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#e8f5e9',
                      color: '#2e7d32',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                  >
                    🎁
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Free Plans
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.freePlans}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#e1f5fe',
                      color: '#0288d1',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                  >
                    💰
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Paid vs Free Ratio
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.paidPercentage}% Paid
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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
            onDelete={handleDeleteSubscriptionPlan}
            onView={handleViewSubscriptionPlan}
          />
        )}

        {/* Subscription Plan Form Dialog */}
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
              {editData ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <Box component="form" onSubmit={handleFormSubmit}>
              <Grid container spacing={3}>
                {/* Plan Name */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="select"
                    label="Plan Name"
                    name="name"
                    value={formData.name}
                    changeHandler={handleChange}
                    options={PLAN_NAMES}
                    requiredField={true}
                    error={errors.name}
                  />
                </Grid>

                {/* Position */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="number"
                    label="Position"
                    name="position"
                    placeholder="Display order"
                    value={formData.position}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.position}
                    note="Lower number appears first"
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <CommonField
                    type="text"
                    label="Description"
                    name="description"
                    placeholder="Plan description"
                    value={formData.description}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.description}
                    multiline
                    rows={2}
                  />
                </Grid>

                {/* Contacts Limit */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="number"
                    label="Contacts Limit"
                    name="contactsLimit"
                    placeholder="e.g., 1000"
                    value={formData.contactsLimit}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.contactsLimit}
                    note="Maximum number of contacts allowed"
                  />
                </Grid>

                {/* Monthly Price */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="number"
                    label="Monthly Price (₹)"
                    name="monthlyPrice"
                    placeholder="e.g., 999"
                    value={formData.monthlyPrice}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.monthlyPrice}
                  />
                </Grid>

                {/* Yearly Price */}
                <Grid item xs={12} sm={6}>
                  <CommonField
                    type="number"
                    label="Yearly Price (₹)"
                    name="yearlyPrice"
                    placeholder="e.g., 9999"
                    value={formData.yearlyPrice}
                    changeHandler={handleChange}
                    requiredField={true}
                    error={errors.yearlyPrice}
                    note="Yearly price (optional yearly billing)"
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isActive}
                        onChange={handleChange}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label="Active Plan"
                  />
                </Grid>

                {/* Features */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Features *
                  </Typography>
                  {formData.features.map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <CommonField
                        type="text"
                        label={`Feature ${index + 1}`}
                        name={`feature-${index}`}
                        placeholder="e.g., 1,000 stored contacts"
                        value={feature}
                        changeHandler={(e) => handleFeatureChange(index, e.target.value)}
                        fullWidth
                      />
                      {formData.features.length > 1 && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeFeature(index)}
                          sx={{ minWidth: 'auto', height: '56px' }}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  ))}
                  {errors.features && (
                    <Typography variant="caption" color="error">
                      {errors.features}
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    onClick={addFeature}
                    sx={{ mt: 1 }}
                  >
                    + Add Feature
                  </Button>
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
              {loading ? 'Saving...' : (editData ? 'Update Plan' : 'Create Plan')}
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

export default SubscriptionPlansPage;