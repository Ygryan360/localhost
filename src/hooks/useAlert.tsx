import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import { AlertContext } from './useAlertContext';
import type { AlertProps } from './useAlertContext';
import type { ReactNode } from 'react';

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alerts, setAlerts] = useState<AlertProps[]>([]);

    const showAlert = useCallback((alert: Omit<AlertProps, 'id'>) => {
        const id = Date.now().toString();
        setAlerts((prev) => [...prev, { ...alert, id }]);

        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 5000);
    }, []);

    const showSuccess = useCallback((message: string, title?: string) => {
        showAlert({ type: 'success', message, title });
    }, [showAlert]);

    const showError = useCallback((message: string, title?: string) => {
        showAlert({ type: 'error', message, title });
    }, [showAlert]);

    const showWarning = useCallback((message: string, title?: string) => {
        showAlert({ type: 'warning', message, title });
    }, [showAlert]);

    const showInfo = useCallback((message: string, title?: string) => {
        showAlert({ type: 'info', message, title });
    }, [showAlert]);

    const removeAlert = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, showSuccess, showError, showWarning, showInfo }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full pointer-events-none">
                {alerts.map((alert) => (
                    <Alert key={alert.id} {...alert} onClose={() => removeAlert(alert.id)} />
                ))}
            </div>
        </AlertContext.Provider>
    );
};

interface AlertComponentProps extends AlertProps {
    onClose: () => void;
}
const Alert = ({ type, title, message, onClose }: AlertComponentProps) => {
    const styles = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-800 dark:text-green-200',
            icon: CheckCircle,
            iconColor: 'text-green-500',
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-800 dark:text-red-200',
            icon: XCircle,
            iconColor: 'text-red-500',
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-800 dark:text-yellow-200',
            icon: AlertCircle,
            iconColor: 'text-yellow-500',
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-200',
            icon: Info,
            iconColor: 'text-blue-500',
        },
    };

    const currentStyle = styles[type];
    const Icon = currentStyle.icon;

    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg ${currentStyle.bg} ${currentStyle.border} animate-in slide-in-from-right`}
            role="alert"
        >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${currentStyle.iconColor}`} />

            <div className="flex-1">
                {title && (
                    <h3 className={`font-semibold mb-1 ${currentStyle.text}`}>
                        {title}
                    </h3>
                )}
                <p className={`text-sm ${currentStyle.text}`}>
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className={`flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${currentStyle.text}`}
                aria-label="Close alert"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};