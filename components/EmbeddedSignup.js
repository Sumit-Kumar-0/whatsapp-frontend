import { useEffect, useState } from 'react';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Facebook } from '@mui/icons-material';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EmbeddedSignup = ({ userId }) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [signupData, setSignupData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: SDK Load karo
  useEffect(() => {
    // Facebook SDK load karo
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v24.0'
      });
      setIsSDKLoaded(true);
      console.log('Facebook SDK loaded>>>>>>>>>>');
    };

    // SDK script dynamically add karo
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Message event listener for session logging
    const handleMessage = (event) => {
      if (!event.origin.endsWith('facebook.com')) return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          console.log('Embedded Signup Message:', data);
          
          // Success case - customer ne flow complete kiya
          if (data.event === 'FINISH' || data.event === 'FINISH_ONLY_WABA' || data.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING') {
            setSignupData(data.data);
            setError(null);
            setLoading(false);
            
            // Backend ko data send karo
            sendSignupDataToBackend(data.data);
          }
          // Customer ne flow cancel kiya
          else if (data.event === 'CANCEL') {
            setError(`User cancelled at step: ${data.data.current_step}`);
            setLoading(false);
          }
        }
      } catch (err) {
        console.log('Raw message event:>>>>', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Backend ko data send karne ka function - FIXED
  const sendSignupDataToBackend = async (data) => {
    try {
      // Determine the actual user ID
      const actualUserId = typeof userId === 'object' ? userId?.id : userId;
      
      const response = await fetch(`${API_URL}/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wabaData: data,
          userId: actualUserId, // FIXED: Use actualUserId
          action: 'signup_callback'
        }),
      });
      
      const result = await response.json();
      console.log('Backend response:>>>>>>>>>>>>>>>>>>>>>>', result);
    } catch (err) {
      console.error('Error sending data to backend:', err);
    }
  };

  // Token code exchange karo backend pe - FIXED
  const exchangeTokenCode = async (code) => {
    try {
      // Determine the actual user ID
      const actualUserId = typeof userId === 'object' ? userId?.id : userId;
      
      const response = await fetch(`${API_URL}/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          userId: actualUserId, // FIXED: Add userId here
          action: 'exchange_token'
        }),
      });
      
      const result = await response.json();
      console.log('Token exchange result:>>>>>>>>>>>>>>>>>>>>>>>>>', result);
      
      if (result.success) {
        setError(null);
        // Success - token exchange complete
      } else {
        setError(result.error || 'Token exchange failed');
      }
    } catch (err) {
      console.error('Error exchanging token:', err);
      setError('Failed to exchange token');
    }
  };

  // Step 2: Embedded Signup launch karo
  const launchWhatsAppSignup = () => {
    if (!isSDKLoaded) {
      setError('Facebook SDK not loaded yet. Please wait.');
      return;
    }

    setLoading(true);
    setError(null);

    const fbLoginCallback = (response) => {
      console.log('Facebook Login Response:', response);
      
      if (response.authResponse) {
        const code = response.authResponse.code;
        console.log('Exchangeable Token Code:', code);
        
        // Token code backend ko bhejo
        exchangeTokenCode(code);
      } else {
        setError('User cancelled login or error occurred');
        setLoading(false);
      }
    };

    // Embedded Signup launch karo
    window.FB.login(fbLoginCallback, {
      config_id: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: '', // Default flow
        sessionInfoVersion: '3',
      }
    });
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, maxWidth: 500, mx: 'auto', mt: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Connect WhatsApp Business Account
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Connect your WhatsApp Business Account to start sending notifications
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {signupData ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            ✅ WhatsApp Business Account Connected Successfully!
          </Typography>
          <Box sx={{ mt: 1, fontSize: '14px' }}>
            <div><strong>WABA ID:</strong> {signupData.waba_id}</div>
            <div><strong>Phone Number ID:</strong> {signupData.phone_number_id}</div>
            {signupData.business_id && (
              <div><strong>Business ID:</strong> {signupData.business_id}</div>
            )}
          </Box>
        </Alert>
      ) : (
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Facebook />}
          onClick={launchWhatsAppSignup}
          disabled={!isSDKLoaded || loading}
          sx={{
            backgroundColor: '#1877F2',
            '&:hover': { backgroundColor: '#166FE5' },
            minWidth: 250,
            height: 45,
          }}
        >
          {loading ? 'Connecting...' : 'Connect WhatsApp Business'}
        </Button>
      )}
      
      {!isSDKLoaded && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Initializing Facebook SDK...
        </Typography>
      )}
    </Box>
  );
};

export default EmbeddedSignup;