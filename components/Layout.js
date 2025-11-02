import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => setIsClosing(false);
  const handleDrawerToggle = () => !isClosing && setMobileOpen(!mobileOpen);

  if (!mounted) return null;

  // ✅ Determine which section this page belongs to
  const isAdminPage = router.pathname.startsWith('/admin');
  const isVendorPage = router.pathname.startsWith('/vendor');

  // ✅ Check if access should be denied
  const accessDenied =
    (isAdminPage && user?.role !== 'admin') ||
    (isVendorPage && user?.role !== 'vendor');

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Header onMenuToggle={handleDrawerToggle} />
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Sidebar onItemClick={isMobile ? handleDrawerClose : undefined} />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* keeps content below header */}

        {accessDenied ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
            flexDirection="column"
          >
            <Typography sx={{ color: 'red', fontSize: '1.2rem' }}>
              Sorry, You Do Not Have Access To This Page
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/')}>
              Go Back Home Page
            </Button>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

export default Layout;
