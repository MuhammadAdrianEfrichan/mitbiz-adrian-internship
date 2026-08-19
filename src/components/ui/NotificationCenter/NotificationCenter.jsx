import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";

const notificationStyles = {
  success: {
    icon: FiCheckCircle,
    label: "Berhasil",
    accent: "#16a34a",
    background: "#f0fdf4",
  },
  error: {
    icon: FiXCircle,
    label: "Terjadi kesalahan",
    accent: "#dc2626",
    background: "#fef2f2",
  },
  warning: {
    icon: FiAlertCircle,
    label: "Perlu diperhatikan",
    accent: "#d97706",
    background: "#fffbeb",
  },
  info: {
    icon: FiInfo,
    label: "Informasi",
    accent: "#2563eb",
    background: "#eff6ff",
  },
};

const NotificationContext = createContext(null);

const NotificationCenter = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification?.type !== "success") return undefined;

    const timeoutId = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notification, onClose]);

  if (!notification) return null;

  const style = notificationStyles[notification.type] ?? notificationStyles.info;
  const Icon = style.icon;

  return (
    <div className="notification-layer" aria-live="polite" aria-atomic="true">
      <section
        className={`notification-popup notification-${notification.type} ${notification.actionLabel ? "notification-confirmation" : ""}`}
        role={notification.actionLabel ? "dialog" : notification.type === "error" ? "alert" : "status"}
        aria-modal={notification.actionLabel ? "true" : undefined}
        style={{ "--notification-accent": style.accent, "--notification-background": style.background }}
      >
        <div className="notification-icon" aria-hidden="true">
          <Icon size={22} />
        </div>
        <div className="notification-content">
          <p className="notification-label">{notification.title || style.label}</p>
          <p className="notification-message">{notification.message}</p>
          <div className="notification-actions">
            {notification.actionLabel && notification.onAction && (
              <button type="button" className="notification-action" onClick={notification.onAction}>
                {notification.actionLabel}
              </button>
            )}
            <button type="button" className={notification.actionLabel ? "notification-cancel" : "notification-close-text"} onClick={onClose}>
              {notification.cancelLabel || (notification.actionLabel ? "Nanti" : "Tutup")}
            </button>
          </div>
        </div>
        <button type="button" className="notification-close" onClick={onClose} aria-label="Tutup pesan">
          <FiX size={18} />
        </button>
      </section>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const closeNotification = useCallback(() => setNotification(null), []);

  const notify = (message, type = "info", options = {}) => {
    setNotification({
      message: String(message || "Terjadi sesuatu. Silakan coba lagi."),
      type,
      title: options.title,
      actionLabel: options.actionLabel,
      cancelLabel: options.cancelLabel,
      onAction: options.onAction,
    });
  };

  const confirm = (message, onConfirm, options = {}) => {
    setNotification({
      message,
      type: "warning",
      title: options.title || "Konfirmasi tindakan",
      actionLabel: options.actionLabel || "Lanjutkan",
      cancelLabel: options.cancelLabel || "Batal",
      onAction: () => {
        closeNotification();
        onConfirm();
      },
    });
  };

  const value = {
    success: (message, options) => notify(message, "success", options),
    error: (message, options) => notify(message, "error", options),
    warning: (message, options) => notify(message, "warning", options),
    info: (message, options) => notify(message, "info", options),
    confirm,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationCenter notification={notification} onClose={closeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification harus dipakai di dalam NotificationProvider");
  return context;
};

export default NotificationCenter;