import { Area, Bar, ComposedChart, type LabelProps, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Forecast } from './api'
import './HourlyChart.css'

interface HourPoint {
  hour: string
  temperature: number
  rain: number | null
}

function HourlyTooltip({ active, payload }: { active?: boolean; payload?: { payload: HourPoint }[] }) {
  if (!active || !payload?.length) return null
  const { hour, temperature, rain } = payload[0].payload
  return (
    <div className="hourly-tooltip">
      {hour} · {Math.round(temperature)}°{rain !== null && ` · ฝน ${rain}%`}
    </div>
  )
}

export function HourlyChart({ hourly, currentTime }: { hourly: Forecast['hourly']; currentTime: string }) {
  const startTime = currentTime.slice(0, 13) + ':00'
  const start = Math.max(0, hourly.time.findIndex((time) => time >= startTime))

  // Skip hours without a temperature; a missing rain probability is allowed
  const points: HourPoint[] = []
  hourly.time.slice(start, start + 24).forEach((time, i) => {
    const temperature = hourly.temperature_2m[start + i]
    if (temperature === null) return
    points.push({ hour: time.slice(11, 16), temperature, rain: hourly.precipitation_probability[start + i] })
  })

  const temperatures = points.map((point) => point.temperature)
  const maxIndex = temperatures.indexOf(Math.max(...temperatures))
  const minIndex = temperatures.indexOf(Math.min(...temperatures))

  // Text alternative for screen readers, since the chart itself is not readable by them
  const rainChances = points.map((point) => point.rain).filter((rain) => rain !== null)
  const summary =
    `อุณหภูมิ 24 ชั่วโมงข้างหน้า ต่ำสุด ${Math.round(Math.min(...temperatures))} องศา สูงสุด ${Math.round(Math.max(...temperatures))} องศา` +
    (rainChances.length ? ` โอกาสฝนสูงสุด ${Math.max(...rainChances)} เปอร์เซ็นต์` : '')

  // Value label only on the warmest and coolest hour
  function renderExtremeLabel({ x, y, index, value }: LabelProps) {
    if (index !== maxIndex && index !== minIndex) return <g key={index} />
    const dy = index === maxIndex ? -10 : 18
    return (
      <text key={index} x={x} y={Number(y) + dy} textAnchor="middle" className="hourly-extreme">
        {Math.round(Number(value))}°
      </text>
    )
  }

  return (
    <section className="hourly">
      <h2 className="hourly-heading">24 ชั่วโมงข้างหน้า</h2>
      <div className="hourly-chart" role="img" aria-label={summary}>
        <ResponsiveContainer width="100%" height="100%">
          {/* accessibilityLayer off: it adds an unlabeled focus stop (role="application") that the summary above replaces */}
          <ComposedChart data={points} margin={{ top: 24, right: 12, bottom: 0, left: 12 }} accessibilityLayer={false}>
            <defs>
              <linearGradient id="hourly-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--ink)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--ink)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              interval={2}
              tick={{ fill: 'var(--ink-soft)', fontSize: 13 }}
            />
            <YAxis yAxisId="temperature" hide domain={['dataMin - 3', 'dataMax + 3']} />
            {/* Domain wider than 0-100 keeps the rain bars in the lower part, clear of the temperature line */}
            <YAxis yAxisId="rain" hide domain={[0, 250]} />
            <Tooltip
              content={<HourlyTooltip />}
              cursor={{ stroke: 'var(--ink-soft)', strokeWidth: 1 }}
            />
            <Bar yAxisId="rain" dataKey="rain" fill="var(--ink-soft)" fillOpacity={0.25} barSize={3} />
            <Area
              yAxisId="temperature"
              dataKey="temperature"
              type="monotone"
              stroke="var(--ink)"
              strokeWidth={1.5}
              fill="url(#hourly-fill)"
              dot={false}
              activeDot={{ r: 3, fill: 'var(--ink)', stroke: 'none' }}
              label={renderExtremeLabel}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
