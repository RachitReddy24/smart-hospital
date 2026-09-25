import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Bell,
  Check,
  Clock3,
  HeartPulse,
  Monitor,
  Moon,
  Save,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import "./StaffSettings.css";

const SETTINGS_KEY =
  "smartcare_staff_settings";

const defaultSettings = {
  staffName: "Hospital Operator",
  staffId: "SC-STAFF-001",
  department: "Hospital Operations",
  role: "Queue Coordinator",
  shift: "Morning Shift",
  shiftStatus: true,
  queueAlerts: true,
  emergencyAlerts: true,
  soundAlerts: true,
  compactMode: false,
};

function readSettings() {
  try {
    const stored =
      localStorage.getItem(
        SETTINGS_KEY
      );

    if (!stored) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...JSON.parse(stored),
    };
  } catch {
    return defaultSettings;
  }
}

function StaffSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] =
    useState(readSettings);

  const [saved, setSaved] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("profile");

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  }, []);

  const updateSetting = (
    key,
    value
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  return (
    <div className="staff-settings-page">
      <div className="staff-settings-grid"></div>

      <div className="staff-settings-glow settings-glow-one"></div>
      <div className="staff-settings-glow settings-glow-two"></div>

      {/* HEADER */}

      <header className="staff-settings-header">
        <div className="staff-settings-brand">
          <div className="staff-settings-brand-icon">
            <HeartPulse size={21} />
          </div>

          <div>
            <strong>SmartCare</strong>
            <small>
              STAFF SETTINGS
            </small>
          </div>
        </div>

        <div className="staff-settings-header-actions">
          <button
            type="button"
            className="staff-settings-back"
            onClick={() =>
              navigate(
                "/staff/dashboard"
              )
            }
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>
      </header>

      <main className="staff-settings-main">
        {/* PAGE HEADING */}

        <section className="staff-settings-heading">
          <div>
            <div className="staff-settings-eyebrow">
              <span></span>
              ACCOUNT & SYSTEM
            </div>

            <h1>
              Staff
              <span>Settings</span>
            </h1>

            <p>
              Manage your SmartCare staff profile,
              queue preferences and workspace settings.
            </p>
          </div>

          <div className="settings-save-area">
            {saved && (
              <div className="settings-saved">
                <Check size={14} />
                Saved
              </div>
            )}

            <button
              type="button"
              className="settings-save-button"
              onClick={
                handleSave
              }
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </section>

        {/* SETTINGS LAYOUT */}

        <section className="staff-settings-layout">
          {/* SIDE NAV */}

          <aside className="settings-menu">
            <button
              type="button"
              className={
                activeSection ===
                "profile"
                  ? "settings-menu-item active"
                  : "settings-menu-item"
              }
              onClick={() =>
                setActiveSection(
                  "profile"
                )
              }
            >
              <UserRound size={17} />
              Profile
            </button>

            <button
              type="button"
              className={
                activeSection ===
                "alerts"
                  ? "settings-menu-item active"
                  : "settings-menu-item"
              }
              onClick={() =>
                setActiveSection(
                  "alerts"
                )
              }
            >
              <Bell size={17} />
              Notifications
            </button>

            <button
              type="button"
              className={
                activeSection ===
                "display"
                  ? "settings-menu-item active"
                  : "settings-menu-item"
              }
              onClick={() =>
                setActiveSection(
                  "display"
                )
              }
            >
              <Monitor size={17} />
              Display
            </button>

            <button
              type="button"
              className={
                activeSection ===
                "system"
                  ? "settings-menu-item active"
                  : "settings-menu-item"
              }
              onClick={() =>
                setActiveSection(
                  "system"
                )
              }
            >
              <ShieldCheck size={17} />
              System
            </button>
          </aside>

          {/* CONTENT */}

          <div className="settings-content">
            {activeSection ===
              "profile" && (
              <ProfileSection
                settings={
                  settings
                }
                updateSetting={
                  updateSetting
                }
              />
            )}

            {activeSection ===
              "alerts" && (
              <NotificationSection
                settings={
                  settings
                }
                updateSetting={
                  updateSetting
                }
              />
            )}

            {activeSection ===
              "display" && (
              <DisplaySection
                settings={
                  settings
                }
                updateSetting={
                  updateSetting
                }
              />
            )}

            {activeSection ===
              "system" && (
              <SystemSection />
            )}
          </div>
        </section>

        <div className="staff-settings-disclaimer">
          <ShieldCheck size={15} />

          <span>
            SmartCare staff settings are part of the
            frontend prototype. Production authentication,
            permissions and audit controls will be handled
            by the backend and hospital identity system.
          </span>
        </div>

        <footer className="staff-settings-footer">
          <div>
            <HeartPulse size={15} />
            SmartCare
          </div>

          <span>
            Hospital operations • Staff portal •
            Configuration
          </span>
        </footer>
      </main>
    </div>
  );
}

/* =========================================================
   PROFILE SECTION
   ========================================================= */

function ProfileSection({
  settings,
  updateSetting,
}) {
  return (
    <div className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>STAFF PROFILE</span>

          <h2>
            Personal Information
          </h2>

          <p>
            Profile information used across the
            SmartCare staff workspace.
          </p>
        </div>

        <div className="settings-panel-icon">
          <UserRound size={19} />
        </div>
      </div>

      <div className="settings-divider"></div>

      <div className="profile-identity">
        <div className="profile-large-avatar">
          <UserRound size={28} />
        </div>

        <div>
          <strong>
            {settings.staffName}
          </strong>

          <span>
            {settings.role}
          </span>

          <small>
            Staff ID: {settings.staffId}
          </small>
        </div>

        <div className="profile-online">
          <span></span>
          Active
        </div>
      </div>

      <div className="settings-form-grid">
        <SettingsField
          label="Staff Name"
          value={
            settings.staffName
          }
          onChange={(value) =>
            updateSetting(
              "staffName",
              value
            )
          }
        />

        <SettingsField
          label="Staff ID"
          value={
            settings.staffId
          }
          disabled
        />

        <SettingsField
          label="Department"
          value={
            settings.department
          }
          onChange={(value) =>
            updateSetting(
              "department",
              value
            )
          }
        />

        <SettingsField
          label="Role"
          value={
            settings.role
          }
          onChange={(value) =>
            updateSetting(
              "role",
              value
            )
          }
        />
      </div>

      <div className="settings-subheading">
        <Clock3 size={16} />
        Shift Management
      </div>

      <div className="shift-card">
        <div className="shift-icon">
          <Clock3 size={18} />
        </div>

        <div>
          <strong>
            Current Shift
          </strong>

          <span>
            {settings.shift}
          </span>
        </div>

        <div className="shift-status">
          <span
            className={
              settings.shiftStatus
                ? "active"
                : ""
            }
          ></span>

          {settings.shiftStatus
            ? "On Duty"
            : "Off Duty"}
        </div>

        <button
          type="button"
          onClick={() =>
            updateSetting(
              "shiftStatus",
              !settings.shiftStatus
            )
          }
        >
          {settings.shiftStatus
            ? "End Shift"
            : "Start Shift"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   NOTIFICATION SECTION
   ========================================================= */

function NotificationSection({
  settings,
  updateSetting,
}) {
  return (
    <div className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>ALERT PREFERENCES</span>

          <h2>
            Notifications
          </h2>

          <p>
            Choose which SmartCare events should
            appear in the notification center.
          </p>
        </div>

        <div className="settings-panel-icon">
          <Bell size={19} />
        </div>
      </div>

      <div className="settings-divider"></div>

      <SettingToggle
        icon={
          <Bell size={17} />
        }
        title="Queue Updates"
        description="Receive alerts when queue activity changes."
        enabled={
          settings.queueAlerts
        }
        onChange={(value) =>
          updateSetting(
            "queueAlerts",
            value
          )
        }
      />

      <SettingToggle
        icon={
          <HeartPulse size={17} />
        }
        title="Emergency Alerts"
        description="Highlight new emergency-priority cases."
        enabled={
          settings.emergencyAlerts
        }
        onChange={(value) =>
          updateSetting(
            "emergencyAlerts",
            value
          )
        }
      />

      <SettingToggle
        icon={
          <Clock3 size={17} />
        }
        title="Sound Alerts"
        description="Enable sound notification preferences for queue events."
        enabled={
          settings.soundAlerts
        }
        onChange={(value) =>
          updateSetting(
            "soundAlerts",
            value
          )
        }
      />

      <div className="settings-alert-preview">
        <div className="preview-icon">
          <Bell size={17} />
        </div>

        <div>
          <small>
            NOTIFICATION PREVIEW
          </small>

          <strong>
            Patient ER-042 has been called
          </strong>

          <span>
            Emergency Department • Now
          </span>
        </div>

        <div className="preview-dot"></div>
      </div>
    </div>
  );
}

/* =========================================================
   DISPLAY SECTION
   ========================================================= */

function DisplaySection({
  settings,
  updateSetting,
}) {
  return (
    <div className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>WORKSPACE DISPLAY</span>

          <h2>
            Display Preferences
          </h2>

          <p>
            Adjust the density and workspace appearance
            used by the staff dashboard.
          </p>
        </div>

        <div className="settings-panel-icon">
          <Monitor size={19} />
        </div>
      </div>

      <div className="settings-divider"></div>

      <div className="display-theme-title">
        <span>
          Theme
        </span>

        <small>
          SmartCare currently uses the dark
          operations interface.
        </small>
      </div>

      <div className="theme-options">
        <div className="theme-option selected">
          <div className="theme-preview dark-preview">
            <Moon size={17} />
          </div>

          <div>
            <strong>
              Dark Operations
            </strong>

            <span>
              Optimized for hospital workstations
            </span>
          </div>

          <Check size={15} />
        </div>

        <div className="theme-option disabled">
          <div className="theme-preview light-preview">
            <Sun size={17} />
          </div>

          <div>
            <strong>
              Light
            </strong>

            <span>
              Available in future UI release
            </span>
          </div>
        </div>
      </div>

      <div className="settings-subheading">
        <Monitor size={16} />
        Queue Density
      </div>

      <SettingToggle
        icon={
          <ActivityIcon />
        }
        title="Compact Dashboard"
        description="Display more queue rows in the available workspace."
        enabled={
          settings.compactMode
        }
        onChange={(value) =>
          updateSetting(
            "compactMode",
            value
          )
        }
      />
    </div>
  );
}

/* =========================================================
   SYSTEM SECTION
   ========================================================= */

function SystemSection() {
  return (
    <div className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>SYSTEM INFORMATION</span>

          <h2>
            SmartCare System
          </h2>

          <p>
            Current frontend prototype configuration
            and environment information.
          </p>
        </div>

        <div className="settings-panel-icon">
          <ShieldCheck size={19} />
        </div>
      </div>

      <div className="settings-divider"></div>

      <div className="system-status-card">
        <div className="system-status-icon">
          <Check size={20} />
        </div>

        <div>
          <strong>
            System Operational
          </strong>

          <span>
            SmartCare frontend services are running.
          </span>
        </div>

        <div className="system-live">
          <span></span>
          LIVE
        </div>
      </div>

      <div className="system-grid">
        <SystemItem
          label="Application"
          value="SmartCare"
        />

        <SystemItem
          label="Environment"
          value="Frontend Prototype"
        />

        <SystemItem
          label="Queue Storage"
          value="Local Storage"
        />

        <SystemItem
          label="Interface"
          value="Staff Operations"
        />

        <SystemItem
          label="Queue Refresh"
          value="3 Seconds"
        />

        <SystemItem
          label="Version"
          value="PBL v1.0"
        />
      </div>

      <div className="security-card">
        <ShieldCheck size={19} />

        <div>
          <strong>
            Prototype Security Notice
          </strong>

          <span>
            Authentication, authorization, audit logs,
            encryption and production-grade access
            controls are not implemented yet.
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
   ========================================================= */

function SettingsField({
  label,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <label className="settings-field">
      <span>
        {label}
      </span>

      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange?.(
            event.target.value
          )
        }
      />
    </label>
  );
}

/* =========================================================
   TOGGLE
   ========================================================= */

function SettingToggle({
  icon,
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="setting-toggle-row">
      <div className="setting-toggle-icon">
        {icon}
      </div>

      <div className="setting-toggle-content">
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>

      <button
        type="button"
        className={
          enabled
            ? "settings-switch enabled"
            : "settings-switch"
        }
        onClick={() =>
          onChange(!enabled)
        }
        aria-pressed={enabled}
      >
        <span></span>
      </button>
    </div>
  );
}

/* =========================================================
   SYSTEM ITEM
   ========================================================= */

function SystemItem({
  label,
  value,
}) {
  return (
    <div className="system-item">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   ACTIVITY ICON
   ========================================================= */

function ActivityIcon() {
  return (
    <span className="fake-activity-icon">
      <span></span>
      <span></span>
      <span></span>
    </span>
  );
}

export default StaffSettings;