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
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Stack
} from "@mui/material";
import {
  MoreVert,
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  Send,
  Visibility,
  ContentCopy,
  Sync
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/Layout";
import CommonTable from "../../../components/common/CommonTable";
import CommonPopup from "../../../components/common/CommonPopup";
import TemplateForm from "../../../components/vendor/TemplateForm";
import {
  fetchTemplates,
  removeTemplate,
  submitTemplateForApproval,
  syncTemplatesFromMeta
} from "../../../store/slices/vendor/templateSlice";

// Constants
const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft', color: 'default' },
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'APPROVED', label: 'Approved', color: 'success' },
  { value: 'REJECTED', label: 'Rejected', color: 'error' },
  { value: 'PAUSED', label: 'Paused', color: 'secondary' },
  { value: 'LIMITED', label: 'Limited', color: 'info' }
];

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

const TemplatePage = () => {
  const dispatch = useDispatch();
  const { 
    loading, 
    list, 
    pagination, 
    error, 
    syncLoading,
    metaTemplates 
  } = useSelector((state) => state.templates);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filters and search
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
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

  // Menu state
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const fetchTemplatesData = async () => {
    try {
      await dispatch(fetchTemplates(filters)).unwrap();
    } catch (error) {
      showSnackbar("Failed to fetch templates", "error");
    }
  };

  useEffect(() => {
    fetchTemplatesData();
  }, [filters]);

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

  // 🔹 Template Actions
  const handleDeleteTemplate = (template) => {
    showConfirmPopup(
      `Are you sure you want to delete template "${template.name}"? This action cannot be undone.`,
      async () => {
        setPopup(prev => ({ ...prev, loading: true }));
        try {
          await dispatch(removeTemplate(template._id)).unwrap();
          closePopup();
          showSuccessPopup("Template deleted successfully!");
          fetchTemplatesData();
        } catch (error) {
          closePopup();
          showErrorPopup(error || "Failed to delete template");
        }
      }
    );
  };

  const handleSubmitTemplate = async (template) => {
    showConfirmPopup(
      `Submit template "${template.name}" for Meta approval? Once submitted, you cannot edit it until approved.`,
      async () => {
        setPopup(prev => ({ ...prev, loading: true }));
        try {
          await dispatch(submitTemplateForApproval(template._id)).unwrap();
          closePopup();
          showSuccessPopup("Template submitted for approval!");
          fetchTemplatesData();
        } catch (error) {
          closePopup();
          showErrorPopup(error || "Failed to submit template");
        }
      }
    );
  };

  const handleViewTemplate = (template) => {
    setViewData(template);
  };

  const handleEditTemplate = (template) => {
    setEditData(template);
    setFormOpen(true);
  };

  const handleCopyTemplate = (template) => {
    const copiedTemplate = {
      ...template,
      name: `${template.name} - Copy`,
      status: 'DRAFT',
      _id: undefined,
      templateId: undefined,
      submittedAt: undefined,
      approvedAt: undefined
    };
    setEditData(copiedTemplate);
    setFormOpen(true);
  };

  // 🔹 Sync templates from Meta
  const handleSyncTemplates = async () => {
    try {
      await dispatch(syncTemplatesFromMeta()).unwrap();
      showSuccessPopup("Templates synced successfully from Meta!");
      fetchTemplatesData(); // Refresh local templates
    } catch (error) {
      showErrorPopup(error || "Failed to sync templates from Meta");
    }
  };

  // 🔹 Menu handlers
  const handleMenuOpen = (event, template) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTemplate(null);
  };

  const handleMenuAction = (action) => {
    if (!selectedTemplate) return;

    switch (action) {
      case 'view':
        handleViewTemplate(selectedTemplate);
        break;
      case 'edit':
        if (selectedTemplate.status === 'DRAFT') {
          handleEditTemplate(selectedTemplate);
        } else {
          showErrorPopup("Only DRAFT templates can be edited");
        }
        break;
      case 'submit':
        if (selectedTemplate.status === 'DRAFT') {
          handleSubmitTemplate(selectedTemplate);
        } else {
          showErrorPopup("Only DRAFT templates can be submitted");
        }
        break;
      case 'copy':
        handleCopyTemplate(selectedTemplate);
        break;
      case 'delete':
        handleDeleteTemplate(selectedTemplate);
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  // 🔹 Form handlers
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditData(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    showSuccessPopup(editData ? "Template updated successfully!" : "Template created successfully!");
    fetchTemplatesData();
  };

  // 🔹 Filter handlers
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({
      ...prev,
      status: e.target.value,
      page: 1
    }));
  };

  const handleCategoryChange = (e) => {
    setFilters(prev => ({
      ...prev,
      category: e.target.value,
      page: 1
    }));
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({
      ...prev,
      page: value
    }));
  };

  // 🔹 Get status display info
  const getStatusInfo = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status) || { label: status, color: 'default' };
  };

  // 🔹 Table Columns
  const columns = [
    { 
      field: "name", 
      headerName: "Template Name", 
      sortable: true, 
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row?.category}
          </Typography>
          {params.row?.templateId && (
            <Typography variant="caption" color="primary" display="block">
              ID: {params.row?.templateId}
            </Typography>
          )}
        </Box>
      )
    },
    { 
      field: "language", 
      headerName: "Language", 
      flex: 1,
      renderCell: (params) => (
        LANGUAGE_OPTIONS.find(lang => lang.value === params.value)?.label || params.value
      )
    },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => {
        const statusInfo = getStatusInfo(params.value);
        return (
          <Chip 
            label={statusInfo.label} 
            color={statusInfo.color}
            size="small"
            variant="outlined"
          />
        );
      }
    },
    { 
      field: "header", 
      headerName: "Header Type", 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" textTransform="capitalize">
          {params.value?.type?.toLowerCase() || 'None'}
        </Typography>
      )
    },
    { 
      field: "buttons", 
      headerName: "Buttons", 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row?.buttons?.length || 0} buttons
        </Typography>
      )
    },
    { 
      field: "createdAt", 
      headerName: "Created", 
      type: "date",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
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
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Message Templates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and manage WhatsApp message templates
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outlined" 
              startIcon={<Sync />}
              onClick={handleSyncTemplates}
              disabled={syncLoading}
            >
              {syncLoading ? <CircularProgress size={20} /> : 'Sync from Meta'}
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => setFormOpen(true)}
            >
              Create Template
            </Button>
          </Stack>
        </Box>

        {/* Filters Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search templates..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {CATEGORY_OPTIONS.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    {pagination.total || 0} templates
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
            {error}
          </Alert>
        )}

        {/* Table or Loader */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <CommonTable
              data={list || []}
              columns={columns}
              actions={[]} // We'll use custom actions in renderCell
              renderActions={(row) => (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, row)}
                >
                  <MoreVert />
                </IconButton>
              )}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={filters.page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {/* Template Form Dialog */}
        <TemplateForm
          open={formOpen}
          onClose={handleCloseForm}
          editData={editData}
          onSuccess={handleFormSuccess}
        />

        {/* Template View Dialog */}
        <Dialog
          open={!!viewData}
          onClose={() => setViewData(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">Template Details</Typography>
          </DialogTitle>
          <DialogContent>
            {viewData && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{viewData.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={getStatusInfo(viewData.status).label}
                      color={getStatusInfo(viewData.status).color}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{viewData.category}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Language</Typography>
                    <Typography variant="body1">
                      {LANGUAGE_OPTIONS.find(lang => lang.value === viewData.language)?.label || viewData.language}
                    </Typography>
                  </Grid>
                  {viewData.templateId && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Meta Template ID</Typography>
                      <Typography variant="body2" fontFamily="monospace">
                        {viewData.templateId}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Body</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                      {viewData.body?.text}
                    </Typography>
                  </Grid>
                  {viewData.header && viewData.header.type !== 'NONE' && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Header</Typography>
                      <Typography variant="body1">
                        Type: {viewData.header.type}
                        {viewData.header.text && ` - ${viewData.header.text}`}
                      </Typography>
                    </Grid>
                  )}
                  {viewData.footer?.text && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Footer</Typography>
                      <Typography variant="body1">{viewData.footer.text}</Typography>
                    </Grid>
                  )}
                  {viewData.buttons && viewData.buttons.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Buttons</Typography>
                      <Stack spacing={1}>
                        {viewData.buttons.map((button, index) => (
                          <Chip 
                            key={index}
                            label={`${button.type}: ${button.text}`}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Stack>
                    </Grid>
                  )}
                  {viewData.createdAt && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                      <Typography variant="body2">
                        {new Date(viewData.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                  {viewData.submittedAt && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Submitted</Typography>
                      <Typography variant="body2">
                        {new Date(viewData.submittedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewData(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Action Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuAction('view')}>
            <Visibility sx={{ mr: 1 }} /> View Details
          </MenuItem>
          {selectedTemplate?.status === 'DRAFT' && (
            <MenuItem onClick={() => handleMenuAction('edit')}>
              <Edit sx={{ mr: 1 }} /> Edit
            </MenuItem>
          )}
          {selectedTemplate?.status === 'DRAFT' && (
            <MenuItem onClick={() => handleMenuAction('submit')}>
              <Send sx={{ mr: 1 }} /> Submit for Approval
            </MenuItem>
          )}
          <MenuItem onClick={() => handleMenuAction('copy')}>
            <ContentCopy sx={{ mr: 1 }} /> Duplicate
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>

        {/* Common Popup */}
        <CommonPopup
          open={popup.open}
          onClose={closePopup}
          title={popup.title}
          message={popup.message}
          type={popup.type}
          onConfirm={popup.onConfirm}
          loading={popup.loading}
          confirmText="Yes, Continue"
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

export default TemplatePage;