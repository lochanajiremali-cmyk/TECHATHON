import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Bell,
  Sprout,
  ShieldAlert,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  BadgeCheck,
  BadgeAlert,
  BadgeX,
  Info,
  ChevronRight,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SeasonalAdvice.css';
import { detectSeason, getRecommendations, getActionableSteps } from './seasonalLogic';
import { CROP_DATASET, REGIONS } from './seasonalData';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function demandTone(d) {
  if (d === 'High') return 'green';
  if (d === 'Medium') return 'yellow';
  return 'red';
}

function riskTone(r) {
  if (r === 'Low') return 'green';
  if (r === 'Medium') return 'yellow';
  return 'red';
}

function CropIcon({ kind }) {
  const map = {
    rice: '🌾',
    wheat: '🌿',
    maize: '🌽',
    soybean: '🫘',
    default: '🌱'
  };
  return <span className="sa-emoji" aria-hidden>{map[kind] || map.default}</span>;
}

function TopBar({ title, onBack, rightSlot }) {
  return (
    <div className="sa-topbar">
      <button className="sa-topbar-btn" onClick={onBack} aria-label="Back">
        <ArrowLeft size={22} />
      </button>
      <div className="sa-topbar-title">{title}</div>
      <div className="sa-topbar-right">{rightSlot || null}</div>
    </div>
  );
}

function Badge({ tone = 'green', icon, children }) {
  return (
    <span className={`sa-badge tone-${tone}`}>
      {icon ? <span className="sa-badge-icon">{icon}</span> : null}
      {children}
    </span>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="sa-section-head">
      <div className="sa-section-icon">{icon}</div>
      <div>
        <div className="sa-section-title">{title}</div>
        {subtitle ? <div className="sa-section-sub">{subtitle}</div> : null}
      </div>
    </div>
  );
}

function CropCard({ crop, open, onToggle, currentMonth }) {
  const actionSteps = useMemo(() => getActionableSteps(crop, currentMonth), [crop, currentMonth]);

  return (
    <motion.div
      className={`sa-crop ${crop.category}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sa-crop-top">
        <div className="sa-crop-left">
          <div className="sa-crop-ill">
            <CropIcon kind={crop.icon} />
          </div>
          <div className="sa-crop-text">
            <div className="sa-crop-name">{crop.name}</div>
            <div className="sa-crop-one">{crop.oneLine}</div>
          </div>
        </div>
        <div className="sa-crop-right">
          <Badge tone={demandTone(crop.marketDemand)} icon={<TrendingUp size={14} />}>{crop.marketDemand} Demand</Badge>
          <Badge tone={riskTone(crop.riskLevel)} icon={<ShieldAlert size={14} />}>Risk: {crop.riskLevel}</Badge>
        </div>
      </div>

      <div className="sa-crop-foot">
        <div className="sa-risk-explain">
          <span className="sa-stage-label">Status: {actionSteps.stage} Stage</span>
          {crop.reason}
        </div>
        <button className="sa-why" type="button" onClick={onToggle}>
          <span>Why recommended?</span>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="sa-why-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="sa-factors-grid">
              <div className="sa-factor-item">
                <div className="sa-factor-head">
                  <span className="sa-factor-label">Season Suitability</span>
                  <span className={`sa-factor-status tone-green`}>In-Season</span>
                </div>
                <div className="sa-factor-desc">{crop.why.season}</div>
              </div>
              <div className="sa-factor-item">
                <div className="sa-factor-head">
                  <span className="sa-factor-label">Market Opportunity</span>
                  <span className={`sa-factor-status tone-${demandTone(crop.marketDemand)}`}>{crop.marketDemand}</span>
                </div>
                <div className="sa-factor-desc">{crop.why.market}</div>
              </div>
              <div className="sa-factor-item">
                <div className="sa-factor-head">
                  <span className="sa-factor-label">Risk Assessment</span>
                  <span className={`sa-factor-status tone-${riskTone(crop.riskLevel)}`}>{crop.riskLevel}</span>
                </div>
                <div className="sa-factor-desc">{crop.why.risk}</div>
              </div>
            </div>
            
            <div className="sa-divider" />
            
            <div className="sa-why-line"><span>Recommended Actions:</span></div>
            <div className="sa-action-list">
              {actionSteps.steps.map((step, idx) => (
                <div key={idx} className="sa-action-step">
                  <div className="sa-action-dot" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionCard({ title, icon, tasks, tone }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`sa-action-card tone-${tone} ${isOpen ? 'open' : ''}`}>
      <button className="sa-action-card-head" onClick={() => setIsOpen(!isOpen)}>
        <div className="sa-action-card-left">
          <div className="sa-action-card-icon">{icon}</div>
          <div className="sa-action-card-title">{title}</div>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronRight size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="sa-action-card-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {tasks.map((task, i) => (
              <div key={i} className="sa-action-task">
                <span className="sa-task-dot" />
                <span>{task}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SeasonalAdvice({ onBack }) {
  const [now] = useState(new Date());
  const currentMonth = now.getMonth();
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [showRegionPicker, setShowRegionSelector] = useState(false);

  const currentSeason = useMemo(() => detectSeason(currentMonth), [currentMonth]);
  const nextSeason = useMemo(() => detectSeason((currentMonth + 4) % 12), [currentMonth]);

  const [alertsEnabled, setAlertsEnabled] = useState(() => {
    const saved = localStorage.getItem('sa_alerts_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [compareMode, setCompareMode] = useState(false);
  const [openWhy, setOpenWhy] = useState({});

  useEffect(() => {
    localStorage.setItem('sa_alerts_enabled', JSON.stringify(alertsEnabled));
  }, [alertsEnabled]);

  const recommendations = useMemo(() => 
    getRecommendations(currentSeason.key, selectedRegion), 
    [currentSeason.key, selectedRegion]
  );

  const nextRecommendations = useMemo(() => 
    getRecommendations(nextSeason.key, selectedRegion),
    [nextSeason.key, selectedRegion]
  );

  const calendarMonths = useMemo(() => {
    return monthNames.map((m, idx) => {
      const hasSowing = CROP_DATASET.some(c => c.stages.sowing.months.includes(idx));
      const hasHarvest = CROP_DATASET.some(c => c.stages.harvest.months.includes(idx));
      
      let tone = 'muted';
      let hint = 'Maintenance';
      if (hasSowing) { tone = 'blue'; hint = 'Sowing Window'; }
      else if (hasHarvest) { tone = 'green'; hint = 'Harvest Peak'; }
      
      return { label: m, tone, hint };
    });
  }, []);

  return (
    <div className="sa-root">
      <TopBar
        title="Seasonal Advice"
        onBack={onBack}
        rightSlot={
          <button 
            className={`sa-icon-btn ${showRegionPicker ? 'active' : ''}`}
            onClick={() => setShowRegionSelector(!showRegionPicker)}
          >
            <MapPin size={20} />
          </button>
        }
      />

      <div className="sa-content">
        <AnimatePresence>
          {showRegionPicker && (
            <motion.div 
              className="sa-region-picker"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="sa-region-picker-title">Select Your Region</div>
              <div className="sa-region-list">
                {REGIONS.map(r => (
                  <button 
                    key={r} 
                    className={`sa-region-opt ${selectedRegion === r ? 'selected' : ''}`}
                    onClick={() => { setSelectedRegion(r); setShowRegionSelector(false); }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="sa-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="sa-hero-top">
            <div>
              <div className="sa-hero-kicker">Current Season</div>
              <div className="sa-hero-title">{currentSeason.label} ({currentSeason.phase})</div>
              <div className="sa-hero-sub">Local advice for {selectedRegion}</div>
            </div>
            <div className={`sa-season-badge tone-${currentSeason.color}`}>
              <Calendar size={18} />
              <span>{currentSeason.key.toUpperCase()}</span>
            </div>
          </div>

          <div className="sa-hero-meta">
            <div className="sa-meta">
              <Badge tone="muted" icon={<MapPin size={14} />}>{selectedRegion}</Badge>
              <Badge tone="muted" icon={<Info size={14} />}>Rule-based Insight</Badge>
            </div>
          </div>

          <div className="sa-alerts">
            <div className="sa-alerts-left">
              <div className="sa-alerts-title">
                <Bell size={18} />
                <span>Seasonal Alerts</span>
              </div>
              <div className="sa-alerts-sub">
                {alertsEnabled ? `Best sowing window starts in 5 days` : 'Alerts are currently muted'}
              </div>
            </div>
            <button
              type="button"
              className={`sa-switch ${alertsEnabled ? 'on' : 'off'}`}
              onClick={() => setAlertsEnabled(!alertsEnabled)}
            >
              <span className="sa-switch-thumb" />
            </button>
          </div>
        </motion.div>

        <div className="sa-mode-toggle">
          <button 
            className={`sa-mode-btn ${!compareMode ? 'active' : ''}`}
            onClick={() => setCompareMode(false)}
          >
            Overview
          </button>
          <button 
            className={`sa-mode-btn ${compareMode ? 'active' : ''}`}
            onClick={() => setCompareMode(true)}
          >
            Season Compare
          </button>
        </div>

        <AnimatePresence mode="wait">
          {compareMode ? (
            <motion.div
              key="compare"
              className="sa-compare-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SectionHeader 
                icon={<TrendingUp size={18} />} 
                title="Next Season Preview" 
                subtitle={`Transitioning to ${nextSeason.label} in ${4 - (currentMonth % 4)} months.`} 
              />
              <div className="sa-compare-grid">
                <div className="sa-compare-col">
                  <div className="sa-compare-label">Current: {currentSeason.label}</div>
                  <div className="sa-compare-stat">
                    <span className="sa-stat-val">{recommendations.recommended.length}</span>
                    <span className="sa-stat-label">Recommended</span>
                  </div>
                </div>
                <div className="sa-compare-col">
                  <div className="sa-compare-label">Next: {nextSeason.label}</div>
                  <div className="sa-compare-stat">
                    <span className="sa-stat-val">{nextRecommendations.recommended.length}</span>
                    <span className="sa-stat-label">Projected</span>
                  </div>
                </div>
              </div>
              <div className="sa-compare-note">
                <AlertTriangle size={14} />
                <span>Market demand typically shifts from cereal to pulse crops during this transition.</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="sa-block">
                <SectionHeader
                  icon={<Sprout size={18} />}
                  title="Crop Recommendations"
                  subtitle="Optimized for your current month and region."
                />

                {['recommended', 'risky', 'notSuitable'].map((k) => (
                  <div key={k} className="sa-group">
                    <div className={`sa-group-title tone-${k === 'recommended' ? 'green' : k === 'risky' ? 'yellow' : 'red'}`}>
                      <div className="sa-group-title-left">
                        {k === 'recommended' ? <BadgeCheck size={18} /> : k === 'risky' ? <BadgeAlert size={18} /> : <BadgeX size={18} />}
                        <span>{k === 'recommended' ? 'Recommended' : k === 'risky' ? 'Use Caution' : 'Not Suitable'}</span>
                      </div>
                      <span className="sa-group-sub">{recommendations[k].length} Crops</span>
                    </div>

                    <div className="sa-crops">
                      {recommendations[k].map((crop) => (
                        <CropCard
                          key={crop.id}
                          crop={crop}
                          currentMonth={currentMonth}
                          open={Boolean(openWhy[crop.id])}
                          onToggle={() => setOpenWhy(p => ({ ...p, [crop.id]: !p[crop.id] }))}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sa-block">
                <SectionHeader
                  icon={<Calendar size={18} />}
                  title="Agricultural Timeline"
                  subtitle="Scroll to explore sowing and harvest windows."
                />
                <div className="sa-calendar">
                  <div className="sa-calendar-row">
                    {calendarMonths.map((m, idx) => (
                      <div key={idx} className={`sa-month tone-${m.tone} ${idx === currentMonth ? 'current' : ''}`}>
                        <div className="sa-month-top">
                          <div className="sa-month-label">{m.label}</div>
                          {idx === currentMonth && <div className="sa-current-dot" />}
                        </div>
                        <div className="sa-month-hint">{m.hint}</div>
                      </div>
                    ))}
                  </div>
                  <div className="sa-calendar-legend">
                    <Badge tone="blue">Sowing</Badge>
                    <Badge tone="green">Harvest</Badge>
                    <Badge tone="muted">Planning</Badge>
                  </div>
                </div>
              </div>

              <div className="sa-block">
                <SectionHeader
                  icon={<TrendingUp size={18} />}
                  title="Action Timeline"
                  subtitle="Critical steps for the current phase."
                />
                <div className="sa-actions-list">
                  <ActionCard 
                    title="Before Sowing" 
                    tone="green" 
                    icon={<Sprout size={18} />} 
                    tasks={['Conduct soil testing', 'Procure certified seeds', 'Clear field drainage']}
                  />
                  <ActionCard 
                    title="During Growth" 
                    tone="yellow" 
                    icon={<TrendingUp size={18} />} 
                    tasks={['Apply first fertilizer dose', 'Monitor for leaf folder', 'Maintain moisture level']}
                  />
                  <ActionCard 
                    title="Before Harvest" 
                    tone="red" 
                    icon={<Calendar size={18} />} 
                    tasks={['Check grain moisture', 'Arrange storage bags', 'Book local transport']}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="sa-footer">
          <Info size={14} />
          <span>Local, rule-based engine. No active data connection required.</span>
        </div>
      </div>
    </div>
  );
}
