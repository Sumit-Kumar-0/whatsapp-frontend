import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/Layout";
import CommonTable from "../../../components/common/CommonTable";
import VendorForm from "../../../components/admin/VendorForm";
import {
  fetchVendors,
  addVendor,
  updateVendor,
  deleteVendor,
} from "../../../store/slices/vendorSlice";

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

  // 🔹 Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // 🔹 Add Vendor
  const handleAddVendor = async (vendor) => {
    try {
      await dispatch(addVendor(vendor)).unwrap();
      showSnackbar("Vendor added successfully");
      setFormOpen(false);
    } catch (error) {
      showSnackbar(error || "Failed to add vendor", "error");
    }
  };

  // 🔹 Update Vendor
  const handleEditVendor = async (vendor) => {
    try {
      await dispatch(
        updateVendor({ vendorId: vendor._id, vendorData: vendor })
      ).unwrap();
      showSnackbar("Vendor updated successfully");
      setFormOpen(false);
    } catch (error) {
      showSnackbar(error || "Failed to update vendor", "error");
    }
  };

  // 🔹 Delete Vendor
  const handleDeleteVendor = async (vendor) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await dispatch(deleteVendor(vendor._id)).unwrap();
      showSnackbar("Vendor deleted successfully");
    } catch (error) {
      showSnackbar(error || "Failed to delete vendor", "error");
    }
  };

  // 🔹 Table Columns
  const columns = [
    { field: "firstName", headerName: "First Name", sortable: true },
    { field: "lastName", headerName: "Last Name" },
    { field: "email", headerName: "Email" },
    { field: "businessName", headerName: "Business Name" },
    { field: "businessCountry", headerName: "Country" },
    { field: "useCase", headerName: "Use Case" },
    {
      field: "status",
      headerName: "Status",
      type: "chip",
      chipColor: "primary",
    },
  ];

  const openAddForm = () => {
    setEditData(null);
    setFormOpen(true);
  };

  const openEditForm = (vendor) => {
    setEditData(vendor);
    setFormOpen(true);
  };

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
          <Typography variant="h5">Vendors</Typography>
          <Button variant="contained" onClick={openAddForm}>
            + Add Vendor
          </Button>
        </Box>

        {/* Table or Loader */}
        {loading ? (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CommonTable
            data={list || []}
            columns={columns}
            actions={["view", "edit", "delete"]}
            onEdit={openEditForm}
            onDelete={handleDeleteVendor}
            onView={(row) =>
              alert(`View vendor: ${row.firstName} ${row.lastName}`)
            }
          />
        )}

        {/* Vendor Form Modal */}
        {formOpen && (
          <VendorForm
            open={formOpen}
            onClose={() => setFormOpen(false)}
            editData={editData}
            onSubmit={editData ? handleEditVendor : handleAddVendor}
          />
        )}

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
