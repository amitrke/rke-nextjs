import { Container, Row, Col, Carousel, Image } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { getDocument } from '../../firebase/firestore';
import { uiRound } from '../../components/ui/uiUtils';
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
        <Card className="mb-4 gradient-custom" style={{ borderRadius: "25px" }}>
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between mb-4 pb-2">
                    <div>
                        <h2 className="display-2"><strong>{uiRound(props.temp, 1)}°C</strong></h2>
                        <p className="text-muted mb-0">Roorkee, India.</p>
                        <p className="text-muted mb-0">{props.weather[0].description}</p>
                        <p className="text-muted mb-0">{dateTimeFormat(props.dt, 0, 'Asia/Kolkata')}</p>
                    </div>
                    <div>
                        <Image src={'https://openweathermap.org/img/wn/' + props.weather[0].icon + '@2x.png'} />
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

function divClass(i: number) {
    let divClass = "flex-column ";
    if (i > 2) {
        divClass += "d-none ";
    }
    if (i >= 3 && i <= 5) {
        divClass += "d-md-block";
    }
    if (i >= 6 && i <= 8) {
        divClass += "d-lg-block";
    }
    if (i >= 9 && i <= 11) {
        divClass += "d-xl-block";
    }
    return divClass;
}

//Hourly Weather Widget
function HourlyWeatherWidget(props: Weather) {
    return (
        <Card className="mb-4 gradient-custom" style={{ borderRadius: "25px" }}>
            <Card.Body className="p-4">
                <div className="d-flex justify-content-around text-center mb-4 pb-3 pt-2">
                    {[...props.hourly].map((hrWthr, i) =>
                        // Hide div for small screens when i > 2
                        <div className={divClass(i)} key={i}>
                            <p className="small"><strong>{uiRound(hrWthr.temp, 1)}°C</strong></p>
                            <Image src={'https://openweathermap.org/img/wn/' + hrWthr.weather[0].icon + '@2x.png'} />
                            <p className="mb-0"><strong>{timeFormat(hrWthr.dt, props.timezone_offset, props.timezone)}</strong></p>
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
        <Card className="mb-4 gradient-custom" style={{ borderRadius: "25px" }}>
            <Card.Body className="p-4">
                <div className="d-flex justify-content-around text-center mb-4 pb-3 pt-2">
                    {[...props.daily].map((dlWthr, i) =>
                        <div className={divClass(i)} key={i}>
                            <p className="small"><strong>{uiRound(dlWthr.temp.day, 1)}°C</strong></p>
                            <Image src={'https://openweathermap.org/img/wn/' + dlWthr.weather[0].icon + '@2x.png'} />
                            <p className="mb-0"><strong>{dayOfWeekFormat(dlWthr.dt, props.timezone_offset, props.timezone)}</strong></p>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    )
}

export default function Weather(props: Weather) {
    return (
        <Container fluid className="vh-100" style={{ backgroundColor: '#C1CFEA' }}>
            <Head>
                <title>Weather.</title>
                <meta property="og:title" content="Weather" key="title" />
            </Head>
            <Row className="h-100 d-flex justify-content-center align-items-center" style={{ color: '#282828' }}>
                <Col>
                    <CurrentWeatherWidget {...props.current} />
                    <HourlyWeatherWidget {...props} />
                    <DailyWeatherWidget {...props} />
                </Col>
            </Row>
        </Container>
    )
}

export async function getServerSideProps({ req, res, query }) {
    const { id } = query
    if (typeof (id) !== 'string') return;
    const weatherDoc = await getDocument<Weather>({ path: `weather`, pathSegments: [id] })
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=59'
    )

    return {
        props: weatherDoc
    }
}