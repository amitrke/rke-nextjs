import { Container, Row, Col, Carousel, Image } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { getDocument } from '../../firebase/firestore';
import { uiRound } from '../../components/ui/uiUtils';

function dateTimeFormat(date: number, timezone_offset: number, timeZone: string): string {
    const d = new Date((date + timezone_offset) * 1000);
    return d.toLocaleString('en-IN', { timeZone });
}

function timeFormat(date: number, timezone_offset: number, timeZone: string): string {
    const d = new Date((date + timezone_offset) * 1000);
    return d.toLocaleString('en-IN', {hour: '2-digit', minute:'2-digit', timeZone });
}

function dayOfWeekFormat(date: number, timezone_offset: number, timeZone: string): string {
    const d = new Date((date + timezone_offset) * 1000);
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

type Weather = {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: CurrentWeather;
    hourly: HourlyWeather[];
    daily: DailyWeather[];
}

export default function Weather(props: Weather) {
    // console.log(props);
    return (
        <Container fluid className="vh-100" style={{ backgroundColor: '#C1CFEA' }}>
            <Row className="h-100 d-flex justify-content-center align-items-center" style={{ color: '#282828' }}>
                <Col md={9} lg={7} xl={5}>
                    <div className="card mb-4 gradient-custom" style={{ borderRadius: "25px" }}>
                        <div className="card-body p-4">
                            <Carousel id="demo1" interval={null} slide={false}>
                                <Carousel.Item>
                                    <div className="d-flex justify-content-between mb-4 pb-2">
                                        <div>
                                            <h2 className="display-2"><strong>{uiRound(props.current.temp, 1)}°C</strong></h2>
                                            <p className="text-muted mb-0">Roorkee, India.</p>
                                            <p className="text-muted mb-0">{props.current.weather[0].description}</p>
                                            <p className="text-muted mb-0">{dateTimeFormat(props.current.dt, props.timezone_offset, props.timezone)}</p>
                                        </div>
                                        <div>
                                            <Image src={'https://openweathermap.org/img/wn/' + props.current.weather[0].icon + '@2x.png'} />
                                        </div>
                                    </div>
                                </Carousel.Item>
                            </Carousel>
                        </div>
                    </div>
                    <Card className="mb-4" style={{ borderRadius: '25px' }}>
                        <Card.Body className="p-4">
                            <div id="demo2" className="carousel slide" data-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <div className="d-flex justify-content-around text-center mb-4 pb-3 pt-2">
                                            {[...props.hourly].slice(1, 7).map((hrWthr, i) =>
                                                <div className="flex-column" key={i}>
                                                    <p className="small"><strong>{uiRound(hrWthr.temp, 1)}°C</strong></p>
                                                    <Image src={'https://openweathermap.org/img/wn/' + hrWthr.weather[0].icon + '@2x.png'} />
                                                    <p className="mb-0"><strong>{timeFormat(hrWthr.dt, props.timezone_offset, props.timezone)}</strong></p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Carousel style={{ borderRadius: 25 }}>
                        <Carousel.Item>
                            <div className="d-flex justify-content-around text-center mb-4 pb-3 pt-2">
                            {[...props.daily].slice(1, 6).map((dlWthr, i) =>
                                <div className="flex-column" key={i}>
                                    <p className="small"><strong>{uiRound(dlWthr.temp.day, 1)}°C</strong></p>
                                    <Image src={'https://openweathermap.org/img/wn/' + dlWthr.weather[0].icon + '@2x.png'} />
                                    <p className="mb-0"><strong>{dayOfWeekFormat(dlWthr.dt, props.timezone_offset, props.timezone)}</strong></p>
                                </div>
                            )}
                            </div>
                        </Carousel.Item>
                    </Carousel>
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