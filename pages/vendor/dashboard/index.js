import React from "react";
import Layout from "../../../components/Layout";
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useTheme,
} from "@mui/material";
import {
    Contacts as ContactsIcon,
    Groups as GroupsIcon,
    Campaign as CampaignIcon,
    Description as DescriptionIcon,
    QueryStats as QueryStatsIcon,
    DoneAll as DoneAllIcon,
    CheckCircle as CheckCircleIcon,
    Sync as SyncIcon,
    CloudUpload as CloudUploadIcon,
    Send as SendIcon,
    PhoneAndroid as PhoneAndroidIcon,
    Power as PowerIcon,
} from "@mui/icons-material";

const statsData = [
    {
        title: "Total Contacts",
        value: "2,340",
        icon: <ContactsIcon fontSize="large" />,
        color: "linear-gradient(135deg, #42a5f5, #1e88e5)",
    },
    {
        title: "Total Groups",
        value: "86",
        icon: <GroupsIcon fontSize="large" />,
        color: "linear-gradient(135deg, #ab47bc, #8e24aa)",
    },
    {
        title: "Total Campaigns",
        value: "125",
        icon: <CampaignIcon fontSize="large" />,
        color: "linear-gradient(135deg, #ffa726, #fb8c00)",
    },
    {
        title: "Total Templates",
        value: "58",
        icon: <DescriptionIcon fontSize="large" />,
        color: "linear-gradient(135deg, #26c6da, #00acc1)",
    },
    {
        title: "Messages in Queue",
        value: "450",
        icon: <QueryStatsIcon fontSize="large" />,
        color: "linear-gradient(135deg, #ef5350, #e53935)",
    },
    {
        title: "Messages Processed",
        value: "9,230",
        icon: <DoneAllIcon fontSize="large" />,
        color: "linear-gradient(135deg, #66bb6a, #43a047)",
    },
];

const OverviewCard = ({ title, value, icon, color }) => (
    <Card
        sx={{
            borderRadius: 3,
            background: color,
            color: "#fff",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.25s ease",
            boxShadow: 3,
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
            },
        }}
    >
        <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                {title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
                {value}
            </Typography>
        </Box>
        <Box sx={{ opacity: 0.8 }}>{icon}</Box>
    </Card>
);

const Index = () => {
    const theme = useTheme();

    return (
        <Layout>
            <Typography
                variant="h5"
                fontWeight="bold"
                mb={4}
                sx={{
                    borderLeft: `5px solid ${theme.palette.primary.main}`,
                    pl: 1.5,
                }}
            >
                Vendor Dashboard
            </Typography>

            {/* Overview Section */}
            <Grid container spacing={3} mb={5}>
                {statsData.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <OverviewCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} mb={4} sx={{ alignItems: 'stretch' }}>
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, width: '100%' }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={2}
                            color="primary"
                        >
                            Subscription Snapshot
                        </Typography>

                        <Typography variant="body1" mb={1}>
                            <b>Current Plan:</b> Free
                        </Typography>
                        <Typography variant="body2" mb={2}>
                            Key Usage: 740 / 1,000 Contacts
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(740 / 1000) * 100}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                mb: 2,
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                },
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            Next Renewal / Expiry: 28 Nov 2025
                        </Typography>

                    </Card>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, width: '100%' }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={2}
                            color="primary"
                        >
                            Connection Status
                        </Typography>

                        <Box display="flex" alignItems="center" mb={1.5}>
                            <PhoneAndroidIcon sx={{ color: "green", mr: 1 }} />
                            <Typography>Connected Number: +91 9876543210</Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <PowerIcon sx={{ color: "green", mr: 1 }} />
                            <Typography>Webhook: <Button variant="outlined" sx={{ color: "green" }}>Active</Button></Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, width: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            aaa
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            aaa
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, width: '100%' }}>
                        bbb
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Index;