import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons';
import { getDocument } from '../../firebase/firestore';

const sampleWeather = {
    "lat": 29.8667,
    "lon": 77.8833,
    "timezone": "Asia/Kolkata",
    "timezone_offset": 19800,
    "current": {
        "dt": 1679093799,
        "sunrise": 1679100934,
        "sunset": 1679144274,
        "temp": 18.74,
        "feels_like": 18.13,
        "pressure": 1011,
        "humidity": 56,
        "dew_point": 9.79,
        "uvi": 0,
        "clouds": 98,
        "visibility": 10000,
        "wind_speed": 1.45,
        "wind_deg": 86,
        "wind_gust": 1.71,
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04n"
            }
        ]
    },
    "minutely": [
        {
            "dt": 1679093820,
            "precipitation": 0
        },
        {
            "dt": 1679093880,
            "precipitation": 0
        },
        {
            "dt": 1679093940,
            "precipitation": 0
        },
        {
            "dt": 1679094000,
            "precipitation": 0
        },
        {
            "dt": 1679094060,
            "precipitation": 0
        },
        {
            "dt": 1679094120,
            "precipitation": 0
        },
        {
            "dt": 1679094180,
            "precipitation": 0
        },
        {
            "dt": 1679094240,
            "precipitation": 0
        },
        {
            "dt": 1679094300,
            "precipitation": 0
        },
        {
            "dt": 1679094360,
            "precipitation": 0
        },
        {
            "dt": 1679094420,
            "precipitation": 0
        },
        {
            "dt": 1679094480,
            "precipitation": 0
        },
        {
            "dt": 1679094540,
            "precipitation": 0
        },
        {
            "dt": 1679094600,
            "precipitation": 0
        },
        {
            "dt": 1679094660,
            "precipitation": 0
        },
        {
            "dt": 1679094720,
            "precipitation": 0
        },
        {
            "dt": 1679094780,
            "precipitation": 0
        },
        {
            "dt": 1679094840,
            "precipitation": 0
        },
        {
            "dt": 1679094900,
            "precipitation": 0
        },
        {
            "dt": 1679094960,
            "precipitation": 0
        },
        {
            "dt": 1679095020,
            "precipitation": 0
        },
        {
            "dt": 1679095080,
            "precipitation": 0
        },
        {
            "dt": 1679095140,
            "precipitation": 0
        },
        {
            "dt": 1679095200,
            "precipitation": 0
        },
        {
            "dt": 1679095260,
            "precipitation": 0
        },
        {
            "dt": 1679095320,
            "precipitation": 0
        },
        {
            "dt": 1679095380,
            "precipitation": 0
        },
        {
            "dt": 1679095440,
            "precipitation": 0
        },
        {
            "dt": 1679095500,
            "precipitation": 0
        },
        {
            "dt": 1679095560,
            "precipitation": 0
        },
        {
            "dt": 1679095620,
            "precipitation": 0
        },
        {
            "dt": 1679095680,
            "precipitation": 0
        },
        {
            "dt": 1679095740,
            "precipitation": 0
        },
        {
            "dt": 1679095800,
            "precipitation": 0
        },
        {
            "dt": 1679095860,
            "precipitation": 0
        },
        {
            "dt": 1679095920,
            "precipitation": 0
        },
        {
            "dt": 1679095980,
            "precipitation": 0
        },
        {
            "dt": 1679096040,
            "precipitation": 0
        },
        {
            "dt": 1679096100,
            "precipitation": 0
        },
        {
            "dt": 1679096160,
            "precipitation": 0
        },
        {
            "dt": 1679096220,
            "precipitation": 0
        },
        {
            "dt": 1679096280,
            "precipitation": 0
        },
        {
            "dt": 1679096340,
            "precipitation": 0
        },
        {
            "dt": 1679096400,
            "precipitation": 0
        },
        {
            "dt": 1679096460,
            "precipitation": 0
        },
        {
            "dt": 1679096520,
            "precipitation": 0
        },
        {
            "dt": 1679096580,
            "precipitation": 0
        },
        {
            "dt": 1679096640,
            "precipitation": 0
        },
        {
            "dt": 1679096700,
            "precipitation": 0
        },
        {
            "dt": 1679096760,
            "precipitation": 0
        },
        {
            "dt": 1679096820,
            "precipitation": 0
        },
        {
            "dt": 1679096880,
            "precipitation": 0
        },
        {
            "dt": 1679096940,
            "precipitation": 0
        },
        {
            "dt": 1679097000,
            "precipitation": 0
        },
        {
            "dt": 1679097060,
            "precipitation": 0
        },
        {
            "dt": 1679097120,
            "precipitation": 0
        },
        {
            "dt": 1679097180,
            "precipitation": 0
        },
        {
            "dt": 1679097240,
            "precipitation": 0
        },
        {
            "dt": 1679097300,
            "precipitation": 0
        },
        {
            "dt": 1679097360,
            "precipitation": 0
        },
        {
            "dt": 1679097420,
            "precipitation": 0
        }
    ],
    "hourly": [
        {
            "dt": 1679090400,
            "temp": 18.65,
            "feels_like": 18.06,
            "pressure": 1011,
            "humidity": 57,
            "dew_point": 9.97,
            "uvi": 0,
            "clouds": 98,
            "visibility": 10000,
            "wind_speed": 1.92,
            "wind_deg": 64,
            "wind_gust": 1.97,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.32
        },
        {
            "dt": 1679094000,
            "temp": 18.74,
            "feels_like": 18.13,
            "pressure": 1011,
            "humidity": 56,
            "dew_point": 9.79,
            "uvi": 0,
            "clouds": 98,
            "visibility": 10000,
            "wind_speed": 1.45,
            "wind_deg": 86,
            "wind_gust": 1.71,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.33
        },
        {
            "dt": 1679097600,
            "temp": 18.76,
            "feels_like": 18.13,
            "pressure": 1011,
            "humidity": 55,
            "dew_point": 9.54,
            "uvi": 0,
            "clouds": 98,
            "visibility": 10000,
            "wind_speed": 0.89,
            "wind_deg": 151,
            "wind_gust": 1.22,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.32
        },
        {
            "dt": 1679101200,
            "temp": 18.76,
            "feels_like": 18.18,
            "pressure": 1012,
            "humidity": 57,
            "dew_point": 10.07,
            "uvi": 0,
            "clouds": 99,
            "visibility": 10000,
            "wind_speed": 0.61,
            "wind_deg": 204,
            "wind_gust": 0.83,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.26
        },
        {
            "dt": 1679104800,
            "temp": 19,
            "feels_like": 18.47,
            "pressure": 1013,
            "humidity": 58,
            "dew_point": 10.56,
            "uvi": 0.15,
            "clouds": 99,
            "visibility": 10000,
            "wind_speed": 1.44,
            "wind_deg": 285,
            "wind_gust": 1.89,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.33
        },
        {
            "dt": 1679108400,
            "temp": 19.61,
            "feels_like": 19.19,
            "pressure": 1014,
            "humidity": 60,
            "dew_point": 11.64,
            "uvi": 0.53,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.99,
            "wind_deg": 329,
            "wind_gust": 2.73,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.35
        },
        {
            "dt": 1679112000,
            "temp": 20.15,
            "feels_like": 19.79,
            "pressure": 1015,
            "humidity": 60,
            "dew_point": 12.03,
            "uvi": 2.6,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 4.25,
            "wind_deg": 14,
            "wind_gust": 5.78,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.39
        },
        {
            "dt": 1679115600,
            "temp": 21.42,
            "feels_like": 21,
            "pressure": 1015,
            "humidity": 53,
            "dew_point": 11.32,
            "uvi": 4.16,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 5.34,
            "wind_deg": 28,
            "wind_gust": 6.65,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.27
        },
        {
            "dt": 1679119200,
            "temp": 24.01,
            "feels_like": 23.54,
            "pressure": 1014,
            "humidity": 41,
            "dew_point": 9.76,
            "uvi": 5.32,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 3.88,
            "wind_deg": 43,
            "wind_gust": 4.49,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.25
        },
        {
            "dt": 1679122800,
            "temp": 26.29,
            "feels_like": 26.29,
            "pressure": 1013,
            "humidity": 33,
            "dew_point": 8.76,
            "uvi": 7.32,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 2.18,
            "wind_deg": 65,
            "wind_gust": 3.12,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.11
        },
        {
            "dt": 1679126400,
            "temp": 28.32,
            "feels_like": 27.24,
            "pressure": 1011,
            "humidity": 28,
            "dew_point": 7.94,
            "uvi": 6.5,
            "clouds": 100,
            "visibility": 10000,
            "wind_speed": 1.54,
            "wind_deg": 62,
            "wind_gust": 2.99,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.11
        },
        {
            "dt": 1679130000,
            "temp": 29.76,
            "feels_like": 28.19,
            "pressure": 1010,
            "humidity": 24,
            "dew_point": 7.25,
            "uvi": 4.74,
            "clouds": 94,
            "visibility": 10000,
            "wind_speed": 1.21,
            "wind_deg": 57,
            "wind_gust": 2.25,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.11
        },
        {
            "dt": 1679133600,
            "temp": 29.93,
            "feels_like": 28.29,
            "pressure": 1009,
            "humidity": 23,
            "dew_point": 6.79,
            "uvi": 2.19,
            "clouds": 85,
            "visibility": 10000,
            "wind_speed": 1.57,
            "wind_deg": 65,
            "wind_gust": 1.86,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.07
        },
        {
            "dt": 1679137200,
            "temp": 28.76,
            "feels_like": 27.48,
            "pressure": 1008,
            "humidity": 26,
            "dew_point": 7.16,
            "uvi": 0.89,
            "clouds": 80,
            "visibility": 10000,
            "wind_speed": 3.82,
            "wind_deg": 82,
            "wind_gust": 3.1,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.05
        },
        {
            "dt": 1679140800,
            "temp": 26.87,
            "feels_like": 26.34,
            "pressure": 1008,
            "humidity": 30,
            "dew_point": 7.93,
            "uvi": 0.2,
            "clouds": 79,
            "visibility": 10000,
            "wind_speed": 4.25,
            "wind_deg": 77,
            "wind_gust": 4.99,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.05
        },
        {
            "dt": 1679144400,
            "temp": 22.87,
            "feels_like": 22.34,
            "pressure": 1009,
            "humidity": 43,
            "dew_point": 9.58,
            "uvi": 0,
            "clouds": 88,
            "visibility": 10000,
            "wind_speed": 0.35,
            "wind_deg": 48,
            "wind_gust": 3.56,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "pop": 0.43,
            "rain": {
                "1h": 0.18
            }
        },
        {
            "dt": 1679148000,
            "temp": 19.58,
            "feels_like": 19.19,
            "pressure": 1010,
            "humidity": 61,
            "dew_point": 11.55,
            "uvi": 0,
            "clouds": 82,
            "visibility": 10000,
            "wind_speed": 4.8,
            "wind_deg": 296,
            "wind_gust": 8.43,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.38
        },
        {
            "dt": 1679151600,
            "temp": 18.14,
            "feels_like": 17.86,
            "pressure": 1011,
            "humidity": 71,
            "dew_point": 12.53,
            "uvi": 0,
            "clouds": 88,
            "visibility": 10000,
            "wind_speed": 5.07,
            "wind_deg": 324,
            "wind_gust": 10.24,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.3
        },
        {
            "dt": 1679155200,
            "temp": 17.97,
            "feels_like": 17.65,
            "pressure": 1011,
            "humidity": 70,
            "dew_point": 12.26,
            "uvi": 0,
            "clouds": 90,
            "visibility": 10000,
            "wind_speed": 5.14,
            "wind_deg": 358,
            "wind_gust": 10.67,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.23
        },
        {
            "dt": 1679158800,
            "temp": 18.07,
            "feels_like": 17.63,
            "pressure": 1011,
            "humidity": 65,
            "dew_point": 11.28,
            "uvi": 0,
            "clouds": 92,
            "visibility": 10000,
            "wind_speed": 2.57,
            "wind_deg": 23,
            "wind_gust": 5.11,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.18
        },
        {
            "dt": 1679162400,
            "temp": 17.86,
            "feels_like": 17.32,
            "pressure": 1010,
            "humidity": 62,
            "dew_point": 10.19,
            "uvi": 0,
            "clouds": 91,
            "visibility": 10000,
            "wind_speed": 1.34,
            "wind_deg": 7,
            "wind_gust": 2.33,
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.17
        },
        {
            "dt": 1679166000,
            "temp": 17.67,
            "feels_like": 17.03,
            "pressure": 1009,
            "humidity": 59,
            "dew_point": 9.3,
            "uvi": 0,
            "clouds": 58,
            "visibility": 10000,
            "wind_speed": 2.39,
            "wind_deg": 27,
            "wind_gust": 2.78,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679169600,
            "temp": 17.67,
            "feels_like": 16.93,
            "pressure": 1009,
            "humidity": 55,
            "dew_point": 8.34,
            "uvi": 0,
            "clouds": 71,
            "visibility": 10000,
            "wind_speed": 2.34,
            "wind_deg": 28,
            "wind_gust": 2.57,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679173200,
            "temp": 17.65,
            "feels_like": 16.85,
            "pressure": 1009,
            "humidity": 53,
            "dew_point": 7.84,
            "uvi": 0,
            "clouds": 80,
            "visibility": 10000,
            "wind_speed": 2.13,
            "wind_deg": 35,
            "wind_gust": 2.13,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.1
        },
        {
            "dt": 1679176800,
            "temp": 17.46,
            "feels_like": 16.65,
            "pressure": 1009,
            "humidity": 53,
            "dew_point": 7.72,
            "uvi": 0,
            "clouds": 84,
            "visibility": 10000,
            "wind_speed": 1.51,
            "wind_deg": 64,
            "wind_gust": 1.86,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.31
        },
        {
            "dt": 1679180400,
            "temp": 16.62,
            "feels_like": 15.8,
            "pressure": 1009,
            "humidity": 56,
            "dew_point": 7.62,
            "uvi": 0,
            "clouds": 78,
            "visibility": 10000,
            "wind_speed": 0.94,
            "wind_deg": 66,
            "wind_gust": 1.03,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.35
        },
        {
            "dt": 1679184000,
            "temp": 16.33,
            "feels_like": 15.51,
            "pressure": 1010,
            "humidity": 57,
            "dew_point": 7.62,
            "uvi": 0,
            "clouds": 72,
            "visibility": 10000,
            "wind_speed": 1.74,
            "wind_deg": 35,
            "wind_gust": 1.74,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0.37
        },
        {
            "dt": 1679187600,
            "temp": 15.89,
            "feels_like": 15.1,
            "pressure": 1011,
            "humidity": 60,
            "dew_point": 8.11,
            "uvi": 0,
            "clouds": 42,
            "visibility": 10000,
            "wind_speed": 2.12,
            "wind_deg": 25,
            "wind_gust": 2.18,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "pop": 0.3,
            "rain": {
                "1h": 0.14
            }
        },
        {
            "dt": 1679191200,
            "temp": 18.14,
            "feels_like": 17.39,
            "pressure": 1011,
            "humidity": 53,
            "dew_point": 8.19,
            "uvi": 0.49,
            "clouds": 52,
            "visibility": 10000,
            "wind_speed": 2.1,
            "wind_deg": 32,
            "wind_gust": 3.04,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04d"
                }
            ],
            "pop": 0.25
        },
        {
            "dt": 1679194800,
            "temp": 22.13,
            "feels_like": 21.44,
            "pressure": 1011,
            "humidity": 40,
            "dew_point": 7.49,
            "uvi": 1.72,
            "clouds": 45,
            "visibility": 10000,
            "wind_speed": 1.89,
            "wind_deg": 55,
            "wind_gust": 2.35,
            "weather": [
                {
                    "id": 802,
                    "main": "Clouds",
                    "description": "scattered clouds",
                    "icon": "03d"
                }
            ],
            "pop": 0.18
        },
        {
            "dt": 1679198400,
            "temp": 25.64,
            "feels_like": 25.07,
            "pressure": 1011,
            "humidity": 31,
            "dew_point": 7.29,
            "uvi": 3.69,
            "clouds": 46,
            "visibility": 10000,
            "wind_speed": 1.33,
            "wind_deg": 101,
            "wind_gust": 1.41,
            "weather": [
                {
                    "id": 802,
                    "main": "Clouds",
                    "description": "scattered clouds",
                    "icon": "03d"
                }
            ],
            "pop": 0.18
        },
        {
            "dt": 1679202000,
            "temp": 28.28,
            "feels_like": 27.21,
            "pressure": 1011,
            "humidity": 28,
            "dew_point": 7.73,
            "uvi": 5.88,
            "clouds": 40,
            "visibility": 10000,
            "wind_speed": 1.68,
            "wind_deg": 172,
            "wind_gust": 1.64,
            "weather": [
                {
                    "id": 802,
                    "main": "Clouds",
                    "description": "scattered clouds",
                    "icon": "03d"
                }
            ],
            "pop": 0.16
        },
        {
            "dt": 1679205600,
            "temp": 29.72,
            "feels_like": 28.21,
            "pressure": 1010,
            "humidity": 25,
            "dew_point": 7.69,
            "uvi": 7.51,
            "clouds": 34,
            "visibility": 10000,
            "wind_speed": 2.46,
            "wind_deg": 200,
            "wind_gust": 2.61,
            "weather": [
                {
                    "id": 802,
                    "main": "Clouds",
                    "description": "scattered clouds",
                    "icon": "03d"
                }
            ],
            "pop": 0.12
        },
        {
            "dt": 1679209200,
            "temp": 30.84,
            "feels_like": 29.08,
            "pressure": 1008,
            "humidity": 23,
            "dew_point": 7.4,
            "uvi": 8.12,
            "clouds": 6,
            "visibility": 10000,
            "wind_speed": 3.23,
            "wind_deg": 210,
            "wind_gust": 3.28,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679212800,
            "temp": 31.63,
            "feels_like": 29.69,
            "pressure": 1007,
            "humidity": 21,
            "dew_point": 6.96,
            "uvi": 7.2,
            "clouds": 5,
            "visibility": 10000,
            "wind_speed": 3.41,
            "wind_deg": 215,
            "wind_gust": 3.01,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679216400,
            "temp": 32.1,
            "feels_like": 30.07,
            "pressure": 1006,
            "humidity": 20,
            "dew_point": 6.53,
            "uvi": 5.26,
            "clouds": 5,
            "visibility": 10000,
            "wind_speed": 3.61,
            "wind_deg": 219,
            "wind_gust": 2.87,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679220000,
            "temp": 32.14,
            "feels_like": 30.06,
            "pressure": 1005,
            "humidity": 19,
            "dew_point": 6.11,
            "uvi": 2.98,
            "clouds": 9,
            "visibility": 10000,
            "wind_speed": 3.83,
            "wind_deg": 229,
            "wind_gust": 2.61,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679223600,
            "temp": 31.63,
            "feels_like": 29.64,
            "pressure": 1004,
            "humidity": 20,
            "dew_point": 5.79,
            "uvi": 1.22,
            "clouds": 12,
            "visibility": 10000,
            "wind_speed": 4.11,
            "wind_deg": 239,
            "wind_gust": 2.62,
            "weather": [
                {
                    "id": 801,
                    "main": "Clouds",
                    "description": "few clouds",
                    "icon": "02d"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679227200,
            "temp": 30.52,
            "feels_like": 28.7,
            "pressure": 1004,
            "humidity": 21,
            "dew_point": 5.85,
            "uvi": 0.27,
            "clouds": 12,
            "visibility": 10000,
            "wind_speed": 3.98,
            "wind_deg": 245,
            "wind_gust": 3.56,
            "weather": [
                {
                    "id": 801,
                    "main": "Clouds",
                    "description": "few clouds",
                    "icon": "02d"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679230800,
            "temp": 26.18,
            "feels_like": 26.18,
            "pressure": 1004,
            "humidity": 28,
            "dew_point": 6.37,
            "uvi": 0,
            "clouds": 32,
            "visibility": 10000,
            "wind_speed": 3.2,
            "wind_deg": 251,
            "wind_gust": 4.46,
            "weather": [
                {
                    "id": 802,
                    "main": "Clouds",
                    "description": "scattered clouds",
                    "icon": "03n"
                }
            ],
            "pop": 0.02
        },
        {
            "dt": 1679234400,
            "temp": 24.02,
            "feels_like": 23.37,
            "pressure": 1004,
            "humidity": 34,
            "dew_point": 7.09,
            "uvi": 0,
            "clouds": 28,
            "visibility": 10000,
            "wind_speed": 3.02,
            "wind_deg": 280,
            "wind_gust": 4.51,
            "weather": [
                {
                    "id": 802,
                    "main": "Clouds",
                    "description": "scattered clouds",
                    "icon": "03n"
                }
            ],
            "pop": 0.05
        },
        {
            "dt": 1679238000,
            "temp": 22.75,
            "feels_like": 22.05,
            "pressure": 1005,
            "humidity": 37,
            "dew_point": 7.43,
            "uvi": 0,
            "clouds": 21,
            "visibility": 10000,
            "wind_speed": 2.45,
            "wind_deg": 322,
            "wind_gust": 2.87,
            "weather": [
                {
                    "id": 801,
                    "main": "Clouds",
                    "description": "few clouds",
                    "icon": "02n"
                }
            ],
            "pop": 0.03
        },
        {
            "dt": 1679241600,
            "temp": 21.72,
            "feels_like": 20.99,
            "pressure": 1006,
            "humidity": 40,
            "dew_point": 7.44,
            "uvi": 0,
            "clouds": 17,
            "visibility": 10000,
            "wind_speed": 2.13,
            "wind_deg": 357,
            "wind_gust": 2.47,
            "weather": [
                {
                    "id": 801,
                    "main": "Clouds",
                    "description": "few clouds",
                    "icon": "02n"
                }
            ],
            "pop": 0.01
        },
        {
            "dt": 1679245200,
            "temp": 20.27,
            "feels_like": 19.53,
            "pressure": 1006,
            "humidity": 45,
            "dew_point": 7.95,
            "uvi": 0,
            "clouds": 20,
            "visibility": 10000,
            "wind_speed": 0.99,
            "wind_deg": 4,
            "wind_gust": 1.17,
            "weather": [
                {
                    "id": 801,
                    "main": "Clouds",
                    "description": "few clouds",
                    "icon": "02n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679248800,
            "temp": 19.92,
            "feels_like": 19.17,
            "pressure": 1006,
            "humidity": 46,
            "dew_point": 7.91,
            "uvi": 0,
            "clouds": 18,
            "visibility": 10000,
            "wind_speed": 1,
            "wind_deg": 347,
            "wind_gust": 1.39,
            "weather": [
                {
                    "id": 801,
                    "main": "Clouds",
                    "description": "few clouds",
                    "icon": "02n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679252400,
            "temp": 19.65,
            "feels_like": 18.87,
            "pressure": 1006,
            "humidity": 46,
            "dew_point": 7.73,
            "uvi": 0,
            "clouds": 81,
            "visibility": 10000,
            "wind_speed": 0.76,
            "wind_deg": 0,
            "wind_gust": 1.3,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679256000,
            "temp": 19.38,
            "feels_like": 18.57,
            "pressure": 1005,
            "humidity": 46,
            "dew_point": 7.53,
            "uvi": 0,
            "clouds": 83,
            "visibility": 10000,
            "wind_speed": 1.17,
            "wind_deg": 44,
            "wind_gust": 1.36,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0
        },
        {
            "dt": 1679259600,
            "temp": 19.08,
            "feels_like": 18.27,
            "pressure": 1005,
            "humidity": 47,
            "dew_point": 7.43,
            "uvi": 0,
            "clouds": 84,
            "visibility": 10000,
            "wind_speed": 1.65,
            "wind_deg": 28,
            "wind_gust": 1.78,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04n"
                }
            ],
            "pop": 0
        }
    ],
    "daily": [
        {
            "dt": 1679121000,
            "sunrise": 1679100934,
            "sunset": 1679144274,
            "moonrise": 1679092920,
            "moonset": 1679130720,
            "moon_phase": 0.87,
            "temp": {
                "day": 24.01,
                "min": 17.6,
                "max": 29.93,
                "night": 17.86,
                "eve": 26.87,
                "morn": 18.76
            },
            "feels_like": {
                "day": 23.54,
                "night": 17.32,
                "eve": 26.34,
                "morn": 18.13
            },
            "pressure": 1014,
            "humidity": 41,
            "dew_point": 9.76,
            "wind_speed": 5.34,
            "wind_deg": 28,
            "wind_gust": 10.67,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 100,
            "pop": 0.43,
            "rain": 0.29,
            "uvi": 7.32
        },
        {
            "dt": 1679207400,
            "sunrise": 1679187261,
            "sunset": 1679230711,
            "moonrise": 1679182080,
            "moonset": 1679221440,
            "moon_phase": 0.91,
            "temp": {
                "day": 29.72,
                "min": 15.89,
                "max": 32.14,
                "night": 19.92,
                "eve": 30.52,
                "morn": 16.33
            },
            "feels_like": {
                "day": 28.21,
                "night": 19.17,
                "eve": 28.7,
                "morn": 15.51
            },
            "pressure": 1010,
            "humidity": 25,
            "dew_point": 7.69,
            "wind_speed": 4.11,
            "wind_deg": 239,
            "wind_gust": 4.51,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 34,
            "pop": 0.37,
            "rain": 0.14,
            "uvi": 8.12
        },
        {
            "dt": 1679293800,
            "sunrise": 1679273588,
            "sunset": 1679317147,
            "moonrise": 1679270880,
            "moonset": 1679312040,
            "moon_phase": 0.94,
            "temp": {
                "day": 27.39,
                "min": 17.38,
                "max": 30.64,
                "night": 17.38,
                "eve": 29.47,
                "morn": 18.45
            },
            "feels_like": {
                "day": 26.8,
                "night": 17.21,
                "eve": 28,
                "morn": 17.6
            },
            "pressure": 1007,
            "humidity": 33,
            "dew_point": 9.53,
            "wind_speed": 5.93,
            "wind_deg": 145,
            "wind_gust": 8.23,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 98,
            "pop": 0.92,
            "rain": 2.81,
            "uvi": 6.01
        },
        {
            "dt": 1679380200,
            "sunrise": 1679359915,
            "sunset": 1679403582,
            "moonrise": 1679359380,
            "moonset": 1679402520,
            "moon_phase": 0,
            "temp": {
                "day": 24.1,
                "min": 15.85,
                "max": 27.98,
                "night": 19.24,
                "eve": 27.13,
                "morn": 15.85
            },
            "feels_like": {
                "day": 23.87,
                "night": 18.79,
                "eve": 26.76,
                "morn": 15.74
            },
            "pressure": 1009,
            "humidity": 50,
            "dew_point": 13.11,
            "wind_speed": 3.1,
            "wind_deg": 100,
            "wind_gust": 6.19,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 100,
            "pop": 0.77,
            "rain": 3.87,
            "uvi": 7.66
        },
        {
            "dt": 1679466600,
            "sunrise": 1679446242,
            "sunset": 1679490018,
            "moonrise": 1679447760,
            "moonset": 1679492880,
            "moon_phase": 0.02,
            "temp": {
                "day": 28.15,
                "min": 16.13,
                "max": 31.96,
                "night": 19.46,
                "eve": 30.59,
                "morn": 16.13
            },
            "feels_like": {
                "day": 27.47,
                "night": 18.92,
                "eve": 28.81,
                "morn": 15.81
            },
            "pressure": 1009,
            "humidity": 35,
            "dew_point": 11.41,
            "wind_speed": 3.58,
            "wind_deg": 303,
            "wind_gust": 5.23,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 7,
            "pop": 0.39,
            "rain": 0.9,
            "uvi": 8.54
        },
        {
            "dt": 1679553000,
            "sunrise": 1679532569,
            "sunset": 1679576454,
            "moonrise": 1679536140,
            "moonset": 1679583120,
            "moon_phase": 0.06,
            "temp": {
                "day": 30.3,
                "min": 17.06,
                "max": 33.49,
                "night": 21.35,
                "eve": 32.03,
                "morn": 17.06
            },
            "feels_like": {
                "day": 28.7,
                "night": 20.74,
                "eve": 29.91,
                "morn": 16.44
            },
            "pressure": 1007,
            "humidity": 25,
            "dew_point": 8.05,
            "wind_speed": 4.48,
            "wind_deg": 296,
            "wind_gust": 5.83,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 0,
            "pop": 0.31,
            "rain": 0.44,
            "uvi": 9
        },
        {
            "dt": 1679639400,
            "sunrise": 1679618895,
            "sunset": 1679662889,
            "moonrise": 1679624520,
            "moonset": 1679673360,
            "moon_phase": 0.09,
            "temp": {
                "day": 26.88,
                "min": 16.59,
                "max": 30.46,
                "night": 17.14,
                "eve": 21.72,
                "morn": 18.51
            },
            "feels_like": {
                "day": 26.55,
                "night": 16.76,
                "eve": 21.46,
                "morn": 18.19
            },
            "pressure": 1008,
            "humidity": 35,
            "dew_point": 10.28,
            "wind_speed": 9.59,
            "wind_deg": 42,
            "wind_gust": 16.64,
            "weather": [
                {
                    "id": 502,
                    "main": "Rain",
                    "description": "heavy intensity rain",
                    "icon": "10d"
                }
            ],
            "clouds": 100,
            "pop": 0.96,
            "rain": 17.06,
            "uvi": 9
        },
        {
            "dt": 1679725800,
            "sunrise": 1679705222,
            "sunset": 1679749325,
            "moonrise": 1679713020,
            "moonset": 1679763540,
            "moon_phase": 0.13,
            "temp": {
                "day": 27.37,
                "min": 15.76,
                "max": 30.04,
                "night": 19.54,
                "eve": 27.79,
                "morn": 15.76
            },
            "feels_like": {
                "day": 26.66,
                "night": 18.67,
                "eve": 26.71,
                "morn": 15.22
            },
            "pressure": 1011,
            "humidity": 30,
            "dew_point": 8.08,
            "wind_speed": 5.78,
            "wind_deg": 300,
            "wind_gust": 8.34,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "clouds": 0,
            "pop": 0,
            "uvi": 9
        }
    ]
};

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

type HourlyWeather =  CommonWeather & {
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

function Round(props: { value: number, precision?: number }) {
    const value = Math.round(props.value * (props.precision || 1)) / (props.precision || 1);
    return <>{value}</>;
}

export default function Weather(props: Weather) {
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
                                            <h2 className="display-2"><strong><Round value={props.current.temp} precision={1} />°C</strong></h2>
                                            <p className="text-muted mb-0">Roorkee, India.</p>
                                        </div>
                                        <div>
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp"
                                                width="150px" />
                                        </div>
                                    </div>
                                </Carousel.Item>
                            </Carousel>
                        </div>
                    </div>
                    <Card className="mb-4" style={{ borderRadius: '25px' }}>
                        <Card.Body className="p-4">
                            <div id="demo2" className="carousel slide" data-ride="carousel">
                                {/* Indicators */}
                                <ul className="carousel-indicators mb-0">
                                    <li data-target="#demo2" data-slide-to="0"></li>
                                    <li data-target="#demo2" data-slide-to="1" className="active"></li>
                                    <li data-target="#demo2" data-slide-to="2"></li>
                                </ul>
                                {/* Carousel inner */}
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <div className="d-flex justify-content-around text-center mb-4 pb-3 pt-2">
                                            <div className="flex-column">
                                                <p className="small"><strong>21°C</strong></p>
                                                <FontAwesomeIcon icon={faSun} className="fa-2x mb-3" style={{ color: '#ddd' }} />
                                                <p className="mb-0"><strong>12:00</strong></p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '.65rem' }}>PM</p>
                                            </div>
                                            <div className="flex-column">
                                                <p className="small"><strong>2°C</strong></p>
                                                <FontAwesomeIcon icon={faSun} className="fa-2x mb-3" style={{ color: '#ddd' }} />
                                                <p className="mb-0"><strong>1:00</strong></p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '.65rem' }}>PM</p>
                                            </div>
                                            <div className="flex-column">
                                                <p className="small"><strong>20°C</strong></p>
                                                <FontAwesomeIcon icon={faCloud} className="fa-2x mb-3" style={{ color: '#ddd' }} />
                                                <p className="mb-0"><strong>2:00</strong></p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '.65rem' }}>PM</p>
                                            </div>
                                            <div className="flex-column">
                                                <p className="small"><strong>19°C</strong></p>
                                                <FontAwesomeIcon icon={faCloud} className="fa-2x mb-3" style={{ color: '#ddd' }} />
                                                <p className="mb-0"><strong>3:00</strong></p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '.65rem' }}>PM</p>
                                            </div>
                                            <div className="flex-column">
                                                <p className="small"><strong>18°C</strong></p>
                                                <FontAwesomeIcon icon={faCloudShowersHeavy} className="fa-2x mb-3" style={{ color: '#ddd' }} />
                                                <p className="mb-0"><strong>4:00</strong></p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '.65rem' }}>PM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Carousel style={{ borderRadius: 25 }}>
                        <Carousel.Item>
                            <div className="d-flex justify-content-around text-center mb-4 pb-3 pt-2">
                                <div className="flex-column">
                                    <p className="small"><strong>21°C</strong></p>
                                    <i className="fas fa-sun fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                    <p className="mb-0"><strong>Mon</strong></p>
                                </div>
                                <div className="flex-column">
                                    <p className="small"><strong>20°C</strong></p>
                                    <i className="fas fa-sun fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                    <p className="mb-0"><strong>Tue</strong></p>
                                </div>
                                <div className="flex-column">
                                    <p className="small"><strong>16°C</strong></p>
                                    <i className="fas fa-cloud fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                    <p className="mb-0"><strong>Wed</strong></p>
                                </div>
                                <div className="flex-column">
                                    <p className="small"><strong>17°C</strong></p>
                                    <i className="fas fa-cloud fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                    <p className="mb-0"><strong>Thu</strong></p>
                                </div>
                                <div className="flex-column">
                                    <p className="small"><strong>18°C</strong></p>
                                    <i className="fas fa-cloud-showers-heavy fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                    <p className="mb-0"><strong>Fri</strong></p>
                                </div>
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
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    return {
        props: weatherDoc
    }
}