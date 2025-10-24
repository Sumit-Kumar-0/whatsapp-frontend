import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { logout } from '../../../store/slices/authSlice';

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, router, isMounted]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const payload = { id: user.id };
    dispatch(logout(payload));
    router.push('/login');
  };

  // Don't render anything until mounted on client
  if (!isMounted || !user || user.role !== 'admin') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography sx={{color: "red"}}>Sorry You Do Not Have Access To This Page</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WANotifier - Admin Panel
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user.email?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

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
  );
}