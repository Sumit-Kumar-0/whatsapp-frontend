import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Close, CheckCircle, Error, Warning, Info } from '@mui/icons-material';

const CommonPopup = ({
  open,
  onClose,
  title,
  message,
  type = 'info', // 'success', 'error', 'warning', 'info', 'confirm'
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  maxWidth = 'sm',
  showCloseButton = true
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ fontSize: 60, color: 'success' }} />;
      case 'error':
        return <Error sx={{ fontSize: 60, color: 'error' }} />;
      case 'warning':
        return <Warning sx={{ fontSize: 60, color: 'warning' }} />;
      case 'info':
      default:
        return <Info sx={{ fontSize: 60, color: 'info' }} />;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          textAlign: 'center'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        position: 'relative',
        pb: 2,
        textAlign: 'center'
      }}>
        <Typography 
          variant="h5" 
          component="div" 
          fontWeight="bold"
          sx={{ color: getTitleColor() }}
        >
          {title}
        </Typography>
        
        {showCloseButton && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* Icon */}
          {type !== 'confirm' && (
            <Box sx={{ mb: 1 }}>
              {getIcon()}
            </Box>
          )}
          
          {/* Message */}
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {message}
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ 
        justifyContent: type === 'confirm' ? 'space-between' : 'center',
        gap: 1,
        px: 3,
        pb: 3
      }}>
        {type === 'confirm' ? (
          <>
            <Button
              onClick={onCancel || onClose}
              variant="outlined"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 100 }}
            >
              {loading ? 'Processing...' : confirmText}
            </Button>
          </>
        ) : (
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ minWidth: 120 }}
          >
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommonPopup;