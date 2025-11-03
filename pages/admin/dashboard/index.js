import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../components/Layout';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  Contacts as ContactsIcon,
  Campaign as CampaignIcon,
  QueryStats as QueryStatsIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchDashboardStats } from '../../../store/slices/admin/dashboardSlice';

const OverviewCard = ({ title, value, icon, color }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 3,
      background: color,
      color: '#fff',
      p: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6,
      },
    }}
  >
    <Box>
      <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
    <Box sx={{ opacity: 0.8 }}>{icon}</Box>
  </Card>
);

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { loading, stats, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
  };

  if (loading && !stats) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const statsData = [
    {
      title: 'Total Vendors',
      value: formatNumber(stats?.totalVendors),
      icon: <GroupIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
    },
    {
      title: 'Active Vendors',
      value: formatNumber(stats?.activeVendors),
      icon: <PersonIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #66bb6a, #43a047)',
    },
    {
      title: 'Total Contacts',
      value: formatNumber(stats?.totalContacts),
      icon: <ContactsIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #ab47bc, #8e24aa)',
    },
    {
      title: 'Total Campaigns',
      value: formatNumber(stats?.totalCampaigns),
      icon: <CampaignIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #ffa726, #fb8c00)',
    },
    {
      title: 'Messages in Queue',
      value: formatNumber(stats?.messagesInQueue),
      icon: <QueryStatsIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #ef5350, #e53935)',
    },
    {
      title: 'Messages Processed',
      value: formatNumber(stats?.messagesProcessed),
      icon: <DoneAllIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #26c6da, #00acc1)',
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={4}
        sx={{
          borderLeft: `5px solid ${theme.palette.primary.main}`,
          pl: 1.5,
        }}
      >
        Admin Dashboard
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Overview Section */}
      <Grid container spacing={3} mb={5}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <OverviewCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Growth Section */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: theme.palette.background.paper,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          sx={{ color: theme.palette.primary.main }}
        >
          Vendor Growth (Last 6 Months)
        </Typography>

        {stats?.vendorGrowth && stats.vendorGrowth.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats.vendorGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fill: theme.palette.text.secondary }} />
              <YAxis tick={{ fill: theme.palette.text.secondary }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              />
              <Bar 
                dataKey="vendors" 
                fill={theme.palette.primary.main} 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary">
              No growth data available
            </Typography>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Index;