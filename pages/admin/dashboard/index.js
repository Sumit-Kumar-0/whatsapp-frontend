import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import Layout from '../../../components/Layout';

export default function AdminDashboard() {

  return (
    <Layout>
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Welcome to Admin Dashboard
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            Hello Admin! 👋
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You have successfully logged into the admin panel.
          </Typography>
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
              <Box>
                <Typography variant="h4" color="primary">0</Typography>
                <Typography variant="body2">Total Vendors</Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="primary">0</Typography>
                <Typography variant="body2">Active Vendors</Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="primary">0</Typography>
                <Typography variant="body2">Total Campaigns</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
    </Layout>
  );
}