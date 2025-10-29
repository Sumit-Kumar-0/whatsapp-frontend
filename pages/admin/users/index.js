// import Layout from '../components/Layout';
import { Typography, Paper } from '@mui/material';
import Layout from '../../../components/Layout';

export default function Users() {
  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Users Management admin
        </Typography>
        <Typography>
          This is the users page. You can manage users here.
        </Typography>
      </Paper>
    </Layout>
  );
}