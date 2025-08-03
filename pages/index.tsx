
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap'
import { uiDateFormat, uiRound } from '../components/ui/uiUtils';
import { getDocument } from '../firebase/firestore';
import { Weather } from './weather/[id]';
import HeadTag from '../components/ui/headTag';
import { getNews, getPostsWithDetails } from '../service/PostService';
import PostList from '../components/ui/postList';
import NewsList from '../components/ui/newsList';

export default function Home({ data, posts, news, cacheCreatedAt }) {

  const [weather, setWeather] = useState({} as Weather)
  const [weatherText, setWeatherText] = useState('' as string)
  const [weatherImg, setWeatherImg] = useState('' as string)

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(w => setWeather(w));
  }, []);

  useEffect(() => {
    if (weather.current) {
      setWeatherText(`${uiRound(weather.current.temp, 1)}°C, ${weather.current.weather[0].description}`);
      setWeatherImg('https://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '@2x.png');
    }
  }, [weather]);

  return (
    <>
      <HeadTag title="Roorkee.org: Town Information." description="Roorkee.org: Town Information." />
      <Container>
        <div className="p-4 p-md-5 mb-4 rounded text-bg-dark">
          <div className="jumbotron col-md-10 px-0">
            <h1 className="display-4 fst-italic">{weatherText}<Image className='d-none d-md-inline' src={weatherImg} alt='Weather Image' /></h1>
            <p className="lead my-3">{data.heroTextDesc}</p>
            <p className="lead mb-0"><Link href="/weather/roorkee-in" className="text-white fw-bold">Detailed weather forcast...</Link></p>
          </div>
        </div>

        <Row className="mb-2">
          <Col>
            <h2 className="pb-4 mb-4 fst-italic border-bottom">
              News about Roorkee
            </h2>
            <NewsList news={news} />
          </Col>
        </Row>

        <Row className="g-5 text-black">
          <Col md={8}>
            <h3 className="pb-4 mb-4 fst-italic border-bottom">
              From the Firehose
            </h3>
            <PostList posts={posts} />

          </Col>

          <Col md={4}>
            <div className="position-sticky">
              <div className="p-4 mb-3 bg-light rounded">
                <h4 className="fst-italic">About</h4>
                <p className="mb-0">Born in 2001, this website is a personal project to bring people of this town together, not affiliated to government / corporation.</p>
              </div>
              <div className="p-4">
                <h4 className="fst-italic">Elsewhere</h4>
                <ol className="list-unstyled">
                  <li><a href="#">GitHub</a></li>
                  <li><a href="#">Twitter</a></li>
                  <li><a href="#">Facebook</a></li>
                </ol>
              </div>
            </div>
          </Col>
        </Row >
        <Row>
          <Col>
            <hr />
            <p className="text-center">This page was generated at {cacheCreatedAt}</p>
          </Col>
        </Row>
      </Container >
    </>
  )
}

/**
 * This function gets called at build time on server-side.
 * It won't be called on client-side
 */
export async function getStaticProps() {
  const resp = await getDocument({ path: 'appconfig', pathSegments: ['homepage'] });
  const postDisplay = await getPostsWithDetails();
  console.log('Posts fetched:', postDisplay.length);
  const news = await getNews({ limit: 8 });
  console.log('News fetched:', news.length);
  const cacheCreatedAt = uiDateFormat((new Date()).getTime());
  return {
    props: {
      data: resp,
      posts: postDisplay,
      news: news,
      cacheCreatedAt
    },
    revalidate: 86400, // regenerate page every day
  }
}
