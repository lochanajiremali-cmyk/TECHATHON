import React, { useMemo, useState } from 'react';
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
  BadgeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SeasonalAdvice.css';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function detectSeasonByMonth(m) {
  // Demo logic (India-centric)
  // Kharif: Jun-Sep, Rabi: Oct-Feb, Zaid: Mar-May
  if (m >= 5 && m <= 8) {
    return {
      key: 'kharif',
      title: 'Kharif (Monsoon Phase)',
      subtitle: 'Based on current month and region',
      tone: 'green',
      Icon: Calendar
    };
  }
  if (m >= 9 || m <= 1) {
    return {
      key: 'rabi',
      title: 'Rabi (Cool & Dry Phase)',
      subtitle: 'Based on current month and region',
      tone: 'blue',
      Icon: Calendar
    };
  }
  return {
    key: 'zaid',
    title: 'Zaid (Summer Phase)',
    subtitle: 'Based on current month and region',
    tone: 'yellow',
    Icon: Calendar
  };
}

function nextSeasonKey(currentKey) {
  if (currentKey === 'kharif') return 'rabi';
  if (currentKey === 'rabi') return 'zaid';
  return 'kharif';
}

function seasonMetaByKey(key) {
  if (key === 'kharif') return { title: 'Kharif (Monsoon Phase)', tone: 'green' };
  if (key === 'rabi') return { title: 'Rabi (Cool & Dry Phase)', tone: 'blue' };
  return { title: 'Zaid (Summer Phase)', tone: 'yellow' };
}

function demandTone(d) {
  if (d === 'High Demand') return 'green';
  if (d === 'Medium Demand') return 'yellow';
  return 'red';
}

function riskTone(r) {
  if (r === 'Low') return 'green';
  if (r === 'Medium') return 'yellow';
  return 'red';
}

function CropIcon({ kind }) {
  // Simple, copyright-safe “illustration-like” glyphs
  const map = {
    rice: '🌾',
    soybean: '🫘',
    maize: '🌽',
    cotton: '🧵',
    sugarcane: '🎋',
    onion: '🧅',
    wheat: '🌿',
    tomato: '🍅',
    grapes: '🍇',
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

function CropCard({ crop, open, onToggle }) {
  return (
    <motion.div
      className={`sa-crop ${crop.category}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.25 }}
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
          <Badge tone={demandTone(crop.demand)} icon={<TrendingUp size={14} />}>{crop.demand}</Badge>
          <Badge tone={crop.marketTagTone} icon={<Sprout size={14} />}>{crop.marketTag}</Badge>
          <Badge tone={riskTone(crop.risk)} icon={<ShieldAlert size={14} />}>Risk: {crop.risk}</Badge>
        </div>
      </div>

      <div className="sa-crop-foot">
        <div className="sa-risk-explain">{crop.riskExplain}</div>
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
            <div className="sa-why-line"><span>Season suitability:</span> {crop.why.season}</div>
            <div className="sa-why-line"><span>Market trend:</span> {crop.why.market}</div>
            <div className="sa-why-line"><span>Risk level:</span> {crop.why.risk}</div>
            <div className="sa-why-micro">Simple and transparent—so you can decide with confidence.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TimelineCard({ title, icon, items, tone }) {
  return (
    <motion.div
      className={`sa-action tone-${tone}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.25 }}
    >
      <div className="sa-action-head">
        <div className="sa-action-icon">{icon}</div>
        <div className="sa-action-title">{title}</div>
      </div>
      <div className="sa-action-items">
        {items.map((x, i) => (
          <div key={i} className="sa-action-item">
            <span className="sa-action-dot" />
            <span>{x}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MonthPill({ label, tone, hint }) {
  return (
    <div className={`sa-month tone-${tone}`}>
      <div className="sa-month-top">
        <div className="sa-month-label">{label}</div>
        <div className="sa-month-tone" />
      </div>
      <div className="sa-month-hint">{hint}</div>
    </div>
  );
}

export default function SeasonalAdvice({ onBack }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const region = 'Pune';

  const currentSeason = useMemo(() => detectSeasonByMonth(currentMonth), [currentMonth]);
  const nextSeason = useMemo(() => seasonMetaByKey(nextSeasonKey(currentSeason.key)), [currentSeason.key]);

  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [compareMode, setCompareMode] = useState(false);

  const [openWhy, setOpenWhy] = useState({});

  const data = useMemo(() => {
    // Static demo data designed to feel contextual
    const base = {
      seasonKey: currentSeason.key,
      sowingWindowDays: 5,
      cropSections: {
        recommended: [
          {
            id: 'rice',
            category: 'recommended',
            name: 'Rice',
            icon: 'rice',
            oneLine: 'Strong monsoon fit with stable water availability.',
            demand: 'High Demand',
            marketTag: 'Export-friendly',
            marketTagTone: 'blue',
            risk: 'Low',
            riskExplain: 'Low risk: predictable monsoon + steady demand.',
            why: {
              season: 'Kharif rainfall supports transplanting and early growth.',
              market: 'Demand remains stable; export orders are consistent (demo).',
              risk: 'Low due to lower price swings this month (demo).'
            }
          },
          {
            id: 'soybean',
            category: 'recommended',
            name: 'Soybean',
            icon: 'soybean',
            oneLine: 'Good for moisture-rich soil and rotation planning.',
            demand: 'Medium Demand',
            marketTag: 'Local market preferred',
            marketTagTone: 'yellow',
            risk: 'Medium',
            riskExplain: 'Medium risk: rain dependency and price fluctuation.',
            why: {
              season: 'Performs well in monsoon months with moderate drainage.',
              market: 'Local demand is steady; rates vary weekly (demo).',
              risk: 'Medium due to rainfall variability and mandi price swings.'
            }
          },
          {
            id: 'maize',
            category: 'recommended',
            name: 'Maize',
            icon: 'maize',
            oneLine: 'Fast growth and flexible harvest window.',
            demand: 'High Demand',
            marketTag: 'Export-friendly',
            marketTagTone: 'blue',
            risk: 'Medium',
            riskExplain: 'Medium risk: pest pressure in humid weeks.',
            why: {
              season: 'Kharif humidity supports quick vegetative growth.',
              market: 'High demand from feed + processing (demo).',
              risk: 'Medium due to pest risk during peak humidity.'
            }
          }
        ],
        risky: [
          {
            id: 'cotton',
            category: 'risky',
            name: 'Cotton',
            icon: 'cotton',
            oneLine: 'Possible, but needs close pest and rainfall monitoring.',
            demand: 'Medium Demand',
            marketTag: 'Export-friendly',
            marketTagTone: 'blue',
            risk: 'High',
            riskExplain: 'High risk: pests + price swings.',
            why: {
              season: 'Can work in Kharif but requires precise timing and care.',
              market: 'Export demand can rise, but pricing is volatile (demo).',
              risk: 'High due to pest pressure and fluctuating market price.'
            }
          },
          {
            id: 'sugarcane',
            category: 'risky',
            name: 'Sugarcane',
            icon: 'sugarcane',
            oneLine: 'Long duration crop; irrigation planning is critical.',
            demand: 'Low Demand',
            marketTag: 'Local market preferred',
            marketTagTone: 'yellow',
            risk: 'High',
            riskExplain: 'High risk: water requirement and long cycle.',
            why: {
              season: 'Monsoon helps early growth, but long cycle adds uncertainty.',
              market: 'Demand is stable but margins are tight (demo).',
              risk: 'High due to water dependence and time-to-cashflow.'
            }
          }
        ],
        notSuitable: [
          {
            id: 'onion',
            category: 'not',
            name: 'Onion',
            icon: 'onion',
            oneLine: 'Excess moisture can increase disease risk.',
            demand: 'Medium Demand',
            marketTag: 'Local market preferred',
            marketTagTone: 'yellow',
            risk: 'High',
            riskExplain: 'High risk: rain damage and post-harvest losses.',
            why: {
              season: 'High moisture can cause fungal issues and bulb rot.',
              market: 'Prices may rise, but losses can offset gains (demo).',
              risk: 'High due to storage and spoilage risk in monsoon.'
            }
          }
        ]
      },
      actions: {
        beforeSowing: [
          'Check seed quality and treat seeds for common fungal risk.',
          'Prepare drainage lines for heavy showers.',
          'Book input supplies early to avoid peak-season prices.'
        ],
        duringGrowth: [
          'Scout twice a week for pests after humid days.',
          'Use balanced nutrition—avoid over-urea in heavy rain.',
          'Keep a simple log of rainfall and spray timings.'
        ],
        beforeHarvest: [
          'Plan harvest in a dry window to reduce grain moisture.',
          'Arrange storage bags and transport 2–3 days earlier.',
          'Track market peak months to decide selling time.'
        ]
      },
      calendar: {
        sowing: [5, 6],
        growth: [6, 7],
        harvest: [8, 9],
        marketPeak: [9, 10]
      },
      compare: {
        current: {
          label: currentSeason.title,
          summary: 'Market demand stable. Weather risk: Medium.'
        },
        next: {
          label: nextSeason.title,
          summary: 'Demand shifts to wheat/vegetables. Weather risk: Low–Medium.'
        }
      }
    };

    return base;
  }, [currentSeason.title, currentSeason.key, nextSeason.title]);

  const calendarMonths = useMemo(() => {
    const mk = new Set(data.calendar.marketPeak.map((x) => x % 12));
    const sw = new Set(data.calendar.sowing.map((x) => x % 12));
    const gr = new Set(data.calendar.growth.map((x) => x % 12));
    const hv = new Set(data.calendar.harvest.map((x) => x % 12));

    return monthNames.map((m, idx) => {
      if (mk.has(idx)) return { label: m, tone: 'green', hint: 'Market peak' };
      if (hv.has(idx)) return { label: m, tone: 'red', hint: 'Harvest' };
      if (gr.has(idx)) return { label: m, tone: 'yellow', hint: 'Growth' };
      if (sw.has(idx)) return { label: m, tone: 'blue', hint: 'Sowing window' };
      return { label: m, tone: 'muted', hint: '—' };
    });
  }, [data.calendar]);

  const iconForSection = (k) => {
    if (k === 'recommended') return <BadgeCheck size={18} />;
    if (k === 'risky') return <BadgeAlert size={18} />;
    return <BadgeX size={18} />;
  };

  const titleForSection = (k) => {
    if (k === 'recommended') return 'Recommended Crops';
    if (k === 'risky') return 'Risky Crops';
    return 'Not Suitable Crops';
  };

  const subtitleForSection = (k) => {
    if (k === 'recommended') return 'Best fit for current season and region (demo)';
    if (k === 'risky') return 'Possible but needs careful planning (demo)';
    return 'Avoid to reduce loss risk (demo)';
  };

  const toneForSection = (k) => {
    if (k === 'recommended') return 'green';
    if (k === 'risky') return 'yellow';
    return 'red';
  };

  return (
    <div className="sa-root">
      <TopBar
        title="Seasonal Advice"
        onBack={onBack}
        rightSlot={
          <button
            type="button"
            className={`sa-compare ${compareMode ? 'on' : 'off'}`}
            onClick={() => setCompareMode((v) => !v)}
          >
            {compareMode ? 'Comparing' : 'Compare'}
          </button>
        }
      />

      <div className="sa-content">
        <motion.div
          className="sa-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="sa-hero-top">
            <div>
              <div className="sa-hero-kicker">Current Season</div>
              <div className="sa-hero-title">{currentSeason.title}</div>
              <div className="sa-hero-sub">{currentSeason.subtitle}</div>
            </div>
            <div className={`sa-season-badge tone-${currentSeason.tone}`}>
              <currentSeason.Icon size={18} />
              <span>{currentSeason.key.toUpperCase()}</span>
            </div>
          </div>

          <div className="sa-hero-meta">
            <div className="sa-meta">
              <MapPin size={16} />
              <span>For your region: {region}</span>
            </div>
            <div className="sa-meta dim">
              <AlertTriangle size={16} />
              <span>Demo-based insights. Always confirm with local conditions.</span>
            </div>
          </div>

          <div className="sa-alerts">
            <div className="sa-alerts-left">
              <div className="sa-alerts-title">
                <Bell size={18} />
                <span>Enable seasonal alerts</span>
              </div>
              <div className="sa-alerts-sub">
                {alertsEnabled ? `Best sowing window starts in ${data.sowingWindowDays} days` : 'Alerts paused'}
              </div>
            </div>
            <button
              type="button"
              className={`sa-switch ${alertsEnabled ? 'on' : 'off'}`}
              onClick={() => setAlertsEnabled((v) => !v)}
              aria-pressed={alertsEnabled}
            >
              <span className="sa-switch-thumb" />
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {compareMode ? (
            <motion.div
              key="compare"
              className="sa-compare-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22 }}
            >
              <div className="sa-compare-head">Season comparison</div>
              <div className="sa-compare-grid">
                <div className="sa-compare-card">
                  <Badge tone={currentSeason.tone} icon={<Calendar size={14} />}>{data.compare.current.label}</Badge>
                  <div className="sa-compare-text">{data.compare.current.summary}</div>
                </div>
                <div className="sa-compare-card">
                  <Badge tone={nextSeason.tone} icon={<Calendar size={14} />}>{data.compare.next.label}</Badge>
                  <div className="sa-compare-text">{data.compare.next.summary}</div>
                </div>
              </div>
              <div className="sa-compare-note">See how crops, risk and market opportunity shift between seasons.</div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="sa-block">
          <SectionHeader
            icon={<Sprout size={18} />}
            title="Crop recommendation by season"
            subtitle="Clear categories to help you decide quickly"
          />

          {(['recommended', 'risky', 'notSuitable']).map((k) => (
            <div key={k} className="sa-group">
              <div className={`sa-group-title tone-${toneForSection(k)}`}>
                <div className="sa-group-title-left">
                  <span className="sa-group-title-ic">{iconForSection(k)}</span>
                  <span>{titleForSection(k)}</span>
                </div>
                <span className="sa-group-sub">{subtitleForSection(k)}</span>
              </div>

              <div className="sa-crops">
                {data.cropSections[k === 'notSuitable' ? 'notSuitable' : k].map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    open={Boolean(openWhy[crop.id])}
                    onToggle={() => setOpenWhy((p) => ({ ...p, [crop.id]: !p[crop.id] }))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sa-block">
          <SectionHeader
            icon={<TrendingUp size={18} />}
            title="What to do now"
            subtitle="Actionable steps with time relevance"
          />

          <div className="sa-actions">
            <TimelineCard
              title="Before Sowing"
              tone="green"
              icon={<Sprout size={18} />}
              items={data.actions.beforeSowing}
            />
            <TimelineCard
              title="During Growth"
              tone="yellow"
              icon={<AlertTriangle size={18} />}
              items={data.actions.duringGrowth}
            />
            <TimelineCard
              title="Before Harvest"
              tone="red"
              icon={<XCircle size={18} />}
              items={data.actions.beforeHarvest}
            />
          </div>
        </div>

        <div className="sa-block">
          <SectionHeader
            icon={<Calendar size={18} />}
            title="Seasonal calendar view"
            subtitle="Sowing, growth, harvest and market peak months (demo)"
          />

          <motion.div
            className="sa-calendar"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.25 }}
          >
            <div className="sa-calendar-row">
              {calendarMonths.map((m) => (
                <MonthPill key={m.label} label={m.label} tone={m.tone} hint={m.hint} />
              ))}
            </div>
            <div className="sa-calendar-legend">
              <Badge tone="blue" icon={<Calendar size={14} />}>Best sowing window</Badge>
              <Badge tone="yellow" icon={<AlertTriangle size={14} />}>Growth phase</Badge>
              <Badge tone="red" icon={<XCircle size={14} />}>Harvest period</Badge>
              <Badge tone="green" icon={<TrendingUp size={14} />}>Market peak months</Badge>
            </div>
          </motion.div>
        </div>

        <div className="sa-footer">
          Trust-building note: these insights are demo-based for hackathon presentation. Always validate with local weather, soil, and input availability.
        </div>
      </div>
    </div>
  );
}
