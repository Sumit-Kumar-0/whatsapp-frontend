import { useEffect, useState } from 'react';
import { Button, Box, Typography, Alert, CircularProgress, Chip } from '@mui/material';
import { Facebook, CheckCircle, Warning } from '@mui/icons-material';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EmbeddedSignup = ({ userId }) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [signupData, setSignupData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [checkingPermissions, setCheckingPermissions] = useState(false);

  // Step 1: SDK Load karo
  useEffect(() => {
    // Facebook SDK load karo
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v18.0'
      });
      setIsSDKLoaded(true);
      console.log('Facebook SDK loaded>??????>>>>>>>>>');
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
          console.log('Embedded Signup Message???????? data frontend:', data);
          
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

  // Backend ko data send karne ka function
  const sendSignupDataToBackend = async (data) => {
    try {
      const actualUserId = typeof userId === 'object' ? userId?.id : userId;
      
      const response = await fetch(`${API_URL}/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wabaData: data,
          userId: actualUserId,
          action: 'signup_callback'
        }),
      });
      
      const result = await response.json();
      console.log('Backend response:>>>>>>>>>>>>>>>>>>>>>>', result);
      
      // Signup complete hone ke baad permissions check karo
      if (result.success) {
        checkPermissions();
      }
    } catch (err) {
      console.error('Error sending data to backend:', err);
    }
  };

  // Token code exchange karo backend pe
  const exchangeTokenCode = async (code) => {
    try {
      const actualUserId = typeof userId === 'object' ? userId?.id : userId;
      
      const response = await fetch(`${API_URL}/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          userId: actualUserId,
          action: 'exchange_token'
        }),
      });
      
      const result = await response.json();
      console.log('Token exchange result:>>>>>>>>>>>>>>>>>>>>>>>>>', result);
      
      if (result.success) {
        setError(null);
        setPermissions({
          current: result.permissions || [],
          missing: []
        });
      } else {
        setError(result.error || 'Token exchange failed');
      }
    } catch (err) {
      console.error('Error exchanging token:', err);
      setError('Failed to exchange token');
    }
  };

  // Permissions check karo
  const checkPermissions = async () => {
    try {
      setCheckingPermissions(true);
      const actualUserId = typeof userId === 'object' ? userId?.id : userId;
      
      const response = await fetch(`${API_URL}/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: actualUserId,
          action: 'get_permissions'
        }),
      });
      
      const result = await response.json();
      console.log('Permissions check result:', result);
      
      if (result.success) {
        setPermissions({
          current: result.current_permissions,
          missing: result.missing_permissions,
          hasAll: result.has_all_permissions
        });
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
    } finally {
      setCheckingPermissions(false);
    }
  };

  // Additional permissions request karo
  const requestAdditionalPermissions = async () => {
    try {
      const actualUserId = typeof userId === 'object' ? userId?.id : userId;
      
      const response = await fetch(`${API_URL}/facebook/request-permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: actualUserId
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // User ko permission URL pe redirect karo
        window.location.href = result.permission_url;
      }
    } catch (err) {
      console.error('Error requesting permissions:', err);
      setError('Failed to request additional permissions');
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
    setPermissions(null);

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

    // Embedded Signup launch karo with required permissions
    window.FB.login(fbLoginCallback, {
      config_id: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
      response_type: 'code',
      override_default_response_type: true,
      scope: 'business_management,whatsapp_business_management,whatsapp_business_messaging', // REQUIRED PERMISSIONS
      extras: {
        setup: {},
        featureType: '',
        sessionInfoVersion: '3',
      }
    });
  };

  // Required permissions list
  const requiredPermissions = [
    { name: 'business_management', description: 'Manage your business' },
    { name: 'whatsapp_business_management', description: 'Manage WhatsApp Business' },
    { name: 'whatsapp_business_messaging', description: 'Send and receive messages' }
  ];

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
      
      {/* Permissions Status */}
      {permissions && (
        <Box sx={{ mb: 3, p: 2, bgcolor: permissions.hasAll ? '#e8f5e8' : '#fff3e0', borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            {permissions.hasAll ? '✅ All Permissions Granted' : '⚠️ Additional Permissions Needed'}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            {requiredPermissions.map(perm => {
              const hasPermission = permissions.current.includes(perm.name);
              const isMissing = permissions.missing.includes(perm.name);
              
              return (
                <Box key={perm.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {hasPermission ? (
                    <CheckCircle sx={{ color: 'green', fontSize: 20, mr: 1 }} />
                  ) : (
                    <Warning sx={{ color: 'orange', fontSize: 20, mr: 1 }} />
                  )}
                  <Typography variant="body2">
                    {perm.description}
                    {isMissing && <span style={{ color: 'red', marginLeft: 8 }}>(Missing)</span>}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          
          {!permissions.hasAll && (
            <Button
              variant="outlined"
              color="warning"
              onClick={requestAdditionalPermissions}
              size="small"
            >
              Grant Additional Permissions
            </Button>
          )}
        </Box>
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
          
          {/* Permissions check button */}
          <Button
            variant="outlined"
            onClick={checkPermissions}
            disabled={checkingPermissions}
            sx={{ mt: 1 }}
            size="small"
          >
            {checkingPermissions ? 'Checking...' : 'Check Permissions'}
          </Button>
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