import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Info,
  Siren,
  X,
} from "lucide-react";

import {
  checkQueueNotifications,
  clearNotifications,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  removeNotification,
  subscribeToNotifications,
} from "../utils/smartCareNotifications";

import "./NotificationCenter.css";

function NotificationCenter() {
  const [
    notifications,
    setNotifications,
  ] = useState(
    getNotifications()
  );

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  /* =======================================================
     INITIAL + LIVE NOTIFICATION SYNC
     ======================================================= */

  useEffect(() => {
    checkQueueNotifications();

    const unsubscribe =
      subscribeToNotifications(
        (updated) => {
          setNotifications(
            updated
          );
        }
      );

    const interval =
      setInterval(() => {
        checkQueueNotifications();

        setNotifications(
          getNotifications()
        );
      }, 2500);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* =======================================================
     UNREAD COUNT
     ======================================================= */

  const unreadCount =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.read
        ).length,
      [notifications]
    );

  /* =======================================================
     SORT
     ======================================================= */

  const sortedNotifications =
    useMemo(
      () =>
        [...notifications].sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        ),
      [notifications]
    );

  /* =======================================================
     TOGGLE
     ======================================================= */

  const togglePanel = () => {
    setIsOpen(
      (current) => !current
    );
  };

  /* =======================================================
     READ
     ======================================================= */

  const handleRead = (
    id
  ) => {
    const updated =
      markNotificationRead(id);

    setNotifications(
      updated
    );
  };

  /* =======================================================
     MARK ALL
     ======================================================= */

  const handleMarkAllRead =
    () => {
      const updated =
        markAllNotificationsRead();

      setNotifications(
        updated
      );
    };

  /* =======================================================
     REMOVE
     ======================================================= */

  const handleRemove = (
    id
  ) => {
    const updated =
      removeNotification(id);

    setNotifications(
      updated
    );
  };

  /* =======================================================
     CLEAR
     ======================================================= */

  const handleClear = () => {
    clearNotifications();
    setNotifications([]);
  };

  return (
    <div className="smartcare-notification">
      <button
        type="button"
        className={`notification-trigger ${
          unreadCount > 0
            ? "has-unread"
            : ""
        }`}
        onClick={togglePanel}
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="notification-backdrop"
            onClick={() =>
              setIsOpen(false)
            }
          ></div>

          <div className="notification-panel">
            {/* HEADER */}

            <div className="notification-panel-header">
              <div>
                <div className="notification-heading">
                  <HeartPulse
                    size={14}
                  />
                  SMARTCARE
                </div>

                <h2>
                  Notifications
                </h2>

                <p>
                  Queue updates and system alerts
                </p>
              </div>

              <button
                type="button"
                className="notification-close"
                onClick={() =>
                  setIsOpen(false)
                }
                aria-label="Close notifications"
              >
                <X size={17} />
              </button>
            </div>

            {/* TOOLBAR */}

            <div className="notification-toolbar">
              <span>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "All caught up"}
              </span>

              <div>
                {unreadCount >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      handleMarkAllRead
                    }
                  >
                    Mark all read
                  </button>
                )}

                {notifications.length >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      handleClear
                    }
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* LIST */}

            <div className="notification-list">
              {sortedNotifications.length >
              0 ? (
                sortedNotifications.map(
                  (
                    notification
                  ) => (
                    <NotificationItem
                      key={
                        notification.id
                      }
                      notification={
                        notification
                      }
                      onRead={() =>
                        handleRead(
                          notification.id
                        )
                      }
                      onRemove={() =>
                        handleRemove(
                          notification.id
                        )
                      }
                    />
                  )
                )
              ) : (
                <div className="notification-empty">
                  <div className="notification-empty-icon">
                    <Bell size={22} />
                  </div>

                  <h3>
                    No notifications
                  </h3>

                  <p>
                    SmartCare queue updates
                    and system alerts will
                    appear here.
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="notification-footer">
              <span>
                SmartCare frontend prototype
              </span>

              <div className="notification-live">
                <span></span>
                Live
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   NOTIFICATION ITEM
   ========================================================= */

function NotificationItem({
  notification,
  onRead,
  onRemove,
}) {
  const icon =
    notification.type ===
    "emergency" ? (
      <Siren size={17} />
    ) : notification.type ===
      "success" ? (
      <CheckCircle2 size={17} />
    ) : notification.type ===
      "warning" ? (
      <AlertTriangle
        size={17}
      />
    ) : notification.type ===
      "queue" ? (
      <Clock3 size={17} />
    ) : (
      <Info size={17} />
    );

  return (
    <div
      className={`notification-item ${
        notification.read
          ? "read"
          : "unread"
      } ${notification.type}`}
      onClick={onRead}
    >
      <div className="notification-item-icon">
        {icon}
      </div>

      <div className="notification-item-content">
        <div className="notification-item-top">
          <strong>
            {notification.title}
          </strong>

          {!notification.read && (
            <span className="notification-unread-dot"></span>
          )}
        </div>

        <p>
          {notification.message}
        </p>

        <span className="notification-time">
          {formatNotificationTime(
            notification.createdAt
          )}
        </span>
      </div>

      <button
        type="button"
        className="notification-remove"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        aria-label="Remove notification"
      >
        <X size={13} />
      </button>
    </div>
  );
}

/* =========================================================
   TIME FORMAT
   ========================================================= */

function formatNotificationTime(
  dateString
) {
  const created =
    new Date(dateString);

  const now =
    new Date();

  const difference =
    Math.floor(
      (now.getTime() -
        created.getTime()) /
        1000
    );

  if (
    Number.isNaN(difference)
  ) {
    return "Recently";
  }

  if (difference < 10) {
    return "Just now";
  }

  if (difference < 60) {
    return `${difference}s ago`;
  }

  const minutes =
    Math.floor(
      difference / 60
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return created.toLocaleDateString(
    [],
    {
      day: "2-digit",
      month: "short",
    }
  );
}

export default NotificationCenter;