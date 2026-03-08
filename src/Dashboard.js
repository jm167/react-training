import React, { useState } from 'react';
import './Dashboard.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const DATES = [
  '04/13','04/14','04/15','04/16','04/17','04/18','04/19',
  '04/20','04/21','04/22','04/23','04/24','04/25','04/26',
];
const ALL_DAYS = DATES.length;  // 14
const ACTIVE_DAY = 2;           // index of "today" (04/15)

// SVG coordinate helpers
const DAY_W = 100;  // SVG units per day

function xAt(dayIdx, frac = 0) { return dayIdx * DAY_W + frac * DAY_W; }
function yScale(value, maxValue, svgH) { return svgH - (value / maxValue) * svgH; }
function ptsPath(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

// ─── Chart data ────────────────────────────────────────────────────────────────

// Gantt bars keyed by product: d=dayIdx, s=startFrac, e=endFrac, r=row(0-3), c=color
const GANTT_DATA = {
  'PREMIUM MOGAS': [
    // Row 0 – dark navy
    { d: 2, s: 0.00, e: 0.42, r: 0, c: '#2c3e50' },
    { d: 2, s: 0.52, e: 0.88, r: 0, c: '#2c3e50' },
    { d: 4, s: 0.06, e: 0.60, r: 0, c: '#2c3e50' },
    { d: 5, s: 0.00, e: 0.42, r: 0, c: '#2c3e50' },
    { d: 7, s: 0.60, e: 1.00, r: 0, c: '#2c3e50' },
    { d: 8, s: 0.00, e: 0.08, r: 0, c: '#2c3e50' },
    { d: 10, s: 0.08, e: 0.58, r: 0, c: '#2c3e50' },
    { d: 11, s: 0.60, e: 1.00, r: 0, c: '#2c3e50' },
    { d: 12, s: 0.00, e: 0.12, r: 0, c: '#2c3e50' },
    { d: 12, s: 0.20, e: 0.58, r: 0, c: '#2c3e50' },
    // Row 1 – red
    { d: 2, s: 0.14, e: 0.66, r: 1, c: '#c0392b' },
    { d: 4, s: 0.22, e: 0.76, r: 1, c: '#c0392b' },
    { d: 5, s: 0.00, e: 0.34, r: 1, c: '#c0392b' },
    { d: 6, s: 0.56, e: 1.00, r: 1, c: '#c0392b' },
    { d: 7, s: 0.00, e: 0.38, r: 1, c: '#c0392b' },
    { d: 10, s: 0.20, e: 0.56, r: 1, c: '#c0392b' },
    { d: 12, s: 0.00, e: 0.44, r: 1, c: '#c0392b' },
    // Row 2 – orange
    { d: 2, s: 0.28, e: 0.74, r: 2, c: '#d35400' },
    { d: 4, s: 0.00, e: 0.50, r: 2, c: '#d35400' },
    { d: 6, s: 0.16, e: 0.26, r: 2, c: '#d35400' },
    { d: 10, s: 0.00, e: 0.34, r: 2, c: '#d35400' },
    { d: 12, s: 0.32, e: 0.74, r: 2, c: '#d35400' },
    // Row 3 – amber/gold
    { d: 2, s: 0.62, e: 0.88, r: 3, c: '#e8a217' },
    { d: 4, s: 0.60, e: 0.75, r: 3, c: '#e8a217' },
    { d: 7, s: 0.00, e: 0.22, r: 3, c: '#e8a217' },
    { d: 12, s: 0.86, e: 1.00, r: 3, c: '#e8a217' },
  ],
  'REGULAR MOGAS': [
    { d: 1, s: 0.10, e: 0.50, r: 0, c: '#2c3e50' },
    { d: 3, s: 0.30, e: 0.70, r: 0, c: '#2c3e50' },
    { d: 5, s: 0.20, e: 0.60, r: 0, c: '#2c3e50' },
    { d: 1, s: 0.40, e: 0.80, r: 1, c: '#c0392b' },
    { d: 4, s: 0.10, e: 0.50, r: 1, c: '#c0392b' },
    { d: 6, s: 0.30, e: 0.70, r: 1, c: '#c0392b' },
    { d: 2, s: 0.20, e: 0.60, r: 2, c: '#d35400' },
    { d: 5, s: 0.40, e: 0.80, r: 2, c: '#d35400' },
  ],
  'JET A': [
    { d: 0, s: 0.20, e: 0.60, r: 0, c: '#2c3e50' },
    { d: 3, s: 0.10, e: 0.45, r: 0, c: '#2c3e50' },
    { d: 6, s: 0.30, e: 0.65, r: 0, c: '#2c3e50' },
    { d: 1, s: 0.50, e: 0.90, r: 1, c: '#c0392b' },
    { d: 4, s: 0.20, e: 0.55, r: 1, c: '#c0392b' },
    { d: 3, s: 0.15, e: 0.50, r: 2, c: '#d35400' },
  ],
};

// Inventory data in MB keyed by product
const INV_MAX_MB  = 40;
const INV_MAXLINE = 30;   // MAX reference (MB)
const INV_MINLINE = 15;   // MIN reference (MB)
const INV_ACTUAL_IDX = 6; // first 7 points are "actual", rest are forecast

const INVENTORY_DATA = {
  'PREMIUM MOGAS': [
    { x: 0, y: 21.5 }, { x: 1, y: 20.8 }, { x: 2, y: 20.5 },
    { x: 3, y: 19.8 }, { x: 4, y: 18.6 }, { x: 5, y: 19.4 },
    { x: 6, y: 20.2 }, { x: 7, y: 22.1 }, { x: 8, y: 21.4 },
    { x: 9, y: 20.8 }, { x: 10, y: 21.0 }, { x: 11, y: 20.5 },
    { x: 12, y: 19.8 }, { x: 13, y: 21.3 },
  ],
  'REGULAR MOGAS': [
    { x: 0, y: 18.2 }, { x: 1, y: 17.5 }, { x: 2, y: 16.8 },
    { x: 3, y: 17.2 }, { x: 4, y: 16.5 }, { x: 5, y: 17.8 },
    { x: 6, y: 18.5 }, { x: 7, y: 19.0 }, { x: 8, y: 18.7 },
    { x: 9, y: 18.2 }, { x: 10, y: 17.8 }, { x: 11, y: 18.1 },
    { x: 12, y: 17.5 }, { x: 13, y: 18.3 },
  ],
  'JET A': [
    { x: 0, y: 25.0 }, { x: 1, y: 24.5 }, { x: 2, y: 23.8 },
    { x: 3, y: 24.2 }, { x: 4, y: 23.5 }, { x: 5, y: 24.0 },
    { x: 6, y: 25.2 }, { x: 7, y: 26.1 }, { x: 8, y: 25.8 },
    { x: 9, y: 25.3 }, { x: 10, y: 24.9 }, { x: 11, y: 25.1 },
    { x: 12, y: 24.6 }, { x: 13, y: 25.4 },
  ],
};

const LIFT_MAX_MB = 2;

const LIFTINGS_ACTUAL = [
  { x: 0, y: 0.88 }, { x: 1, y: 0.92 }, { x: 2, y: 0.95 },
  { x: 3, y: 0.38 }, { x: 4, y: 0.00 },
];
const LIFTINGS_FORECAST = [
  { x: 0, y: 0.84 }, { x: 1, y: 0.84 }, { x: 2, y: 0.82 },
  { x: 3, y: 0.80 }, { x: 4, y: 0.78 }, { x: 5, y: 0.78 },
  { x: 6, y: 0.78 }, { x: 7, y: 0.78 }, { x: 8, y: 0.78 },
  { x: 9, y: 0.78 }, { x: 10, y: 0.78 }, { x: 11, y: 0.78 },
  { x: 12, y: 0.80 }, { x: 13, y: 0.82 },
];
const PRIOR_YEAR = [
  { x: 0, y: 0.92 }, { x: 1, y: 0.88 }, { x: 2, y: 0.82 },
  { x: 3, y: 0.78 }, { x: 4, y: 0.75 }, { x: 5, y: 0.74 },
  { x: 6, y: 0.76 }, { x: 7, y: 0.77 }, { x: 8, y: 0.76 },
  { x: 9, y: 0.75 }, { x: 10, y: 0.76 }, { x: 11, y: 0.77 },
  { x: 12, y: 0.78 }, { x: 13, y: 0.80 },
];

// ─── Shared layout helpers ─────────────────────────────────────────────────────

/** Left-panel + right-chart two-column section */
function SectionRow({ left, right }) {
  return (
    <div className="section-row">
      <div className="section-left">{left}</div>
      <div className="section-right">{right}</div>
    </div>
  );
}

/** Inline legend entry with a small SVG line sample */
function LegendLine({ solid, color, label }) {
  return (
    <div className="legend-item">
      <svg width={30} height={12} aria-hidden="true">
        <line
          x1={0} y1={6} x2={30} y2={6}
          stroke={color}
          strokeWidth={solid ? 3 : 2}
          strokeDasharray={solid ? undefined : '5,3'}
        />
        {solid && <circle cx={15} cy={6} r={4} fill="white" stroke={color} strokeWidth={2} />}
      </svg>
      {label && <span>{label}</span>}
    </div>
  );
}

// ─── TimelineHeader ────────────────────────────────────────────────────────────

function TimelineHeader({ nDays }) {
  const visibleDates = DATES.slice(0, nDays);
  return (
    <div className="timeline-header">
      {visibleDates.map((date, i) => (
        <div
          key={date}
          className={`timeline-day${i === ACTIVE_DAY ? ' timeline-day--active' : ''}`}
        >
          <span className="timeline-date">{date}</span>
          <div className="timeline-ticks">
            <span>12P</span>
            <span>12A</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── GanttChart ────────────────────────────────────────────────────────────────

const GANTT_H   = 130;
const ROW_H     = 20;
const ROW_GAP   = 5;
const GANTT_TOP = 8;

function GanttChart({ nDays, product }) {
  const svgW = nDays * DAY_W;
  const bars = (GANTT_DATA[product] || []).filter((bar) => bar.d < nDays);

  return (
    <div className="chart-area">
      <svg
        className="chart-svg"
        viewBox={`0 0 ${svgW} ${GANTT_H}`}
        preserveAspectRatio="none"
        height={GANTT_H}
        aria-label="Terminal schedule Gantt chart"
      >
        {/* Column separators + active-day highlight */}
        {DATES.slice(0, nDays).map((_, i) => (
          <rect
            key={i}
            x={xAt(i)}
            y={0}
            width={DAY_W}
            height={GANTT_H}
            fill={i === ACTIVE_DAY ? 'rgba(52,152,219,0.1)' : 'none'}
            stroke="#f0f0f0"
            strokeWidth={0.5}
          />
        ))}

        {/* Schedule bars */}
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={xAt(bar.d, bar.s)}
            y={GANTT_TOP + bar.r * (ROW_H + ROW_GAP)}
            width={(bar.e - bar.s) * DAY_W}
            height={ROW_H}
            fill={bar.c}
            rx={2}
          />
        ))}

        {/* Warning indicator (diamond) at ACTIVE_DAY — only if visible */}
        {ACTIVE_DAY < nDays && (() => {
          const cx = xAt(ACTIVE_DAY, 0.25);
          const cy = GANTT_TOP + 4 * (ROW_H + ROW_GAP) + 12;
          const s = 10;
          return (
            <polygon
              points={`${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`}
              fill="none"
              stroke="#e67e22"
              strokeWidth={2.5}
            />
          );
        })()}

        {/* Critical indicator (box with !) at day 7 (04/20) — only if visible */}
        {7 < nDays && (() => {
          const cx = xAt(7, 0.5);
          const cy = GANTT_TOP + 4 * (ROW_H + ROW_GAP) + 12;
          const s = 10;
          return (
            <g>
              <rect
                x={cx - s} y={cy - s}
                width={s * 2} height={s * 2}
                fill="none" stroke="#c0392b" strokeWidth={2.5}
              />
              <text
                x={cx} y={cy + 6}
                textAnchor="middle"
                fill="#c0392b"
                fontSize={16}
                fontWeight="bold"
              >!</text>
            </g>
          );
        })()}
      </svg>

      {/* Warning / Critical legend row */}
      <div className="gantt-legend-row">
        <svg width={16} height={16} aria-hidden="true">
          <polygon points="8,1 15,8 8,15 1,8" fill="none" stroke="#e67e22" strokeWidth={2} />
        </svg>
        <span className="gantt-legend-label">Warning</span>
        <svg width={16} height={16} aria-hidden="true">
          <rect x={1} y={1} width={14} height={14} fill="none" stroke="#c0392b" strokeWidth={2} />
          <text x={8} y={13} textAnchor="middle" fill="#c0392b" fontSize={12} fontWeight="bold">!</text>
        </svg>
        <span className="gantt-legend-label">Critical</span>
      </div>
    </div>
  );
}

// ─── InventoryChart ────────────────────────────────────────────────────────────

const INV_SVG_H = 200;

function InventoryChart({ nDays, product, showActual, showForecast }) {
  const svgW     = nDays * DAY_W;
  const allPts   = (INVENTORY_DATA[product] || []).filter((d) => d.x < nDays);

  const toPts = (data) =>
    data.map((d) => ({ x: xAt(d.x, 0.5), y: yScale(d.y, INV_MAX_MB, INV_SVG_H) }));

  const actualPts   = toPts(allPts.slice(0, INV_ACTUAL_IDX + 1));
  const forecastPts = toPts(allPts.slice(INV_ACTUAL_IDX));

  const yMax = yScale(INV_MAXLINE, INV_MAX_MB, INV_SVG_H);
  const yMin = yScale(INV_MINLINE, INV_MAX_MB, INV_SVG_H);

  return (
    <div className="chart-area chart-area--with-yaxis">
      {/* Y-axis overlay labels */}
      <div className="y-axis-overlay" style={{ height: INV_SVG_H }}>
        <span className="y-label" style={{ bottom: '100%' }}>40 MB</span>
        <span className="y-label" style={{ bottom: `${(INV_MAXLINE / INV_MAX_MB) * 100}%` }}>30 MB</span>
        <span className="y-label y-label--max" style={{ bottom: `${(INV_MAXLINE / INV_MAX_MB) * 100}%` }}>MAX</span>
        <span className="y-label" style={{ bottom: '50%' }}>20 MB</span>
        <span className="y-label y-label--min" style={{ bottom: `${(INV_MINLINE / INV_MAX_MB) * 100}%` }}>MIN</span>
      </div>

      <svg
        className="chart-svg"
        viewBox={`0 0 ${svgW} ${INV_SVG_H}`}
        preserveAspectRatio="none"
        height={INV_SVG_H}
        aria-label="Inventory details line chart"
      >
        {/* Column shading */}
        {DATES.slice(0, nDays).map((_, i) => (
          <rect
            key={i}
            x={xAt(i)} y={0}
            width={DAY_W} height={INV_SVG_H}
            fill={i === ACTIVE_DAY ? 'rgba(52,152,219,0.08)' : 'none'}
            stroke="#f5f5f5"
            strokeWidth={0.5}
          />
        ))}

        {/* MAX reference line */}
        <line
          x1={0} y1={yMax} x2={svgW} y2={yMax}
          stroke="#e74c3c" strokeWidth={1.5} strokeDasharray="8,5" opacity={0.8}
        />
        {/* MIN reference line */}
        <line
          x1={0} y1={yMin} x2={svgW} y2={yMin}
          stroke="#95a5a6" strokeWidth={1.5} strokeDasharray="8,5" opacity={0.8}
        />

        {/* Actual line + dots */}
        {showActual && actualPts.length > 1 && (
          <>
            <path d={ptsPath(actualPts)} fill="none" stroke="#2980b9" strokeWidth={2.5} />
            {actualPts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={5} fill="white" stroke="#2980b9" strokeWidth={2} />
            ))}
          </>
        )}

        {/* Forecast line + dots */}
        {showForecast && forecastPts.length > 1 && (
          <>
            <path
              d={ptsPath(forecastPts)}
              fill="none" stroke="#2980b9" strokeWidth={2}
              strokeDasharray="6,4"
            />
            {forecastPts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={5} fill="white" stroke="#2980b9" strokeWidth={2} />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}

// ─── LiftingsChart ─────────────────────────────────────────────────────────────

const LIFT_SVG_H = 250;

function LiftingsChart({ nDays, showActual, showForecast, showPrior }) {
  const svgW = nDays * DAY_W;

  const toPts = (data) =>
    data
      .filter((d) => d.x < nDays)
      .map((d) => ({ x: xAt(d.x, 0.5), y: yScale(d.y, LIFT_MAX_MB, LIFT_SVG_H) }));

  const actualPts   = toPts(LIFTINGS_ACTUAL);
  const forecastPts = toPts(LIFTINGS_FORECAST);
  const priorPts    = toPts(PRIOR_YEAR);

  return (
    <div className="chart-area chart-area--with-yaxis">
      {/* Y-axis overlay labels */}
      <div className="y-axis-overlay" style={{ height: LIFT_SVG_H }}>
        <span className="y-label" style={{ bottom: '100%' }}>2 MB</span>
        <span className="y-label" style={{ bottom: '75%' }}>1.5 MB</span>
        <span className="y-label" style={{ bottom: '50%' }}>1 MB</span>
        <span className="y-label" style={{ bottom: '25%' }}>0.5 MB</span>
        <span className="y-label" style={{ bottom: '0%' }}>0 MB</span>
      </div>

      <svg
        className="chart-svg"
        viewBox={`0 0 ${svgW} ${LIFT_SVG_H}`}
        preserveAspectRatio="none"
        height={LIFT_SVG_H}
        aria-label="Liftings vs forecast line chart"
      >
        {/* Column shading */}
        {DATES.slice(0, nDays).map((_, i) => (
          <rect
            key={i}
            x={xAt(i)} y={0}
            width={DAY_W} height={LIFT_SVG_H}
            fill={i === ACTIVE_DAY ? 'rgba(52,152,219,0.08)' : 'none'}
            stroke="#f5f5f5"
            strokeWidth={0.5}
          />
        ))}

        {/* Prior year (thick gray band) */}
        {showPrior && priorPts.length > 1 && (
          <path
            d={ptsPath(priorPts)}
            fill="none" stroke="#bdc3c7" strokeWidth={10} opacity={0.5}
          />
        )}

        {/* Demand forecast (dotted) */}
        {showForecast && forecastPts.length > 1 && (
          <>
            <path
              d={ptsPath(forecastPts)}
              fill="none" stroke="#2980b9" strokeWidth={2}
              strokeDasharray="6,4"
            />
            {forecastPts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={4} fill="white" stroke="#2980b9" strokeWidth={2} />
            ))}
          </>
        )}

        {/* Actual liftings (solid) */}
        {showActual && actualPts.length > 1 && (
          <>
            <path d={ptsPath(actualPts)} fill="none" stroke="#2980b9" strokeWidth={2.5} />
            {actualPts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={5} fill="white" stroke="#2980b9" strokeWidth={2} />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}

// ─── Sections ──────────────────────────────────────────────────────────────────

function TerminalScheduleSection({ nDays }) {
  const [product, setProduct] = useState('PREMIUM MOGAS');

  return (
    <SectionRow
      left={
        <div className="panel">
          <h3 className="panel-title">Terminal Schedule Overview</h3>
          <p className="panel-meta">
            Last Updated:<br />April 15 at 11:13 AM
          </p>
          <select
            className="panel-select"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option>PREMIUM MOGAS</option>
            <option>REGULAR MOGAS</option>
            <option>JET A</option>
          </select>
        </div>
      }
      right={<GanttChart nDays={nDays} product={product} />}
    />
  );
}

function InventoryDetailsSection({ nDays }) {
  const [showActual,   setShowActual]   = useState(true);
  const [showForecast, setShowForecast] = useState(true);
  const [product, setProduct] = useState('PREMIUM MOGAS');

  return (
    <SectionRow
      left={
        <div className="panel">
          <h3 className="panel-title">Inventory Details</h3>
          <p className="panel-meta">
            Last Updated from TSW:<br />April 16 at 1:31 AM
          </p>
          <select
            className="panel-select"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option>PREMIUM MOGAS</option>
            <option>REGULAR MOGAS</option>
            <option>JET A</option>
          </select>
          <LegendLine solid color="#2980b9" label="Actual" />
          <LegendLine solid={false} color="#2980b9" label="Forecast" />
          <div className="panel-toggles">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showActual}
                onChange={(e) => setShowActual(e.target.checked)}
              />
              <span>Show Actual</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showForecast}
                onChange={(e) => setShowForecast(e.target.checked)}
              />
              <span>Show Forecast</span>
            </label>
          </div>
        </div>
      }
      right={
        <InventoryChart
          nDays={nDays}
          product={product}
          showActual={showActual}
          showForecast={showForecast}
        />
      }
    />
  );
}

function LiftingsVsForecastSection({ nDays }) {
  const [showActual,   setShowActual]   = useState(true);
  const [showForecast, setShowForecast] = useState(true);
  const [showPrior,    setShowPrior]    = useState(false);

  return (
    <SectionRow
      left={
        <div className="panel">
          <h3 className="panel-title">Liftings vs. Forecast</h3>
          <p className="panel-meta">
            Last Updated:<br />April 16 at 1:31 AM
          </p>
          <label className="check-label">
            <input
              type="checkbox"
              checked={showActual}
              onChange={(e) => setShowActual(e.target.checked)}
            />
            <span>Actual Liftings</span>
            <LegendLine solid color="#2980b9" />
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={showForecast}
              onChange={(e) => setShowForecast(e.target.checked)}
            />
            <span>Demand Forecast</span>
            <LegendLine solid={false} color="#2980b9" />
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={showPrior}
              onChange={(e) => setShowPrior(e.target.checked)}
            />
            <span>Prior Year</span>
            <span className="prior-swatch" />
          </label>
        </div>
      }
      right={
        <LiftingsChart
          nDays={nDays}
          showActual={showActual}
          showForecast={showForecast}
          showPrior={showPrior}
        />
      }
    />
  );
}

function HistoricalAverageSection() {
  const stats = [
    { period: '7-day',  value: '0.7',  delta: '↓ 0.07%', down: true  },
    { period: '14-day', value: '0.78', delta: '↑ 0.02%', down: false },
    { period: '21-day', value: '0.72', delta: '↓ 0.27%', down: true  },
  ];

  return (
    <div className="section-row historical-row">
      <div className="panel">
        <h3 className="panel-title">
          Historical Average{' '}
          <span className="info-icon" title="Average historical liftings">ⓘ</span>
        </h3>
        <div className="hist-stats">
          {stats.map(({ period, value, delta, down }) => (
            <div key={period} className="hist-stat">
              <div className="hist-period">{period}</div>
              <div className="hist-value">{value}</div>
              <div className={`hist-delta ${down ? 'hist-delta--down' : 'hist-delta--up'}`}>
                {delta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard (root) ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const [viewLength, setViewLength] = useState('14');
  const nDays = Math.min(parseInt(viewLength, 10), ALL_DAYS);

  return (
    <div className="dashboard">
      {/* Page header */}
      <header className="page-header">
        <h1 className="page-title">4/20_planning_west_v1</h1>
        <a href="#scenario-planning" className="back-link">← back to scenario planning</a>
      </header>

      {/* Sticky top bar: view-length control + timeline */}
      <div className="sticky-bar">
        <div className="sticky-left">
          <label className="view-length-label">View Length</label>
          <select
            className="view-length-select"
            value={viewLength}
            onChange={(e) => setViewLength(e.target.value)}
          >
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
          </select>
        </div>
        <div className="sticky-right">
          <TimelineHeader nDays={nDays} />
        </div>
      </div>

      {/* Scrollable main content */}
      <main className="sections">
        <TerminalScheduleSection nDays={nDays} />
        <InventoryDetailsSection nDays={nDays} />
        <LiftingsVsForecastSection nDays={nDays} />
        <HistoricalAverageSection />
      </main>
    </div>
  );
}
