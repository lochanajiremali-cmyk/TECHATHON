import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BarChart3,
  UserCircle2,
  Shield,
  Lock,
  KeyRound,
  ChevronRight,
  Clock,
  Volume2,
  VolumeX,
  Volume1,
  Vibrate,
  MapPin,
  Languages,
  Phone,
  Mail,
  LogOut,
  Trash2,
  Smartphone,
  Database
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import './Settings.css';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0
  })
};

function Screen({ direction, children }) {
  return (
    <motion.div
      className="settings-screen"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function TopBar({ title, onBack, rightSlot }) {
  return (
    <div className="settings-topbar">
      <button className="settings-topbar-btn" onClick={onBack} aria-label="Back">
        <ArrowLeft size={22} />
      </button>
      <div className="settings-topbar-title">{title}</div>
      <div className="settings-topbar-right">{rightSlot || null}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="settings-section-title">{children}</div>;
}

function ListItem({ icon, label, description, right, onClick, tone = 'default' }) {
  const clickable = typeof onClick === 'function';
  return (
    <button
      type="button"
      className={`settings-item ${clickable ? 'clickable' : ''} tone-${tone}`}
      onClick={onClick}
      disabled={!clickable}
    >
      <div className="settings-item-left">
        <div className="settings-item-icon">{icon}</div>
        <div className="settings-item-text">
          <div className="settings-item-label">{label}</div>
          {description ? <div className="settings-item-desc">{description}</div> : null}
        </div>
      </div>
      <div className="settings-item-right">
        {right || <ChevronRight size={18} className="settings-item-chevron" />}
      </div>
    </button>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <div className="settings-row-label">{label}</div>
        {description ? <div className="settings-row-desc">{description}</div> : null}
      </div>
      <button
        type="button"
        className={`settings-switch ${checked ? 'on' : 'off'}`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span className="settings-switch-thumb" />
      </button>
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="settings-segment">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`settings-segment-btn ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Slider({ value, onChange, min = 0, max = 100, leftLabel, rightLabel, icon }) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="settings-slider">
      <div className="settings-slider-head">
        <div className="settings-slider-title">
          <span className="settings-slider-icon">{icon}</span>
          <span>Sound level</span>
        </div>
        <div className="settings-slider-value">{value}</div>
      </div>
      <div className="settings-slider-track">
        <div className="settings-slider-fill" style={{ width: `${percent}%` }} />
        <input
          className="settings-slider-input"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <div className="settings-slider-labels">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

function Pill({ children, tone = 'green' }) {
  return <span className={`settings-pill tone-${tone}`}>{children}</span>;
}

export default function Settings({ onBack }) {
  const [stack, setStack] = useState(['home']);
  const [direction, setDirection] = useState(1);

  const current = stack[stack.length - 1];

  const push = (screen) => {
    setDirection(1);
    setStack((prev) => [...prev, screen]);
  };

  const pop = () => {
    if (stack.length <= 1) {
      onBack?.();
      return;
    }
    setDirection(-1);
    setStack((prev) => prev.slice(0, -1));
  };

  const [notif, setNotif] = useState({
    weather: true,
    market: true,
    crop: false,
    sound: 64,
    frequency: 'instant',
    vibration: true
  });

  const [daily, setDaily] = useState({
    enabled: true,
    timeSlot: 'morning'
  });

  const [profile, setProfile] = useState({
    name: 'Ravi Patil',
    location: 'Pune, Maharashtra',
    language: 'English'
  });

  const [profileSaved, setProfileSaved] = useState(false);

  const [permissions, setPermissions] = useState({
    location: true,
    notifications: true,
    storage: false
  });

  const [security, setSecurity] = useState({
    appLock: true,
    lockMode: 'biometric'
  });

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const masked = useMemo(() => {
    return {
      phone: '+91 •••• •• 4821',
      email: 'ra***@gm***.com'
    };
  }, []);

  const soundMeta = useMemo(() => {
    const v = notif.sound;
    if (v <= 33) {
      return {
        label: 'Silent field-friendly',
        level: 'Low',
        Icon: VolumeX
      };
    }
    if (v <= 70) {
      return {
        label: 'Balanced alerts',
        level: 'Medium',
        Icon: Volume1
      };
    }
    return {
      label: 'Critical alerts only',
      level: 'High',
      Icon: Volume2
    };
  }, [notif.sound]);

  const dailyMeta = useMemo(() => {
    const map = {
      morning: { label: 'Morning', next: '6:00 AM' },
      afternoon: { label: 'Afternoon', next: '1:00 PM' },
      evening: { label: 'Evening', next: '7:00 PM' }
    };
    return map[daily.timeSlot] || map.morning;
  }, [daily.timeSlot]);

  const anyAlertsOn = notif.weather || notif.market || notif.crop;

  return (
    <div className="settings-root">
      <AnimatePresence mode="wait">
        {current === 'home' && (
          <Screen key="home" direction={direction}>
            <div className="settings-home">
              <TopBar title="Settings" onBack={onBack} />

              <div className="settings-content">
                <SectionTitle>Preferences</SectionTitle>
                <div className="settings-card">
                  <ListItem
                    icon={<Bell size={20} />}
                    label="Notifications"
                    description="Weather, market prices, crop updates"
                    onClick={() => push('notifications')}
                  />
                  <ListItem
                    icon={<BarChart3 size={20} />}
                    label="Daily Alerts & Analysis"
                    description="Your daily summary and insights"
                    onClick={() => push('daily')}
                  />
                </div>

                <SectionTitle>Account</SectionTitle>
                <div className="settings-card">
                  <ListItem
                    icon={<UserCircle2 size={20} />}
                    label="Profile"
                    description="Name, location, language"
                    onClick={() => push('profile')}
                  />
                  <ListItem
                    icon={<Shield size={20} />}
                    label="Permissions"
                    description="Control what the app can access"
                    onClick={() => push('permissions')}
                  />
                  <ListItem
                    icon={<Lock size={20} />}
                    label="Privacy & Security"
                    description="Password, app lock, data usage"
                    onClick={() => push('privacy')}
                  />
                  <ListItem
                    icon={<Smartphone size={20} />}
                    label="Account Details"
                    description="Status, contact info, logout"
                    onClick={() => push('account')}
                  />
                </div>

                <div className="settings-footnote">
                  Calm, night-friendly controls built for quick decisions.
                </div>
              </div>
            </div>
          </Screen>
        )}

        {current === 'notifications' && (
          <Screen key="notifications" direction={direction}>
            <TopBar title="Notifications" onBack={pop} />
            <div className="settings-content">
              <div className="settings-panel">
                <Toggle
                  checked={notif.weather}
                  onChange={(v) => setNotif((p) => ({ ...p, weather: v }))}
                  label="Weather alerts"
                  description="Rain, storms, heatwaves and irrigation reminders"
                />
                <AnimatePresence>
                  <motion.div
                    key={`weather-${notif.weather ? 'on' : 'off'}`}
                    className={`settings-preview ${notif.weather ? 'on' : 'off'}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {notif.weather ? (
                      <>
                        <div className="settings-preview-title">Next alert</div>
                        <div className="settings-preview-text">Weather update expected tomorrow</div>
                      </>
                    ) : (
                      <>
                        <div className="settings-preview-title">Alerts paused</div>
                        <div className="settings-preview-text">Turn on weather alerts to get timely warnings.</div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <Toggle
                  checked={notif.market}
                  onChange={(v) => setNotif((p) => ({ ...p, market: v }))}
                  label="Market price alerts"
                  description="Price spikes, best selling windows"
                />
                <AnimatePresence>
                  <motion.div
                    key={`market-${notif.market ? 'on' : 'off'}`}
                    className={`settings-preview ${notif.market ? 'on' : 'off'}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {notif.market ? (
                      <>
                        <div className="settings-preview-title">Next alert</div>
                        <div className="settings-preview-text">Price check scheduled for tomorrow morning</div>
                      </>
                    ) : (
                      <>
                        <div className="settings-preview-title">Alerts paused</div>
                        <div className="settings-preview-text">Turn on market alerts to track selling windows.</div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <Toggle
                  checked={notif.crop}
                  onChange={(v) => setNotif((p) => ({ ...p, crop: v }))}
                  label="Daily crop updates"
                  description="Crop health & advisory updates"
                />

                <AnimatePresence>
                  <motion.div
                    key={`crop-${notif.crop ? 'on' : 'off'}`}
                    className={`settings-preview ${notif.crop ? 'on' : 'off'}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {notif.crop ? (
                      <>
                        <div className="settings-preview-title">Next alert</div>
                        <div className="settings-preview-text">Daily update will arrive this evening</div>
                      </>
                    ) : (
                      <>
                        <div className="settings-preview-title">Alerts paused</div>
                        <div className="settings-preview-text">Turn on daily updates for quick crop guidance.</div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="settings-divider" />

                <Slider
                  value={notif.sound}
                  onChange={(v) => setNotif((p) => ({ ...p, sound: v }))}
                  min={0}
                  max={100}
                  leftLabel="Low"
                  rightLabel="High"
                  icon={<soundMeta.Icon size={18} />}
                />

                <div className="settings-sound-meta">
                  <div className="settings-sound-left">
                    <div className="settings-sound-level">{soundMeta.level}</div>
                    <div className="settings-sound-label">{soundMeta.label}</div>
                  </div>
                  <div className="settings-sound-right">
                    <span className="settings-sound-emoji" aria-hidden>
                      {soundMeta.level === 'Low' ? '🔈' : soundMeta.level === 'Medium' ? '🔉' : '🔊'}
                    </span>
                    <div className="settings-sound-hint">
                      {anyAlertsOn ? 'Applies to your enabled alerts' : 'Turn on an alert to test sound'}
                    </div>
                  </div>
                </div>

                <div className="settings-row-inline">
                  <div className="settings-inline-left">
                    <div className="settings-row-label">Vibration</div>
                    <div className="settings-row-desc">A gentle tap for important alerts</div>
                  </div>
                  <div className="settings-inline-right">
                    <Vibrate size={18} className="settings-inline-icon" />
                    <button
                      type="button"
                      className={`settings-switch ${notif.vibration ? 'on' : 'off'}`}
                      onClick={() => setNotif((p) => ({ ...p, vibration: !p.vibration }))}
                      aria-pressed={notif.vibration}
                    >
                      <span className="settings-switch-thumb" />
                    </button>
                  </div>
                </div>

                <div className="settings-divider" />

                <div className="settings-block">
                  <div className="settings-row-label">Alert frequency</div>
                  <div className="settings-row-desc">Choose how often the app should notify you</div>
                  <div className="settings-block-pad" />
                  <Segmented
                    value={notif.frequency}
                    onChange={(v) => setNotif((p) => ({ ...p, frequency: v }))}
                    options={[
                      { value: 'instant', label: 'Instant' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </Screen>
        )}

        {current === 'daily' && (
          <Screen key="daily" direction={direction}>
            <TopBar title="Daily Alerts & Analysis" onBack={pop} />
            <div className="settings-content">
              <div className="settings-panel">
                <Toggle
                  checked={daily.enabled}
                  onChange={(v) => setDaily((p) => ({ ...p, enabled: v }))}
                  label="Enable daily summary"
                  description="One calm summary with key actions for the day"
                />

                <div className="settings-divider" />

                <div className="settings-block">
                  <div className="settings-row-label">Time selector</div>
                  <div className="settings-row-desc">Morning / afternoon / evening</div>
                  <div className="settings-block-pad" />
                  <div className="settings-row-inline" style={{ padding: 0 }}>
                    <div className="settings-inline-right" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <div className="settings-inline-right" style={{ gap: 10 }}>
                        <Clock size={18} className="settings-inline-icon" />
                        <div className="settings-row-desc" style={{ marginTop: 0 }}>Next alert at {dailyMeta.next}</div>
                      </div>
                      <div style={{ flex: 1, maxWidth: 320 }} />
                    </div>
                  </div>
                  <div className="settings-block-pad" />
                  <Segmented
                    value={daily.timeSlot}
                    onChange={(v) => setDaily((p) => ({ ...p, timeSlot: v }))}
                    options={[
                      { value: 'morning', label: 'Morning' },
                      { value: 'afternoon', label: 'Afternoon' },
                      { value: 'evening', label: 'Evening' }
                    ]}
                  />
                </div>

                <div className="settings-divider" />

                <AnimatePresence mode="wait">
                  {daily.enabled ? (
                    <motion.div
                      key="daily-on"
                      className="settings-insight"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="settings-insight-head">
                        <div className="settings-insight-title">Live summary</div>
                        <Pill tone="blue">Demo</Pill>
                      </div>
                      <div className="settings-insight-text">
                        “Market demand stable. Weather risk: Medium.”
                      </div>
                      <div className="settings-mini">
                        <div className="settings-mini-row">
                          <div className="settings-mini-label">Market stability</div>
                          <div className="settings-mini-bar">
                            <div className="settings-mini-fill" style={{ width: '66%' }} />
                          </div>
                          <div className="settings-mini-value">66%</div>
                        </div>
                        <div className="settings-mini-row">
                          <div className="settings-mini-label">Weather risk</div>
                          <div className="settings-mini-bar">
                            <div className="settings-mini-fill yellow" style={{ width: '52%' }} />
                          </div>
                          <div className="settings-mini-value">52%</div>
                        </div>
                      </div>
                      <div className="settings-preview-line">Next alert at {dailyMeta.next}</div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="daily-off"
                      className="settings-preview off"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="settings-preview-title">Alerts paused</div>
                      <div className="settings-preview-text">Enable daily summary to see a calm plan for the day.</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Screen>
        )}

        {current === 'profile' && (
          <Screen key="profile" direction={direction}>
            <TopBar
              title="Edit Profile"
              onBack={() => {
                setProfileSaved(false);
                pop();
              }}
              rightSlot={profileSaved ? <Pill>Saved</Pill> : null}
            />
            <div className="settings-content">
              <div className="settings-panel">
                <div className="settings-avatar">
                  <div className="settings-avatar-ring" />
                  <div className="settings-avatar-inner">
                    <UserCircle2 size={40} />
                  </div>
                  <div className="settings-avatar-caption">Farmer profile</div>
                </div>

                <div className="settings-form">
                  <label className="settings-field">
                    <div className="settings-field-label">Name</div>
                    <input
                      className="settings-input"
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </label>

                  <label className="settings-field">
                    <div className="settings-field-label">Location</div>
                    <div className="settings-input-wrap">
                      <MapPin size={18} className="settings-input-icon" />
                      <input
                        className="settings-input has-icon"
                        value={profile.location}
                        onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                        placeholder="Village / City"
                      />
                    </div>
                  </label>

                  <label className="settings-field">
                    <div className="settings-field-label">Preferred language</div>
                    <div className="settings-input-wrap">
                      <Languages size={18} className="settings-input-icon" />
                      <select
                        className="settings-select has-icon"
                        value={profile.language}
                        onChange={(e) => setProfile((p) => ({ ...p, language: e.target.value }))}
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                        <option>Gujarati</option>
                      </select>
                    </div>
                  </label>

                  <motion.button
                    type="button"
                    className="settings-primary"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    onClick={() => {
                      setProfileSaved(true);
                      window.setTimeout(() => setProfileSaved(false), 1200);
                    }}
                  >
                    Save changes
                  </motion.button>

                  <AnimatePresence>
                    {profileSaved && (
                      <motion.div
                        className="settings-success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.22 }}
                      >
                        Recommendations will now be optimized for your region
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Screen>
        )}

        {current === 'permissions' && (
          <Screen key="permissions" direction={direction}>
            <TopBar title="App Permissions" onBack={pop} />
            <div className="settings-content">
              <div className="settings-panel">
                <div className="settings-helper">
                  Control permissions anytime. Your choices won’t stop the app from opening — they only affect features.
                </div>

                <div className="settings-perm">
                  <div className="settings-perm-head">
                    <div className="settings-perm-title">
                      <MapPin size={18} />
                      <span>Location</span>
                    </div>
                    <button
                      type="button"
                      className={`settings-switch ${permissions.location ? 'on' : 'off'}`}
                      onClick={() => setPermissions((p) => ({ ...p, location: !p.location }))}
                      aria-pressed={permissions.location}
                    >
                      <span className="settings-switch-thumb" />
                    </button>
                  </div>
                  <div className="settings-perm-desc">For local market insights and weather accuracy.</div>
                  <div className="settings-perm-why">Why we need this: To show nearby mandi prices and better forecasts.</div>
                  <div className={`settings-note ${permissions.location ? 'ok' : 'warn'}`}>
                    {permissions.location ? 'Insights optimized' : 'Local insights may be less accurate'}
                  </div>
                </div>

                <div className="settings-perm">
                  <div className="settings-perm-head">
                    <div className="settings-perm-title">
                      <Bell size={18} />
                      <span>Notifications</span>
                    </div>
                    <button
                      type="button"
                      className={`settings-switch ${permissions.notifications ? 'on' : 'off'}`}
                      onClick={() => setPermissions((p) => ({ ...p, notifications: !p.notifications }))}
                      aria-pressed={permissions.notifications}
                    >
                      <span className="settings-switch-thumb" />
                    </button>
                  </div>
                  <div className="settings-perm-desc">To deliver time-sensitive alerts.</div>
                  <div className="settings-perm-why">Why we need this: So you don’t miss weather warnings and price changes.</div>
                  <div className={`settings-note ${permissions.notifications ? 'ok' : 'warn'}`}>
                    {permissions.notifications ? 'Insights optimized' : 'Local insights may be less accurate'}
                  </div>
                </div>

                <div className="settings-perm">
                  <div className="settings-perm-head">
                    <div className="settings-perm-title">
                      <Database size={18} />
                      <span>Storage</span>
                    </div>
                    <button
                      type="button"
                      className={`settings-switch ${permissions.storage ? 'on' : 'off'}`}
                      onClick={() => setPermissions((p) => ({ ...p, storage: !p.storage }))}
                      aria-pressed={permissions.storage}
                    >
                      <span className="settings-switch-thumb" />
                    </button>
                  </div>
                  <div className="settings-perm-desc">Save reports and snapshots on your device.</div>
                  <div className="settings-perm-why">Why we need this: To store offline-friendly summaries for your records.</div>
                  <div className={`settings-note ${permissions.storage ? 'ok' : 'warn'}`}>
                    {permissions.storage ? 'Insights optimized' : 'Local insights may be less accurate'}
                  </div>
                </div>
              </div>
            </div>
          </Screen>
        )}

        {current === 'privacy' && (
          <Screen key="privacy" direction={direction}>
            <TopBar
              title="Privacy & Security"
              onBack={pop}
              rightSlot={security.appLock ? <Lock size={18} className="settings-lock-indicator" /> : null}
            />
            <div className="settings-content">
              <div className="settings-panel">
                <div className="settings-card">
                  <ListItem
                    icon={<KeyRound size={20} />}
                    label="Change password"
                    description="For your account safety (UI only)"
                    onClick={() => {}}
                    right={<Pill tone="blue">UI only</Pill>}
                  />

                  <div className="settings-divider" />

                  <div className="settings-block">
                    <div className="settings-row-label">App lock</div>
                    <div className="settings-row-desc">Add a quick lock so only you can open the app</div>
                    <div className="settings-block-pad" />
                    <div className="settings-row-inline">
                      <div className="settings-inline-left">
                        <div className="settings-lock-modes">
                          <button
                            type="button"
                            className={`settings-chip ${security.lockMode === 'pin' ? 'active' : ''}`}
                            onClick={() => setSecurity((p) => ({ ...p, lockMode: 'pin', appLock: true }))}
                          >
                            PIN
                          </button>
                          <button
                            type="button"
                            className={`settings-chip ${security.lockMode === 'biometric' ? 'active' : ''}`}
                            onClick={() => setSecurity((p) => ({ ...p, lockMode: 'biometric', appLock: true }))}
                          >
                            Biometric
                          </button>
                        </div>
                        <div className="settings-row-desc">Mode: {security.lockMode === 'pin' ? 'PIN' : 'Biometric'}</div>
                      </div>
                      <div className="settings-inline-right">
                        <button
                          type="button"
                          className={`settings-switch ${security.appLock ? 'on' : 'off'}`}
                          onClick={() => setSecurity((p) => ({ ...p, appLock: !p.appLock }))}
                          aria-pressed={security.appLock}
                        >
                          <span className="settings-switch-thumb" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="settings-divider" />

                  <div className="settings-insight">
                    <div className="settings-insight-head">
                      <div className="settings-insight-title">Data usage summary</div>
                      <Pill tone="yellow">Static</Pill>
                    </div>
                    <div className="settings-usage">
                      <div className="settings-usage-row">
                        <span>Last 7 days</span>
                        <span>48 MB</span>
                      </div>
                      <div className="settings-progress">
                        <div className="settings-progress-row">
                          <div className="settings-progress-label">Weather & market updates</div>
                          <div className="settings-progress-bar">
                            <div className="settings-progress-fill blue" style={{ width: '75%' }} />
                          </div>
                          <div className="settings-progress-val">36 MB</div>
                        </div>
                        <div className="settings-progress-row">
                          <div className="settings-progress-label">Images & reports</div>
                          <div className="settings-progress-bar">
                            <div className="settings-progress-fill yellow" style={{ width: '25%' }} />
                          </div>
                          <div className="settings-progress-val">12 MB</div>
                        </div>
                      </div>
                      <div className="settings-protected">
                        <span>Personal data protected</span>
                        <Pill>On</Pill>
                      </div>
                    </div>
                  </div>

                  <div className="settings-link">Privacy policy (placeholder)</div>
                  <div className="settings-helper">
                    We keep language simple. You stay in control of alerts and access.
                  </div>
                </div>
              </div>
            </div>
          </Screen>
        )}

        {current === 'account' && (
          <Screen key="account" direction={direction}>
            <TopBar title="Account Details" onBack={pop} />
            <div className="settings-content">
              <div className="settings-panel">
                <div className="settings-summary">
                  <div className="settings-summary-row">
                    <span>Status</span>
                    <Pill>Active & Healthy</Pill>
                  </div>
                  <div className="settings-summary-row">
                    <span className="settings-summary-left"><Phone size={16} /> Phone</span>
                    <span className="settings-summary-right">{masked.phone}</span>
                  </div>
                  <div className="settings-summary-row">
                    <span className="settings-summary-left"><Mail size={16} /> Email</span>
                    <span className="settings-summary-right">{masked.email}</span>
                  </div>
                </div>

                <div className="settings-divider" />

                <motion.button
                  type="button"
                  className="settings-action"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLogoutModalOpen(true)}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>

                <motion.button
                  type="button"
                  className="settings-action danger"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {}}
                >
                  <Trash2 size={18} />
                  <span>Delete account</span>
                  <span className="settings-action-note">(not performed)</span>
                </motion.button>

                <div className="settings-helper">
                  Delete is kept secondary to avoid accidental taps. Your account stays safe.
                </div>

                <AnimatePresence>
                  {logoutModalOpen && (
                    <>
                      <motion.div
                        className="settings-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLogoutModalOpen(false)}
                      />
                      <motion.div
                        className="settings-modal"
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 18, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="settings-modal-title">Confirm logout</div>
                        <div className="settings-modal-text">You can sign back in anytime. Your preferences stay saved on this device (demo).</div>
                        <div className="settings-modal-actions">
                          <button
                            type="button"
                            className="settings-modal-btn ghost"
                            onClick={() => setLogoutModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="settings-modal-btn primary"
                            onClick={() => setLogoutModalOpen(false)}
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Screen>
        )}
      </AnimatePresence>
    </div>
  );
}
