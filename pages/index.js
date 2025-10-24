import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Zoom,
  useScrollTrigger,
  Avatar,
  Divider,
  Fade,
  IconButton
} from '@mui/material';
import {
  KeyboardArrowUp,
  WhatsApp,
  Campaign,
  SmartToy,
  QrCode2,
  Group,
  CheckCircle,
  ArrowForward,
  Security,
  Analytics,
  BusinessCenter,
  VerifiedUser,
  Lock,
  Shield,
  Star,
  PlayArrow,
  TrendingUp,
  Bolt,
  Groups,
  Chat,
  Notifications
} from '@mui/icons-material';
import Link from 'next/link';

// Scroll to top component
function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );
    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/vendor/dashboard');
      }
    }
  }, [user, router]);

  const features = [
    {
      icon: <Campaign sx={{ fontSize: 40 }} />,
      title: 'Advanced Campaign Management',
      description: 'Create, schedule, and launch targeted WhatsApp campaigns with precision timing and audience segmentation. Reach thousands of customers instantly.'
    },
    {
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      title: 'Intelligent Automation',
      description: 'Automate customer interactions with AI-powered bots that handle queries, collect information, and provide instant responses 24/7.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Real-time Analytics',
      description: 'Monitor campaign performance with detailed analytics and insights. Track delivery rates, engagement metrics, and conversion data in real-time.'
    },
    {
      icon: <QrCode2 sx={{ fontSize: 40 }} />,
      title: 'Instant Connection',
      description: 'Generate dynamic QR codes for seamless customer onboarding. Customers can scan and start chatting with your business in seconds.'
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />,
      title: 'Contact Intelligence',
      description: 'Manage and segment your contacts with advanced filtering, custom fields, and tags for hyper-personalized communication.'
    },
    {
      icon: <BusinessCenter sx={{ fontSize: 40 }} />,
      title: 'Enterprise Ready',
      description: 'Scale your business with multi-user support, role-based permissions, team collaboration, and enterprise-grade security features.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Businesses Trust Us' },
    { number: '50M+', label: 'Messages Delivered' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const useCases = [
    {
      icon: <Chat />,
      title: 'Customer Support',
      description: 'Provide instant support and resolve queries faster with automated responses and live agent handoff.'
    },
    {
      icon: <Notifications />,
      title: 'Marketing Campaigns',
      description: 'Run targeted campaigns with personalized messages, rich media, and interactive buttons.'
    },
    {
      icon: <Groups />,
      title: 'Team Collaboration',
      description: 'Manage multiple agents, assign conversations, and maintain consistent brand communication.'
    },
    {
      icon: <TrendingUp />,
      title: 'Sales & Conversions',
      description: 'Convert leads into customers with automated follow-ups, product catalogs, and quick replies.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Standard',
      price: '₹5,999',
      period: 'per month',
      description: 'Everything growing businesses need',
      features: [
        'Up to 1,000 contacts',
        'Unlimited campaigns',
        'Advanced automation',
        'Priority support',
        '2 user accounts',
        'Advanced analytics',
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '₹9,999',
      period: 'per month',
      description: 'Everything growing businesses need',
      features: [
        'Up to 5,000 contacts',
        'Unlimited campaigns',
        'Advanced automation',
        'Priority support',
        '5 user accounts',
        'Advanced analytics',
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '₹19,999',
      period: 'per month',
      description: 'Everything growing businesses need',
      features: [
        'Unlimited contacts',
        'Unlimited campaigns',
        'AI-powered automation',
        '24/7 dedicated support',
        'Unlimited users',
        'Custom analytics',
        'White-label options',
        'SLA guarantee'
      ],
      cta: 'Start Free Trial',
      popular: false
    }
  ];

  const securityFeatures = [
    {
      icon: <Lock />,
      title: 'End-to-End Encryption',
      description: 'All messages are encrypted in transit and at rest, ensuring complete privacy and security.'
    },
    {
      icon: <Shield />,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified with regular security audits and penetration testing.'
    },
    {
      icon: <VerifiedUser />,
      title: 'Data Compliance',
      description: 'GDPR, CCPA, and HIPAA compliant data handling with regional data residency options.'
    },
    {
      icon: <Security />,
      title: 'Access Control',
      description: 'Role-based access control with multi-factor authentication and session management.'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }} id="back-to-top-anchor">
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <WhatsApp sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              WANotifier
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button color="inherit" href="#features">Features</Button>
            <Button color="inherit" href="#usecases">Use Cases</Button>
            <Button color="inherit" href="#pricing">Pricing</Button>
            <Button color="inherit" href="#security">Security</Button>
          </Box>
          <Button
            variant="outlined"
            color="success"
            sx={{ ml: 2 }}
            component={Link}
            href="/login"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 2 }}
            component={Link}
            href="/register"
            startIcon={<WhatsApp />}
          >
            Get Started Free
          </Button>
        </Toolbar>
      </AppBar>

      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Chip
                    label="Powered by WhatsApp Cloud API"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      mb: 2,
                      fontWeight: 'bold'
                    }}
                  />
                  <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.2, fontSize: "48px" }}>
                    Engage Your Customers on WhatsApp Like Never Before
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                    Unlock the full potential of customer engagement with our comprehensive WhatsApp Marketing Platform.
                    Automate conversations, launch campaigns, and drive growth - all from one powerful dashboard.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      href="/register"
                      sx={{
                        bgcolor: 'white',
                        color: '#128C7E',
                        fontWeight: 'bold',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-2px)'
                        }
                      }}
                      endIcon={<ArrowForward />}
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      href="https://wa.link/py1gfr"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Request Demo
                    </Button>
                  </Box>

                  {/* Trust Badges */}
                  <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {stats.map((stat, index) => (
                      <Box key={index} sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {stat.number}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    p: 3,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      p: 3,
                      color: 'text.primary',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Chat Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 40, height: 40 }}>
                        <WhatsApp />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                          Business Account
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Online • Cloud API Connected
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <Notifications />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Chat Messages */}
                    <Box sx={{ mb: 3 }}>
                      {/* Business Message */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main', fontSize: '0.8rem' }}>B</Avatar>
                        <Box sx={{ bgcolor: 'success.light', color: 'white', p: 2, borderRadius: 2, maxWidth: '70%', borderBottomLeftRadius: 4 }}>
                          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                            Hello! 👋 Thanks for reaching out. How can we help you today?
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 0.5 }}>
                            2:30 PM
                          </Typography>
                        </Box>
                      </Box>

                      {/* Customer Message */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>C</Avatar>
                        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, maxWidth: '70%', borderBottomRightRadius: 4 }}>
                          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                            I want to know about your pricing plans and features
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 0.5, textAlign: 'right' }}>
                            2:31 PM
                          </Typography>
                        </Box>
                      </Box>

                      {/* Quick Replies */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {['View Pricing', 'See Features', 'Book Demo'].map((text, idx) => (
                          <Chip
                            key={idx}
                            label={text}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: 'success.main',
                              color: 'success.main',
                              fontSize: '0.75rem',
                              '&:hover': {
                                bgcolor: 'success.main',
                                color: 'white'
                              }
                            }}
                          />
                        ))}
                      </Box>

                      {/* Automated Response */}
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main', fontSize: '0.8rem' }}>B</Avatar>
                        <Box sx={{ bgcolor: 'success.light', color: 'white', p: 2, borderRadius: 2, maxWidth: '70%', borderBottomLeftRadius: 4 }}>
                          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                            Sure! Let me share our pricing details and schedule a demo for you. 🤖
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 0.5 }}>
                            2:31 PM • Automated
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Message Input */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: 'grey.50',
                      borderRadius: 4,
                      p: 1.5,
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, ml: 1 }}>
                        Type a message...
                      </Typography>
                      <IconButton color="success" sx={{ bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } }}>
                        <WhatsApp />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }} id="features">
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Chip
            label="COMPLETE WHATSAPP MARKETING SUITE"
            color="success"
            sx={{ mb: 2, fontWeight: 'bold' }}
          />
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Everything You Need to Scale Your Business
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}>
            From automated customer support to targeted marketing campaigns, our platform provides all the tools
            you need to build lasting customer relationships and drive measurable business growth.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    borderColor: 'success.main'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'success.light',
                      color: 'white',
                      mb: 3
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Use Cases Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }} id="usecases">
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Perfect for Every Business Need
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Discover how businesses across industries are transforming customer communication with our platform
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {useCases.map((usecase, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ p: 4, border: 'none', boxShadow: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'success.light',
                        color: 'white',
                        flexShrink: 0
                      }}
                    >
                      {usecase.icon}
                    </Box>
                    <Box>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {usecase.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {usecase.description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }} id="pricing">
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Choose the plan that works best for your business. All plans include core features with no hidden fees.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    border: plan.popular ? "2px solid" : "1px solid",
                    borderColor: plan.popular ? "success.main" : "divider",
                    transform: plan.popular ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: plan.popular ? "scale(1.05)" : "scale(1.03)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {plan.popular && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "success.main",
                        color: "white",
                        px: 3,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Star sx={{ fontSize: 16 }} />
                      MOST POPULAR
                    </Box>
                  )}

                  <CardContent
                    sx={{
                      p: 4,
                      textAlign: "center",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: "bold" }}>
                      {plan.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", mb: 1 }}>
                      <Typography variant="h3" component="div" sx={{ fontWeight: "bold" }}>
                        {plan.price}
                      </Typography>
                      {plan.price !== "Custom" && (
                        <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                          / {plan.period}
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 48 }}>
                      {plan.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <List dense sx={{ textAlign: "left", mb: 3 }}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={feature} primaryTypographyProps={{ variant: "body2" }} />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: "auto" }}>
                      <Button
                        fullWidth
                        variant={plan.popular ? "contained" : "outlined"}
                        color="success"
                        size="large"
                        component={Link}
                        href="/register"
                      >
                        {plan.cta}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>


          {/* Pricing Note */}
          <Box textAlign="center" sx={{ mt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              * All prices exclude WhatsApp Business API message fees. Enterprise plan includes custom pricing based on usage.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Security Section */}
      <Container maxWidth="lg" sx={{ py: 10 }} id="security">
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Enterprise-Grade Security
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Your data security and privacy are our top priority. Built with enterprise-grade security from the ground up.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {securityFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'success.light',
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Security Certifications */}
        <Paper sx={{ p: 4, mt: 6, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Trusted by Industry Leaders
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3, flexWrap: 'wrap' }}>
            {['SOC 2 Type II', 'GDPR Compliant', 'ISO 27001', 'HIPAA Ready', 'CCPA Compliant'].map((cert, idx) => (
              <Chip
                key={idx}
                label={cert}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            ))}
          </Box>
        </Paper>
      </Container>

      {/* Final CTA */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Ready to Transform Your Business Communication?
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                Join thousands of forward-thinking businesses using WANotifier to drive growth and customer satisfaction.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/register"
                  sx={{
                    bgcolor: 'success.main',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'success.dark',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  endIcon={<ArrowForward />}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="https://wa.link/py1gfr"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Schedule Demo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <WhatsApp sx={{ fontSize: 120, opacity: 0.8, color: 'success.main' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.800', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <img src="/images/Meta-Business-Partner.jpeg" alt="WANotifier" style={{ width: "100%" }} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1rem', pl: "8px" }}>
                Product
              </Typography>
              <List dense sx={{ color: 'grey.400' }}>
                <ListItem sx={{ px: 0, py: 0 }}>
                  <Button sx={{ textTransform: "capitalize" }} color="inherit" href="#features">Features</Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0 }}>
                  <Button sx={{ textTransform: "capitalize" }} color="inherit" href="#pricing">Pricing</Button>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1rem', pl: "8px" }}>
                Company
              </Typography>
              <List dense sx={{ color: 'grey.400' }}>
                <ListItem sx={{ px: 0, py: 0 }}>
                  <Button sx={{ textTransform: "capitalize" }} color="inherit" href="#back-to-top-anchor">About</Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0 }}>
                  <Button sx={{ textTransform: "capitalize" }} color="inherit" href="https://wa.link/py1gfr">Contact</Button>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1rem', pl: "8px" }}>
                Legal
              </Typography>
              <List dense sx={{ color: 'grey.400' }}>
                <ListItem sx={{ px: 0, py: 0 }}>
                  <Button sx={{ textTransform: "capitalize" }} color="inherit">Privacy Policy</Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0 }}>
                  <Button sx={{ textTransform: "capitalize" }} color="inherit">Terms of Service</Button>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid', borderColor: 'grey.700', mt: 4, pt: 3 }}>
            <Typography variant="body2" color="grey.400" textAlign="center">
              © {currentYear} WANotifier. All rights reserved. | WhatsApp is a trademark of Meta Platforms, Inc.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Scroll to top button */}
      <ScrollTop>
        <Button color="inherit" href="#back-to-top-anchor">
          <Fab color="success" size="medium" aria-label="scroll back to top">
            <KeyboardArrowUp />
          </Fab>
        </Button>

      </ScrollTop>

    </Box>
  );
}