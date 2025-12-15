import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { getDocument } from '../../firebase/firestore';
import { uiRound, uiDateFormat } from '../../components/ui/uiUtils';
import Head from 'next/head';

function dateTimeFormat(date: number, timezone_offset: number, timeZone: string): string {
    const d = new Date(date * 1000);
    return d.toLocaleString('en-IN', { timeZone, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeFormat(date: number, timezone_offset: number, timeZone: string): string {
    const d = new Date(date * 1000);
    return d.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone });
}

function dayOfWeekFormat(date: number, timezone_offset: number, timeZone: string): string {
    const d = new Date(date * 1000);
    return d.toLocaleString('en-IN', { timeZone, weekday: 'short' });
}

type WeatherSummary = {
    id: number;
    main: string;
    description: string;
    icon: string;
}

type CommonWeather = {
    dt: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: WeatherSummary[];
}

type HourlyWeather = CommonWeather & {
    temp: number;
}

type DailyWeather = CommonWeather & {
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: {
        day: number;
        min: number;
        max: number;
        night: number;
        eve: number;
        morn: number;
    };
    wind_gust: number;
    pop: number;
    rain?: number;
}

type CurrentWeather = CommonWeather & {
    sunrise: number;
    sunset: number;
    temp: number;
}

export type Weather = {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: CurrentWeather;
    hourly: HourlyWeather[];
    daily: DailyWeather[];
}

//Current Weather Widget
function CurrentWeatherWidget(props: CurrentWeather) {
    return (
        <Card className="mb-4 shadow-lg" style={{
            borderRadius: "25px",
            background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
            color: "white",
            border: "none"
        }}>
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
                    <div>
                        <h2 className="display-2 mb-3"><strong>{uiRound(props.temp, 1)}°C</strong></h2>
                        <h5 className="mb-2">Roorkee, India</h5>
                        <p className="mb-1 text-capitalize">{props.weather[0].description}</p>
                        <p className="mb-0 small opacity-75">{dateTimeFormat(props.dt, 0, 'Asia/Kolkata')}</p>
                    </div>
                    <div>
                        <Image
                            src={'https://openweathermap.org/img/wn/' + props.weather[0].icon + '@4x.png'}
                            width={120}
                            height={120}
                            alt={props.weather[0].description}
                        />
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

//Hourly Weather Widget
function HourlyWeatherWidget(props: Weather) {
    return (
        <Card className="mb-4 shadow-lg" style={{
            borderRadius: "25px",
            background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            color: "#2c3e50",
            border: "none"
        }}>
            <Card.Body className="p-4">
                <h5 className="mb-3 fw-bold">Hourly Forecast</h5>
                <div className="d-flex justify-content-around text-center overflow-auto pb-2">
                    {[...props.hourly].slice(0, 12).map((hrWthr, i) =>
                        <div className="d-flex flex-column align-items-center px-2" key={i} style={{ minWidth: "80px" }}>
                            <p className="mb-2 fw-bold">{uiRound(hrWthr.temp, 1)}°C</p>
                            <Image
                                src={'https://openweathermap.org/img/wn/' + hrWthr.weather[0].icon + '@2x.png'}
                                width={50}
                                height={50}
                                alt={hrWthr.weather[0].description}
                            />
                            <p className="mb-0 small">{timeFormat(hrWthr.dt, props.timezone_offset, props.timezone)}</p>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    )
}

//Daily Weather Widget
function DailyWeatherWidget(props: Weather) {
    return (
        <Card className="mb-4 shadow-lg" style={{
            borderRadius: "25px",
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            color: "#2c3e50",
            border: "none"
        }}>
            <Card.Body className="p-4">
                <h5 className="mb-3 fw-bold">7-Day Forecast</h5>
                <div className="d-flex justify-content-around text-center overflow-auto pb-2">
                    {[...props.daily].slice(0, 7).map((dlWthr, i) =>
                        <div className="d-flex flex-column align-items-center px-2" key={i} style={{ minWidth: "80px" }}>
                            <p className="mb-2 fw-bold">{uiRound(dlWthr.temp.day, 1)}°C</p>
                            <Image
                                src={'https://openweathermap.org/img/wn/' + dlWthr.weather[0].icon + '@2x.png'}
                                width={50}
                                height={50}
                                alt={dlWthr.weather[0].description}
                            />
                            <p className="mb-0 small fw-semibold">{dayOfWeekFormat(dlWthr.dt, props.timezone_offset, props.timezone)}</p>
                            <p className="mb-0 small opacity-75">{uiRound(dlWthr.temp.min, 0)}° / {uiRound(dlWthr.temp.max, 0)}°</p>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    )
}

export default function Weather() {
    const router = useRouter();
    const { id } = router.query;
    const [weather, setWeather] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        if (!id) return;

        const fetchWeather = async () => {
            try {
                setLoading(true);
                setError(null);
                const weatherData = await getDocument<Weather>({
                    path: `weather`,
                    pathSegments: [id as string]
                });
                setWeather(weatherData);
                setLastUpdated(uiDateFormat((new Date()).getTime()));
            } catch (err) {
                setError("Failed to load weather data. Please try again later.");
                console.error("Error fetching weather:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [id]);

    if (loading) {
        return (
            <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#C1CFEA' }}>
                <Head>
                    <title>Weather - Roorkee</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error || !weather) {
        return (
            <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#C1CFEA' }}>
                <Head>
                    <title>Weather - Roorkee</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <div className="text-center">
                    <h4 className="text-danger">{error || "Weather data not found"}</h4>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="py-5" style={{
            background: "linear-gradient(to bottom, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)",
            minHeight: '100vh'
        }}>
            <Head>
                <title>Weather - Roorkee</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={10} lg={8} xl={6}>
                    <CurrentWeatherWidget {...weather.current} />
                    <HourlyWeatherWidget {...weather} />
                    <DailyWeatherWidget {...weather} />
                    <p className="text-center small mb-0" style={{ color: '#00695c' }}>Last updated at {lastUpdated}</p>
                </Col>
            </Row>
        </Container>
    )
}