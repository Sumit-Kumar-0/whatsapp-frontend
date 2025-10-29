// import Layout from '../components/Layout';
import { Typography, Paper } from '@mui/material';
import Layout from '../../../components/Layout';

export default function Companies() {
  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Companies admin
        </Typography>
        <Typography>
          This is the companies page. You can manage companies here.
        </Typography>
      </Paper>
    </Layout>
  );
}