import { Container, Typography, Box, Paper, Button } from '@mui/material';
import EmbeddedSignup from '../../components/EmbeddedSignup';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    // Only render dynamic content after client-side hydration
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Show loading state during hydration
    if (!isClient) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Loading...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    // Check if user is not authenticated
    if (!user) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        You need to complete login or sign up first.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ mt: 4 }} 
                        onClick={() => router.push('/login')}
                    >
                        Go to Login
                    </Button>
                </Paper>
            </Container>
        );
    }

    // User is authenticated, show WhatsApp setup
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    WhatsApp Business Setup
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Connect your WhatsApp Business Account to start sending messages
                </Typography>

                <EmbeddedSignup userId={user} />
            </Paper>
        </Container>
    );
}