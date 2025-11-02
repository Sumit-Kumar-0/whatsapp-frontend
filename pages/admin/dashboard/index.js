import React from 'react';
import Layout from '../../../components/Layout';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
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

// Mock chart data
const vendorGrowthData = [
  { month: 'Jan', vendors: 10 },
  { month: 'Feb', vendors: 15 },
  { month: 'Mar', vendors: 20 },
  { month: 'Apr', vendors: 25 },
  { month: 'May', vendors: 30 },
  { month: 'Jun', vendors: 40 },
  { month: 'Jul', vendors: 35 },
  { month: 'Aug', vendors: 45 },
  { month: 'Sep', vendors: 50 },
  { month: 'Oct', vendors: 55 },
  { month: 'Nov', vendors: 60 },
  { month: 'Dec', vendors: 70 },
];

const statsData = [
  {
    title: 'Total Vendors',
    value: '120',
    icon: <GroupIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
  },
  {
    title: 'Active Vendors',
    value: '98',
    icon: <PersonIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #66bb6a, #43a047)',
  },
  {
    title: 'Total Contacts',
    value: '3,250',
    icon: <ContactsIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #ab47bc, #8e24aa)',
  },
  {
    title: 'Total Campaigns',
    value: '86',
    icon: <CampaignIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #ffa726, #fb8c00)',
  },
  {
    title: 'Messages in Queue',
    value: '450',
    icon: <QueryStatsIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #ef5350, #e53935)',
  },
  {
    title: 'Messages Processed',
    value: '9,230',
    icon: <DoneAllIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #26c6da, #00acc1)',
  },
];

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
            Growth - New Vendors (Last 12 Months)
          </Typography>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={vendorGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fill: theme.palette.text.secondary }} />
              <YAxis tick={{ fill: theme.palette.text.secondary }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              />
              <Bar dataKey="vendors" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
    </Layout>
  );
};

export default Index;
