import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  Check,
  CheckCheck,
  Info,
  Siren,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
  subscribeToNotifications,
  subscribeToQueueNotifications,
  checkQueueNotifications,
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

  /* =========================================================
     LOAD + SUBSCRIBE
     ========================================================= */

  useEffect(() => {
    /*
     * Establish queue notification baseline.
     */
    checkQueueNotifications();

    setNotifications(
      getNotifications()
    );

    const cleanupNotifications =
      subscribeToNotifications(
        (updated) => {
          setNotifications(
            updated
          );
        }
      );

    const cleanupQueue =
      subscribeToQueueNotifications(
        () => {
          setNotifications(
            getNotifications()
          );
        }
      );

    /*
     * Periodic fallback check.
     * Useful for queue changes occurring
     * from another part of the frontend.
     */

    const interval =
      setInterval(() => {
        checkQueueNotifications();

        setNotifications(
          getNotifications()
        );
      }, 3000);

    return () => {
      cleanupNotifications();
      cleanupQueue();
      clearInterval(interval);
    };
  }, []);

  /* =========================================================
     UNREAD COUNT
     ========================================================= */

  const unreadCount =
    useMemo(() => {
      return notifications.filter(
        (notification) =>
          !notification.read
      ).length;
    }, [notifications]);

  /* =========================================================
     MARK ONE
     ========================================================= */

  const handleNotificationClick =
    (id) => {
      markNotificationRead(id);

      setNotifications(
        getNotifications()
      );
    };

  /* =========================================================
     MARK ALL
     ========================================================= */

  const handleMarkAllRead =
    () => {
      markAllNotificationsRead();

      setNotifications(
        getNotifications()
      );
    };

  /* =========================================================
     REMOVE
     ========================================================= */

  const handleRemove = (id) => {
    removeNotification(id);

    setNotifications(
      getNotifications()
    );
  };

  /* =========================================================
     CLEAR
     ========================================================= */

  const handleClear = () => {
    clearNotifications();

    setNotifications([]);
  };

  /* =========================================================
     ICON
     ========================================================= */

  const getNotificationIcon =
    (type) => {
      switch (type) {
        case "emergency":
          return (
            <Siren size={17} />
          );

        case "warning":
          return (
            <TriangleAlert
              size={17}
            />
          );

        case "success":
          return (
            <Check size={17} />
          );

        default:
          return (
            <Info size={17} />
          );
      }
    };

  /* =========================================================
     TIME
     ========================================================= */

  const formatTime = (
    createdAt
  ) => {
    if (!createdAt) {
      return "";
    }

    const date =
      new Date(createdAt);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="notification-center">

      {/* =====================================================
          BELL BUTTON
         ===================================================== */}

      <button
        type="button"
        className="notification-bell-button"
        onClick={() =>
          setIsOpen(
            (current) => !current
          )
        }
        aria-label="Open SmartCare notifications"
        aria-expanded={isOpen}
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span className="notification-unread-badge">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* =====================================================
          PANEL
         ===================================================== */}

      {isOpen && (
        <>
          <div
            className="notification-overlay"
            onClick={() =>
              setIsOpen(false)
            }
          />

          <aside className="notification-panel">

            {/* HEADER */}

            <div className="notification-panel-header">

              <div>
                <small>
                  SMARTCARE SYSTEM
                </small>

                <h2>
                  Notifications
                </h2>
              </div>

              <button
                type="button"
                className="notification-close-button"
                onClick={() =>
                  setIsOpen(false)
                }
                aria-label="Close notifications"
              >
                <X size={17} />
              </button>

            </div>

            {/* ACTION BAR */}

            <div className="notification-actions">

              <span>
                {notifications.length}{" "}
                {notifications.length ===
                1
                  ? "notification"
                  : "notifications"}
              </span>

              <div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={
                      handleMarkAllRead
                    }
                  >
                    <CheckCheck
                      size={14}
                    />
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

            {/* =================================================
                LIST
               ================================================= */}

            <div className="notification-list">

              {notifications.length ===
                0 && (
                <div className="notification-empty">

                  <div className="notification-empty-icon">
                    <Bell size={24} />
                  </div>

                  <strong>
                    No notifications
                  </strong>

                  <span>
                    Queue and hospital
                    updates will appear here.
                  </span>

                </div>
              )}

              {notifications.map(
                (notification) => (
                  <article
                    key={
                      notification.id
                    }
                    className={`notification-item ${
                      notification.read
                        ? "read"
                        : "unread"
                    } ${
                      notification.type ||
                      "info"
                    }`}
                  >

                    {/* CONTENT */}

                    <button
                      type="button"
                      className="notification-item-content"
                      onClick={() =>
                        handleNotificationClick(
                          notification.id
                        )
                      }
                    >

                      <div className="notification-type-icon">
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>

                      <div className="notification-text">

                        <strong>
                          {
                            notification.title
                          }
                        </strong>

                        <p>
                          {
                            notification.message
                          }
                        </p>

                        <small>
                          {
                            formatTime(
                              notification.createdAt
                            )
                          }
                        </small>

                      </div>

                      {!notification.read && (
                        <span className="notification-new-dot"></span>
                      )}

                    </button>

                    {/* REMOVE */}

                    <button
                      type="button"
                      className="notification-remove-button"
                      onClick={() =>
                        handleRemove(
                          notification.id
                        )
                      }
                      aria-label="Remove notification"
                    >
                      <X size={14} />
                    </button>

                  </article>
                )
              )}

            </div>

          </aside>
        </>
      )}
    </div>
  );
}

export default NotificationCenter;