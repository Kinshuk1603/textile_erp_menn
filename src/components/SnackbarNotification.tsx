// src/components/SnackbarNotification.tsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface SnackbarNotificationProps {
    open: boolean;
    onClose: () => void;
    message: string;
    severity: 'success' | 'error'; // Added severity prop
    sx?: React.CSSProperties; // Add this line to accept sx prop
}

const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({ open, onClose, message, severity }) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert onClose={onClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarNotification;
