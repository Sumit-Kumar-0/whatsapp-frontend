import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  AppBar,
  Toolbar,
} from '@mui/material';
import { login, reset, clearVerificationStatus } from '../../store/slices/authSlice';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message, requiresVerification } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');

  const { email, password } = formData;

  useEffect(() => {
    if (isError) {
      console.log('Login error:', message);
      setSnackbarOpen(true);
    }

    if (requiresVerification) {
      setVerificationDialogOpen(true);
      setLoginEmail(email);
    }

    if (isSuccess && user && !requiresVerification) {
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/embadded-steps');
      }
    }

    // Reset states when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, requiresVerification, message, dispatch, router, email]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  const handleVerifyNow = () => {
    setVerificationDialogOpen(false);
    dispatch(clearVerificationStatus());
    router.push(`/verify-email?email=${encodeURIComponent(loginEmail)}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)'}}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" color="inherit" underline="none" sx={{ mr: 2 }}>Home</Link>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component="h1" variant="h4" gutterBottom color="primary">
                WANotifier
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Sign In
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Enter your credentials to access your account
              </Typography>
            </Box>

            {isError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseSnackbar}>
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={onChange}
                type="email"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onChange}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem'
                }}
                disabled={isLoading}
                size="large"
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>

              <Box textAlign="center" sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    variant="body2"
                    fontWeight="bold"
                    sx={{ textDecoration: 'none' }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>

              {/* <Box textAlign="center" sx={{ mt: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  Forgot your password?{' '}
                  <Link
                    href="/forgot-password"
                    variant="body2"
                    sx={{ textDecoration: 'none' }}
                  >
                    Reset it here
                  </Link>
                </Typography>
              </Box> */}
            </Box>
          </Paper>
        </Box>

        {/* Verification Required Dialog */}
        <Dialog open={verificationDialogOpen} onClose={() => setVerificationDialogOpen(false)}>
          <DialogTitle sx={{ textAlign: 'center' }}>
            📧 Email Verification Required
          </DialogTitle>
          <DialogContent>
            <Typography>
              We've sent a verification code to <strong>{loginEmail}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Please verify your email to access all features of WANotifier.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              onClick={handleVerifyNow}
              variant="contained"
              sx={{ ml: 1 }}
            >
              Verify Email
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
    </div>
  );
}