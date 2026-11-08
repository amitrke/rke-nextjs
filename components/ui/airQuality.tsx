import { Card } from './tw';

// Mirrors `AirQuality` in rke-firebase-functions/functions/src/model/types.ts,
// stored as `airQuality` on the `weather/roorkee-in` document. The AQI is
// India's National Air Quality Index (CPCB), 0–500.
export type AqiPollutant = 'pm2_5' | 'pm10' | 'no2' | 'o3' | 'co' | 'so2' | 'nh3';
export type AqiCategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';

export type AirQuality = {
    dt: number;
    aqi: number;
    category: AqiCategory;
    dominantPollutant: AqiPollutant;
    subIndices: Partial<Record<AqiPollutant, number>>;
    basis: '24h' | 'current';
    owmIndex: number;
    /** Latest concentrations, all µg/m³ (as reported by OpenWeatherMap). */
    components: Partial<Record<AqiPollutant | 'no', number>>;
};

// CPCB's official colour for each band, with a readable text colour on top.
const CATEGORY_STYLE: Record<AqiCategory, { bg: string; fg: string; advice: string }> = {
    'Good': { bg: '#00B050', fg: '#ffffff', advice: 'Minimal health impact.' },
    'Satisfactory': { bg: '#92D050', fg: '#1f2937', advice: 'Minor breathing discomfort for sensitive people.' },
    'Moderate': { bg: '#FFFF00', fg: '#1f2937', advice: 'Breathing discomfort for people with asthma or lung disease, and discomfort for people with heart disease, children and older adults.' },
    'Poor': { bg: '#FF9900', fg: '#1f2937', advice: 'Breathing discomfort for most people on prolonged exposure. Limit long or strenuous outdoor activity.' },
    'Very Poor': { bg: '#FF0000', fg: '#ffffff', advice: 'Respiratory illness likely on prolonged exposure. Avoid outdoor exertion.' },
    'Severe': { bg: '#C00000', fg: '#ffffff', advice: 'Affects healthy people and seriously affects people with lung or heart disease. Stay indoors where possible.' },
};

const POLLUTANT_LABEL: Record<AqiPollutant, string> = {
    pm2_5: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO₂',
    o3: 'O₃',
    co: 'CO',
    so2: 'SO₂',
    nh3: 'NH₃',
};

// Same bands the backend uses (CPCB): 0–50, 51–100, 101–200, 201–300, 301–400, 401–500.
export const categoryForIndex = (index: number): AqiCategory => {
    if (index <= 50) return 'Good';
    if (index <= 100) return 'Satisfactory';
    if (index <= 200) return 'Moderate';
    if (index <= 300) return 'Poor';
    if (index <= 400) return 'Very Poor';
    return 'Severe';
};

// Bar fill for a sub-index; pure yellow is too faint on a light track.
const barColour = (index: number): string => {
    const bg = categoryStyle(categoryForIndex(index)).bg;
    return bg === '#FFFF00' ? '#d4c400' : bg;
};

export const categoryStyle = (category: AqiCategory) => CATEGORY_STYLE[category] ?? CATEGORY_STYLE['Moderate'];
export const pollutantLabel = (pollutant: AqiPollutant) => POLLUTANT_LABEL[pollutant] ?? pollutant;

// CO is shown in mg/m³ (the unit the index uses); everything else in µg/m³.
const formatConcentration = (pollutant: AqiPollutant, value?: number): string => {
    if (value === undefined || !Number.isFinite(value)) return '';
    return pollutant === 'co' ? `${(value / 1000).toFixed(2)} mg/m³` : `${Math.round(value)} µg/m³`;
};

/** Small pill for compact spots, e.g. the homepage weather box. */
export function AqiBadge({ airQuality }: { airQuality: AirQuality }) {
    const style = categoryStyle(airQuality.category);
    return (
        <span
            className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: style.bg, color: style.fg }}
            title={`Air Quality Index ${airQuality.aqi}: ${airQuality.category}`}
        >
            AQI {airQuality.aqi} · {airQuality.category}
        </span>
    );
}

export function AirQualityWidget({ airQuality, updatedAt }: { airQuality: AirQuality; updatedAt: string }) {
    const style = categoryStyle(airQuality.category);
    const pollutants = (Object.entries(airQuality.subIndices) as [AqiPollutant, number][])
        .filter(([, index]) => Number.isFinite(index))
        .sort((a, b) => b[1] - a[1]);

    return (
        <Card className="mb-4 border-0 shadow-lg" style={{ borderRadius: '25px', background: '#ffffff', color: '#2c3e50', border: 'none' }}>
            <Card.Body className="p-4">
                <h2 className="mb-3 text-xl font-semibold">Air Quality in Roorkee</h2>
                <div className="mb-3 flex items-center gap-4">
                    <div
                        className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full"
                        style={{ backgroundColor: style.bg, color: style.fg }}
                    >
                        <span className="text-3xl font-bold leading-none">{airQuality.aqi}</span>
                        <span className="text-xs font-semibold">AQI</span>
                    </div>
                    <div>
                        <p className="mb-1 text-2xl font-bold">{airQuality.category}</p>
                        <p className="mb-1 text-sm">Main pollutant: <strong>{pollutantLabel(airQuality.dominantPollutant)}</strong></p>
                        <p className="mb-0 text-sm">{style.advice}</p>
                    </div>
                </div>

                {pollutants.length > 0 && (
                    <div className="mt-2">
                        <h3 className="mb-2 text-sm font-semibold">Pollutant sub-indices</h3>
                        <ul className="mb-0 list-none space-y-2 p-0">
                            {pollutants.map(([pollutant, index]) => (
                                <li key={pollutant} className="text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">{pollutantLabel(pollutant)}</span>
                                        <span className="text-slate-600">
                                            {index}
                                            {airQuality.components[pollutant] !== undefined && (
                                                <span className="ml-2 text-xs">({formatConcentration(pollutant, airQuality.components[pollutant])})</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-200" aria-hidden="true">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{ width: `${Math.max(2, Math.min(100, (index / 500) * 100))}%`, backgroundColor: barColour(index) }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <p className="mb-0 mt-3 text-xs text-slate-500">
                    India&apos;s National AQI (CPCB, 0–500),{' '}
                    {airQuality.basis === '24h' ? 'based on the last 24 hours of readings' : 'based on the latest reading'}.
                    {' '}Updated {updatedAt}.
                </p>
            </Card.Body>
        </Card>
    );
}
