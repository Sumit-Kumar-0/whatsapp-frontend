// import Layout from '../components/Layout';
import { Typography, Paper } from '@mui/material';
import Layout from '../../../components/Layout';

export default function Settings() {
  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings admin
        </Typography>
        <Typography>
          This is the settings page. Configure your application here.
        </Typography>
      </Paper>
    </Layout>
  );
}