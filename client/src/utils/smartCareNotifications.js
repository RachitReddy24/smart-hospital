const NOTIFICATION_KEY =
  "smartcare_notifications";

const NOTIFICATION_EVENT =
  "smartcare:notification";

const QUEUE_KEY =
  "smartcare_queue";

const QUEUE_SNAPSHOT_KEY =
  "smartcare_notification_queue_snapshot";

/* =========================================================
   SAFE JSON HELPERS
   ========================================================= */

function readJSON(
  key,
  fallback
) {
  try {
    const stored =
      localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    const parsed =
      JSON.parse(stored);

    return parsed;
  } catch {
    return fallback;
  }
}

function writeJSON(
  key,
  value
) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch {
    return false;
  }
}

/* =========================================================
   EVENT
   ========================================================= */

function emitNotificationEvent() {
  window.dispatchEvent(
    new CustomEvent(
      NOTIFICATION_EVENT
    )
  );
}

/* =========================================================
   READ NOTIFICATIONS
   ========================================================= */

function readNotifications() {
  const notifications =
    readJSON(
      NOTIFICATION_KEY,
      []
    );

  return Array.isArray(
    notifications
  )
    ? notifications
    : [];
}

/* =========================================================
   WRITE NOTIFICATIONS
   ========================================================= */

function writeNotifications(
  notifications
) {
  writeJSON(
    NOTIFICATION_KEY,
    notifications
  );
}

/* =========================================================
   GET NOTIFICATIONS
   ========================================================= */

export function getNotifications() {
  return readNotifications();
}

/* =========================================================
   ADD NOTIFICATION
   ========================================================= */

export function addNotification({
  title,
  message,
  type = "info",
  category = "system",
}) {
  const notification = {
    id:
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"
        ? crypto.randomUUID()
        : `notification-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,

    title:
      title ||
      "SmartCare Update",

    message:
      message || "",

    type,

    category,

    read: false,

    createdAt:
      new Date().toISOString(),
  };

  const current =
    readNotifications();

  /*
   * Keep the latest 50 notifications.
   */

  const updated = [
    notification,
    ...current,
  ].slice(0, 50);

  writeNotifications(
    updated
  );

  emitNotificationEvent();

  return notification;
}

/* =========================================================
   MARK ONE AS READ
   ========================================================= */

export function markNotificationRead(
  id
) {
  const notifications =
    readNotifications();

  const updated =
    notifications.map(
      (notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
    );

  writeNotifications(
    updated
  );

  emitNotificationEvent();

  return updated;
}

/* =========================================================
   MARK ALL AS READ
   ========================================================= */

export function markAllNotificationsRead() {
  const notifications =
    readNotifications();

  const updated =
    notifications.map(
      (notification) => ({
        ...notification,
        read: true,
      })
    );

  writeNotifications(
    updated
  );

  emitNotificationEvent();

  return updated;
}

/* =========================================================
   REMOVE ONE NOTIFICATION
   ========================================================= */

export function removeNotification(
  id
) {
  const notifications =
    readNotifications();

  const updated =
    notifications.filter(
      (notification) =>
        notification.id !== id
    );

  writeNotifications(
    updated
  );

  emitNotificationEvent();

  return updated;
}

/* =========================================================
   CLEAR ALL NOTIFICATIONS
   ========================================================= */

export function clearNotifications() {
  try {
    localStorage.removeItem(
      NOTIFICATION_KEY
    );
  } catch {
    // Ignore localStorage errors.
  }

  emitNotificationEvent();
}

/* =========================================================
   SUBSCRIBE TO NOTIFICATIONS
   ========================================================= */

export function subscribeToNotifications(
  callback
) {
  const handler = () => {
    if (
      typeof callback ===
      "function"
    ) {
      callback(
        getNotifications()
      );
    }
  };

  window.addEventListener(
    NOTIFICATION_EVENT,
    handler
  );

  window.addEventListener(
    "storage",
    handler
  );

  return () => {
    window.removeEventListener(
      NOTIFICATION_EVENT,
      handler
    );

    window.removeEventListener(
      "storage",
      handler
    );
  };
}

/* =========================================================
   READ CURRENT QUEUE
   ========================================================= */

function readQueue() {
  const queue =
    readJSON(
      QUEUE_KEY,
      []
    );

  return Array.isArray(queue)
    ? queue
    : [];
}

/* =========================================================
   READ PREVIOUS QUEUE SNAPSHOT
   ========================================================= */

function readQueueNotificationSnapshot() {
  const snapshot =
    readJSON(
      QUEUE_SNAPSHOT_KEY,
      null
    );

  return Array.isArray(
    snapshot
  )
    ? snapshot
    : null;
}

/* =========================================================
   SAVE QUEUE SNAPSHOT
   ========================================================= */

function saveQueueNotificationSnapshot(
  queue
) {
  writeJSON(
    QUEUE_SNAPSHOT_KEY,
    queue
  );
}

/* =========================================================
   NOTIFICATION: NEW PATIENT
   ========================================================= */

function notifyNewPatient(
  patient
) {
  const priority =
    patient.priority ||
    "Routine";

  const token =
    patient.token ||
    "New Token";

  const name =
    patient.name ||
    "Patient";

  if (
    priority ===
    "Emergency"
  ) {
    return addNotification({
      title:
        `Emergency Queue — ${token}`,

      message:
        `${name} has entered the emergency queue and requires priority attention.`,

      type: "emergency",

      category: "queue",
    });
  }

  if (
    priority ===
    "Urgent"
  ) {
    return addNotification({
      title:
        `Urgent Queue — ${token}`,

      message:
        `${name} has entered the urgent patient queue.`,

      type: "warning",

      category: "queue",
    });
  }

  return addNotification({
    title:
      `New Queue Patient — ${token}`,

    message:
      `${name} has entered the SmartCare queue.`,

    type: "queue",

    category: "queue",
  });
}

/* =========================================================
   NOTIFICATION: PATIENT CALLED
   ========================================================= */

function notifyPatientCalled(
  patient
) {
  const name =
    patient.name ||
    "Patient";

  const token =
    patient.token ||
    "Token";

  const department =
    patient.department ||
    "their department";

  const isEmergency =
    patient.priority ===
    "Emergency";

  return addNotification({
    title:
      `Patient Called — ${token}`,

    message:
      `${name} has been called for ${department}.`,

    type:
      isEmergency
        ? "emergency"
        : "queue",

    category: "staff",
  });
}

/* =========================================================
   NOTIFICATION: PATIENT COMPLETED
   ========================================================= */

function notifyPatientCompleted(
  patient
) {
  const name =
    patient.name ||
    "Patient";

  const token =
    patient.token ||
    "Token";

  return addNotification({
    title:
      `Queue Completed — ${token}`,

    message:
      `${name} has been marked completed in the SmartCare queue.`,

    type: "success",

    category: "staff",
  });
}

/* =========================================================
   NOTIFICATION: EMERGENCY STATUS
   ========================================================= */

function notifyEmergencyStatus(
  patient
) {
  const token =
    patient.token ||
    "Token";

  const name =
    patient.name ||
    "Patient";

  return addNotification({
    title:
      `Emergency Attention — ${token}`,

    message:
      `${name} is an active emergency case in the SmartCare queue.`,

    type: "emergency",

    category: "emergency",
  });
}

/* =========================================================
   CHECK QUEUE NOTIFICATIONS
   ========================================================= */

export function checkQueueNotifications() {
  const queue =
    readQueue();

  const previousQueue =
    readQueueNotificationSnapshot();

  /*
   * First run:
   *
   * Save the current queue as the baseline.
   * Do NOT notify for patients who already existed.
   */

  if (
    previousQueue === null
  ) {
    saveQueueNotificationSnapshot(
      queue
    );

    return [];
  }

  const generated = [];

  /* =======================================================
     CHECK EVERY CURRENT PATIENT
     ======================================================= */

  queue.forEach(
    (patient) => {
      const previous =
        previousQueue.find(
          (item) =>
            item.id ===
            patient.id
        );

      /* ---------------------------------------------------
         NEW PATIENT
         --------------------------------------------------- */

      if (!previous) {
        const notification =
          notifyNewPatient(
            patient
          );

        if (notification) {
          generated.push(
            notification
          );
        }

        return;
      }

      /* ---------------------------------------------------
         WAITING → CALLED
         --------------------------------------------------- */

      if (
        previous.status !==
          "Called" &&
        patient.status ===
          "Called"
      ) {
        const notification =
          notifyPatientCalled(
            patient
          );

        if (notification) {
          generated.push(
            notification
          );
        }
      }

      /* ---------------------------------------------------
         ACTIVE → COMPLETED
         --------------------------------------------------- */

      if (
        previous.status !==
          "Completed" &&
        patient.status ===
          "Completed"
      ) {
        const notification =
          notifyPatientCompleted(
            patient
          );

        if (notification) {
          generated.push(
            notification
          );
        }
      }

      /* ---------------------------------------------------
         NEW EMERGENCY FLAG
         --------------------------------------------------- */

      if (
        previous.priority !==
          "Emergency" &&
        patient.priority ===
          "Emergency"
      ) {
        const notification =
          notifyEmergencyStatus(
            patient
          );

        if (notification) {
          generated.push(
            notification
          );
        }
      }
    }
  );

  /*
   * Save the latest queue snapshot.
   */

  saveQueueNotificationSnapshot(
    queue
  );

  return generated;
}

/* =========================================================
   START QUEUE NOTIFICATION LISTENER
   ========================================================= */

export function subscribeToQueueNotifications(
  callback
) {
  const check =
    () => {
      const generated =
        checkQueueNotifications();

      if (
        generated.length >
          0 &&
        typeof callback ===
          "function"
      ) {
        callback(
          generated
        );
      }
    };

  /*
   * Same-tab queue updates.
   */

  window.addEventListener(
    "smartcare:queue-updated",
    check
  );

  /*
   * Cross-tab queue updates.
   */

  const handleStorage =
    (event) => {
      if (
        event.key ===
          QUEUE_KEY ||
        event.key ===
          null
      ) {
        check();
      }
    };

  window.addEventListener(
    "storage",
    handleStorage
  );

  /*
   * Return cleanup function.
   */

  return () => {
    window.removeEventListener(
      "smartcare:queue-updated",
      check
    );

    window.removeEventListener(
      "storage",
      handleStorage
    );
  };
}

/* =========================================================
   CLEAR QUEUE NOTIFICATION SNAPSHOT
   ========================================================= */

export function clearQueueNotificationSnapshot() {
  try {
    localStorage.removeItem(
      QUEUE_SNAPSHOT_KEY
    );
  } catch {
    // Ignore errors.
  }
}