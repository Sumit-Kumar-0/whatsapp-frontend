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

export default function VendorDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
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
  if (!isMounted || !user || user.role !== 'vendor') {
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
            WANotifier - Vendor Panel
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

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary" align="center">
            Welcome to Vendor Dashboard
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center">
            Hello Vendor! 🎉
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }} align="center">
            You have successfully logged in and can now start using WhatsApp Business API services.
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Button variant="contained" size="large">
            Get Started
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}