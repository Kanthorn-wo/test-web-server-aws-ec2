import { Area, Bar, ComposedChart, type LabelProps, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Forecast } from './api'
import './HourlyChart.css'

interface HourPoint {
  hour: string
  temperature: number
  rain: number
}

function HourlyTooltip({ active, payload }: { active?: boolean; payload?: { payload: HourPoint }[] }) {
  if (!active || !payload?.length) return null
  const { hour, temperature, rain } = payload[0].payload
  return (
    <div className="hourly-tooltip">
      {hour} · {Math.round(temperature)}° · ฝน {rain}%
    </div>
  )
}

export function HourlyChart({ hourly, currentTime }: { hourly: Forecast['hourly']; currentTime: string }) {
  const startTime = currentTime.slice(0, 13) + ':00'
  const start = Math.max(0, hourly.time.findIndex((time) => time >= startTime))

  const points: HourPoint[] = hourly.time.slice(start, start + 24).map((time, i) => ({
    hour: time.slice(11, 16),
    temperature: hourly.temperature_2m[start + i],
    rain: hourly.precipitation_probability[start + i],
  }))

  const temperatures = points.map((point) => point.temperature)
  const maxIndex = temperatures.indexOf(Math.max(...temperatures))
  const minIndex = temperatures.indexOf(Math.min(...temperatures))

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
      <div className="hourly-chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 24, right: 12, bottom: 0, left: 12 }}>
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
              tick={{ fill: 'var(--ink-soft)', fontSize: 12 }}
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
