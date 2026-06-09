import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { Card, Col, Container, Image, Row } from "../../components/ui/tw";
import { adminGetDocument } from '../../firebase/firebaseAdmin';
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
        <Card className="mb-4 border-0 shadow-lg" style={{
            borderRadius: "25px",
            background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
            color: "white",
            border: "none"
        }}>
            <Card.Body className="p-4">
                <div className="mb-4 flex items-center justify-between pb-2">
                    <div>
                        <h2 className="mb-3 text-6xl font-bold"><strong>{uiRound(props.temp, 1)}°C</strong></h2>
                        <h5 className="mb-2">Roorkee, India</h5>
                        <p className="mb-1 capitalize">{props.weather[0].description}</p>
                        <p className="mb-0 text-xs opacity-75">{dateTimeFormat(props.dt, 0, 'Asia/Kolkata')}</p>
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
        <Card className="mb-4 border-0 shadow-lg" style={{
            borderRadius: "25px",
            background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            color: "#2c3e50",
            border: "none"
        }}>
            <Card.Body className="p-4">
                <h5 className="mb-3 font-semibold">Hourly Forecast</h5>
                <div className="flex justify-around overflow-auto pb-2 text-center">
                    {[...props.hourly].slice(0, 12).map((hrWthr, i) =>
                        <div className="flex min-w-20 flex-col items-center px-2" key={i}>
                            <p className="mb-2 font-semibold">{uiRound(hrWthr.temp, 1)}°C</p>
                            <Image
                                src={'https://openweathermap.org/img/wn/' + hrWthr.weather[0].icon + '@2x.png'}
                                width={50}
                                height={50}
                                alt={hrWthr.weather[0].description}
                            />
                            <p className="mb-0 text-xs">{timeFormat(hrWthr.dt, props.timezone_offset, props.timezone)}</p>
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
        <Card className="mb-4 border-0 shadow-lg" style={{
            borderRadius: "25px",
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            color: "#2c3e50",
            border: "none"
        }}>
            <Card.Body className="p-4">
                <h5 className="mb-3 font-semibold">7-Day Forecast</h5>
                <div className="flex justify-around overflow-auto pb-2 text-center">
                    {[...props.daily].slice(0, 7).map((dlWthr, i) =>
                        <div className="flex min-w-20 flex-col items-center px-2" key={i}>
                            <p className="mb-2 font-semibold">{uiRound(dlWthr.temp.day, 1)}°C</p>
                            <Image
                                src={'https://openweathermap.org/img/wn/' + dlWthr.weather[0].icon + '@2x.png'}
                                width={50}
                                height={50}
                                alt={dlWthr.weather[0].description}
                            />
                            <p className="mb-0 text-xs font-semibold">{dayOfWeekFormat(dlWthr.dt, props.timezone_offset, props.timezone)}</p>
                            <p className="mb-0 text-xs opacity-75">{uiRound(dlWthr.temp.min, 0)}° / {uiRound(dlWthr.temp.max, 0)}°</p>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    )
}

export default function Weather({ weather, lastUpdated }: InferGetStaticPropsType<typeof getStaticProps>) {
    if (!weather) {
        return (
            <Container fluid className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#C1CFEA' }}>
                <Head>
                    <title>Weather - Roorkee</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <div className="text-center">
                    <h4 className="text-rose-600">Weather data not found</h4>
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
            <Row className="justify-center">
                <Col xs={12} md={10} lg={8} xl={6}>
                    <CurrentWeatherWidget {...weather.current} />
                    <HourlyWeatherWidget {...weather} />
                    <DailyWeatherWidget {...weather} />
                    <p className="mb-0 text-center text-xs" style={{ color: '#00695c' }}>Last updated at {lastUpdated}</p>
                </Col>
            </Row>
        </Container>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: { id: 'roorkee-in' } }],
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<{ weather: Weather | null; lastUpdated: string }> = async () => {
    const weather = await adminGetDocument<Weather>('weather', 'roorkee-in');
    return {
        props: {
            weather: weather ?? null,
            lastUpdated: uiDateFormat(Date.now()),
        },
        revalidate: 3600, // regenerate page every hour
    };
};