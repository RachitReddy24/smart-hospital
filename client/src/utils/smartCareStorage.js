/* =========================================================
   SMARTCARE STORAGE
   Frontend-only shared application storage
   ========================================================= */

/* =========================================================
   STORAGE KEYS
   ========================================================= */

const PATIENT_KEY =
  "smartcare_patient";

const TRIAGE_KEY =
  "smartcare_triage";

const QUEUE_KEY =
  "smartcare_queue";

const TOKEN_COUNTER_KEY =
  "smartcare_token_counters";

/* =========================================================
   EVENTS
   ========================================================= */

const QUEUE_UPDATE_EVENT =
  "smartcare:queue-updated";

/* =========================================================
   SAFE JSON READ
   ========================================================= */

function readJSON(
  key,
  fallback
) {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed =
      JSON.parse(value);

    return parsed;
  } catch {
    return fallback;
  }
}

/* =========================================================
   SAFE JSON WRITE
   ========================================================= */

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
   QUEUE EVENT
   ========================================================= */

function emitQueueUpdate(
  queue
) {
  try {
    window.dispatchEvent(
      new CustomEvent(
        QUEUE_UPDATE_EVENT,
        {
          detail: {
            queue,
          },
        }
      )
    );
  } catch {
    // Ignore event errors.
  }
}

/* =========================================================
   PATIENT
   ========================================================= */

export function savePatient(
  patient
) {
  writeJSON(
    PATIENT_KEY,
    patient
  );

  return patient;
}

export function getPatient() {
  return readJSON(
    PATIENT_KEY,
    null
  );
}

export function updatePatient(
  updates
) {
  const patient =
    getPatient();

  if (!patient) {
    return null;
  }

  const updatedPatient = {
    ...patient,
    ...updates,
  };

  savePatient(
    updatedPatient
  );

  return updatedPatient;
}

/* =========================================================
   TRIAGE
   ========================================================= */

export function saveTriage(
  triage
) {
  writeJSON(
    TRIAGE_KEY,
    triage
  );

  return triage;
}

export function getTriage() {
  return readJSON(
    TRIAGE_KEY,
    null
  );
}

/* =========================================================
   QUEUE
   ========================================================= */

export function getQueue() {
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
   SAVE QUEUE
   ========================================================= */

export function saveQueue(
  queue
) {
  const safeQueue =
    Array.isArray(queue)
      ? queue
      : [];

  writeJSON(
    QUEUE_KEY,
    safeQueue
  );

  /*
   * Important:
   * Notify components in the SAME browser tab.
   *
   * The native "storage" event does not fire
   * in the same tab that changed localStorage.
   */

  emitQueueUpdate(
    safeQueue
  );

  return safeQueue;
}

/* =========================================================
   ADD QUEUE ENTRY
   ========================================================= */

export function addQueueEntry(
  entry
) {
  const queue =
    getQueue();

  const existingIndex =
    queue.findIndex(
      (item) =>
        item.id === entry.id
    );

  let updatedQueue;

  /* -------------------------------------------------------
     UPDATE EXISTING ENTRY
     ------------------------------------------------------- */

  if (
    existingIndex >= 0
  ) {
    updatedQueue =
      queue.map(
        (item) =>
          item.id === entry.id
            ? {
                ...item,
                ...entry,
              }
            : item
      );
  }

  /* -------------------------------------------------------
     ADD NEW ENTRY
     ------------------------------------------------------- */

  else {
    updatedQueue = [
      ...queue,
      entry,
    ];
  }

  saveQueue(
    updatedQueue
  );

  return updatedQueue;
}

/* =========================================================
   UPDATE QUEUE ENTRY
   ========================================================= */

export function updateQueueEntry(
  id,
  updates
) {
  const queue =
    getQueue();

  const existingIndex =
    queue.findIndex(
      (item) =>
        item.id === id
    );

  let updatedQueue;

  /* -------------------------------------------------------
     EXISTING QUEUE ENTRY
     ------------------------------------------------------- */

  if (
    existingIndex >= 0
  ) {
    updatedQueue =
      queue.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
              }
            : item
      );
  }

  /* -------------------------------------------------------
     ENTRY NOT FOUND
     
     This is useful for demo patients used by
     StaffDashboard.
     ------------------------------------------------------- */

  else {
    updatedQueue = [
      ...queue,
      {
        id,
        ...updates,
      },
    ];
  }

  /* -------------------------------------------------------
     SAVE + NOTIFY
     ------------------------------------------------------- */

  saveQueue(
    updatedQueue
  );

  /* -------------------------------------------------------
     SYNCHRONIZE CURRENT PATIENT
     ------------------------------------------------------- */

  const updatedEntry =
    updatedQueue.find(
      (item) =>
        item.id === id
    );

  const currentPatient =
    getPatient();

  if (
    currentPatient &&
    currentPatient.id === id &&
    updatedEntry
  ) {
    updatePatient({
      status:
        updatedEntry.status ??
        currentPatient.status,

      token:
        updatedEntry.token ??
        currentPatient.token,

      priority:
        updatedEntry.priority ??
        currentPatient.priority,

      queuePosition:
        updatedEntry.queuePosition ??
        currentPatient.queuePosition,

      wait:
        updatedEntry.wait ??
        currentPatient.wait,
    });
  }

  return updatedQueue;
}

/* =========================================================
   GET ONE QUEUE ENTRY
   ========================================================= */

export function getQueueEntry(
  id
) {
  const queue =
    getQueue();

  return (
    queue.find(
      (item) =>
        item.id === id
    ) || null
  );
}

/* =========================================================
   TOKEN GENERATION
   ========================================================= */

export function generateToken(
  priority
) {
  const counters =
    readJSON(
      TOKEN_COUNTER_KEY,
      {
        emergency: 42,
        urgent: 84,
        routine: 127,
      }
    );

  let token;

  /* -------------------------------------------------------
     EMERGENCY
     ------------------------------------------------------- */

  if (
    priority ===
    "Emergency"
  ) {
    counters.emergency =
      Number(
        counters.emergency
      ) || 42;

    counters.emergency +=
      1;

    token = `ER-${String(
      counters.emergency
    ).padStart(3, "0")}`;
  }

  /* -------------------------------------------------------
     URGENT
     ------------------------------------------------------- */

  else if (
    priority ===
    "Urgent"
  ) {
    counters.urgent =
      Number(
        counters.urgent
      ) || 84;

    counters.urgent +=
      1;

    token = `U-${String(
      counters.urgent
    ).padStart(3, "0")}`;
  }

  /* -------------------------------------------------------
     ROUTINE
     ------------------------------------------------------- */

  else {
    counters.routine =
      Number(
        counters.routine
      ) || 127;

    counters.routine +=
      1;

    token = `A-${String(
      counters.routine
    ).padStart(3, "0")}`;
  }

  writeJSON(
    TOKEN_COUNTER_KEY,
    counters
  );

  return token;
}

/* =========================================================
   QUEUE EVENT SUBSCRIPTION
   ========================================================= */

export function subscribeToQueueUpdates(
  callback
) {
  const handler =
    (event) => {
      if (
        typeof callback ===
        "function"
      ) {
        callback(
          event.detail?.queue ||
            getQueue()
        );
      }
    };

  window.addEventListener(
    QUEUE_UPDATE_EVENT,
    handler
  );

  /*
   * Also listen for changes from
   * another browser tab.
   */

  const storageHandler =
    (event) => {
      if (
        event.key ===
          QUEUE_KEY ||
        event.key === null
      ) {
        if (
          typeof callback ===
          "function"
        ) {
          callback(
            getQueue()
          );
        }
      }
    };

  window.addEventListener(
    "storage",
    storageHandler
  );

  return () => {
    window.removeEventListener(
      QUEUE_UPDATE_EVENT,
      handler
    );

    window.removeEventListener(
      "storage",
      storageHandler
    );
  };
}

/* =========================================================
   CLEAR SMARTCARE DATA
   ========================================================= */

export function clearSmartCareData() {
  try {
    localStorage.removeItem(
      PATIENT_KEY
    );

    localStorage.removeItem(
      TRIAGE_KEY
    );

    localStorage.removeItem(
      QUEUE_KEY
    );
  } catch {
    // Ignore localStorage errors.
  }

  emitQueueUpdate(
    []
  );
}

/* =========================================================
   CLEAR EVERYTHING INCLUDING TOKEN COUNTERS
   Useful for PBL demo reset.
   ========================================================= */

export function resetSmartCareDemo() {
  try {
    localStorage.removeItem(
      PATIENT_KEY
    );

    localStorage.removeItem(
      TRIAGE_KEY
    );

    localStorage.removeItem(
      QUEUE_KEY
    );

    localStorage.removeItem(
      TOKEN_COUNTER_KEY
    );
  } catch {
    // Ignore localStorage errors.
  }

  emitQueueUpdate(
    []
  );
}