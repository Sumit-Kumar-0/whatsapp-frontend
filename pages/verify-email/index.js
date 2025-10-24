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
} from '@mui/material';
import { verifyEmail, resendVerificationCode, reset } from '../../store/slices/authSlice';

export default function VerifyEmail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
  });

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { email, verificationCode } = formData;

  useEffect(() => {
    // Agar URL se email parameter mile to set karo
    if (router.query.email) {
      setFormData(prev => ({
        ...prev,
        email: router.query.email
      }));
    }
  }, [router.query]);

  useEffect(() => {
    if (isError) {
      console.log('Verification error:', message);
    }

    if (isSuccess && user) {
      // ✅ Check karo ki email actually verified hai backend se
      if (user.isEmailVerified) {
        // Email verify hone ke baad dashboard redirect
        setTimeout(() => {
          if (user?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/embadded-steps');
          }
        }, 2000);
      } else {
        // ❌ Agar backend mein verified nahi hai to error show karo
        console.log('Email not verified in backend');
      }
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, router, user]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email || !verificationCode) {
      alert('Please fill all fields');
      return;
    }

    dispatch(verifyEmail({ email, verificationCode }));
  };

  const handleResendCode = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setResendLoading(true);
    setResendSuccess(false);

    try {
      await dispatch(resendVerificationCode({ email })).unwrap();
      setResendSuccess(true);
    } catch (error) {
      console.log('Resend error:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Verify Your Email
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Enter the verification code sent to your email
          </Typography>
          
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {isSuccess && user?.isEmailVerified && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Email verified successfully! Redirecting to dashboard...
            </Alert>
          )}

          {isSuccess && !user?.isEmailVerified && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Verification completed but email not marked as verified. Please try logging in again.
            </Alert>
          )}

          {resendSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Verification code sent successfully!
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="verificationCode"
              label="Verification Code"
              id="verificationCode"
              value={verificationCode}
              onChange={onChange}
              placeholder="Enter 6-digit code"
              inputProps={{ maxLength: 6 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
              size="large"
            >
              {isLoading ? <CircularProgress size={24} /> : 'Verify Email'}
            </Button>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Didn't receive the code?
              </Typography>
              <Button
                onClick={handleResendCode}
                disabled={resendLoading || !email}
                variant="outlined"
                size="small"
              >
                {resendLoading ? <CircularProgress size={20} /> : 'Resend Code'}
              </Button>
            </Box>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link href="/login" variant="body2">
                Back to Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}