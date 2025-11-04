import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Send as SendIcon,
    Contacts as ContactsIcon,
    Campaign as CampaignIcon,
    Description as DescriptionIcon,
    Payment as PaymentIcon,
    Api as ApiIcon,
    BarChart as BarChartIcon,
    Business as BusinessIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

// Dashboard > Vendors > Subscriptions & Payments > Pages & Data Requests > Communication > Configuration > Compliance > Plans

const menuItems = {
    admin: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Vendors', icon: <PeopleIcon />, path: '/admin/vendors' },
        { text: 'Subscriptions', icon: <BusinessIcon />, path: '/admin/subscriptions' },
        // { text: 'Communication', icon: <SendIcon />, path: '/admin/communication' },
        { text: 'Configuration', icon: <SettingsIcon />, path: '/admin/configuration' },
        // { text: 'Compliance', icon: <ApiIcon />, path: '/admin/compliance' },
        { text: 'Plans', icon: <PaymentIcon />, path: '/admin/plans' },
    ],

    vendor: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/vendor/dashboard' },
        { text: 'Inbox', icon: <PeopleIcon />, path: '/vendor/inbox' },
        { text: 'Quick Send', icon: <SendIcon />, path: '/vendor/quick-send' },
        { text: 'Contacts', icon: <ContactsIcon />, path: '/vendor/contacts' },
        { text: 'Campaigns', icon: <CampaignIcon />, path: '/vendor/campaigns' },
        { text: 'Templates', icon: <DescriptionIcon />, path: '/vendor/templates' },
        { text: 'Billing', icon: <PaymentIcon />, path: '/vendor/billing' },
        { text: 'API Setup', icon: <ApiIcon />, path: '/vendor/api-setup' },
        { text: 'Analytics', icon: <BarChartIcon />, path: '/vendor/analytics' },
    ],
};

// Dashboard • Inbox • Quick Send • Contacts • Campaigns • Templates • Billing • API Setup • Analytics

const Sidebar = ({ onItemClick }) => {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNavigation = (path) => {
        router.push(path);
        if (onItemClick) {
            onItemClick();
        }
    };

    // Jab tak mount nahi hua, kuch bhi render mat karo
    if (!mounted) {
        return null;
    }

    // Get menu items based on user role
    const items = user?.role === 'admin' ? menuItems.admin : menuItems.vendor;

    return (
        <Box>
            {/* Sidebar Header */}
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" noWrap component="div">
                    My App
                </Typography>
            </Box>

            <Divider />

            {/* Menu Items */}
            <List>
                {items.map((item) => {
                    const isActive = router.pathname === item.path;

                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'action.selected',
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        color: isActive ? 'primary.main' : 'inherit',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

        </Box>
    );
};

export default Sidebar;